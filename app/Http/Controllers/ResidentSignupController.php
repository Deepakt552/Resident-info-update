<?php

namespace App\Http\Controllers;

use App\Models\MailLog;
use App\Models\Property;
use App\Models\ResidentSignup;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Throwable;
use App\Services\EmailService;
use App\Jobs\SendResidentSignupEmailJob;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResidentSignupMail;

class ResidentSignupController extends Controller
{
    protected $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }
    /**
     * Display the resident signup form
     */
    public function index()
    {
        return Inertia::render('ResidentSignup/Index');
    }

    /**
     * Search properties by name
     */
    public function searchProperty(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
        ]);

        $query = $request->input('query');

        $properties = Property::where('name', 'LIKE', '%' . $query . '%')
            ->limit(10)
            ->get(['id', 'name', 'address']);

        return response()->json($properties);
    }

    /**
     * Store a newly created resident signup
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'property_id' => 'required|exists:properties,id',
            'unitno' => [
                'required',
                'string',
                'max:100',
            ],
            'tenants' => 'required|array|min:1|max:4',
            'tenants.*.full_name' => 'required|string|max:255',
            'tenants.*.email' => 'required|email|max:255',
            'tenants.*.phone' => 'required|string|max:20',
            'tenants.*.emergency_contact_name' => 'required|string|max:255',
            'tenants.*.emergency_contact_phone' => 'required|string|max:20',
            'tenants.*.signature' => 'required|string',
            // 'tenants.*.date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        Log::info('Starting resident signup store process', [
            'property_id' => $request->property_id,
            'unitno' => $request->unitno,
            'tenant_count' => count($request->tenants ?? [])
        ]);

        // Generate signup UID
        $signupUid = 'RS' . time() . rand(100, 999);
        Log::info('Generated signup UID', ['signup_uid' => $signupUid]);

        // Process each tenant's signature
        $processedTenants = [];
        foreach ($validated['tenants'] as $index => $tenant) {
            try {
                Log::info('Processing tenant signature', [
                    'tenant_index' => $index,
                    'tenant_name' => $tenant['full_name'] ?? 'Unknown'
                ]);
                // Decode base64 image
                $signatureData = $tenant['signature'];

                // Remove data URL prefix if present
                if (strpos($signatureData, 'data:image/png;base64,') === 0) {
                    $signatureData = substr($signatureData, strlen('data:image/png;base64,'));
                }

                // Decode base64 string
                $imageData = base64_decode($signatureData);

                if ($imageData === false) {
                    return response()->json([
                        'errors' => [
                            "tenants.{$index}.signature" => ['Invalid signature data']
                        ]
                    ], 422);
                }

                // Generate unique filename
                $filename = 'signature_' . $signupUid . '_tenant_' . ($index + 1) . '_' . Str::random(10) . '.png';

                // Store the signature in storage/app/public/signatures
                $path = 'signatures/' . $filename;
                try {
                    Storage::disk('public')->put($path, $imageData);
                    Log::info('Signature saved successfully', [
                        'path' => $path,
                        'size' => strlen($imageData)
                    ]);
                } catch (Exception $e) {
                    Log::error('Failed to save signature to storage', [
                        'path' => $path,
                        'error' => $e->getMessage()
                    ]);

                    return response()->json([
                        'errors' => [
                            "tenants.{$index}.signature" => ['Failed to save signature image']
                        ]
                    ], 500);
                }
                // Store the file path instead of base64 data
                $tenant['signature'] = 'storage/' . $path;
                $processedTenants[] = $tenant;
            } catch (Exception $e) {
                Log::error('Error processing tenant signature', [
                    'tenant_index' => $index,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);

                return response()->json([
                    'errors' => [
                        "tenants.{$index}.signature" => ['Error processing signature: ' . $e->getMessage()]
                    ]
                ], 500);
            }
        }

        try {
            $residentSignup = ResidentSignup::create([
                'property_id' => $validated['property_id'],
                'signup_uid' => $signupUid,
                'unitno' => $validated['unitno'],
                'tenants' => $processedTenants,
            ]);

            Log::info('Resident signup record created', [
                'id' => $residentSignup->id,
                'signup_uid' => $signupUid
            ]);

            // Generate PDF - try-catch with detailed logging
            try {
                Log::info('Generating PDF for resident signup', ['id' => $residentSignup->id]);
                $pdfGenerated = $this->generateAndSavePdfOnly($residentSignup->id);

                if ($pdfGenerated) {
                    Log::info('PDF generation completed successfully', ['id' => $residentSignup->id]);
                    // Send email after successful PDF generation
                    try {
                        // Prepare email data
                        $tenantNames = collect($processedTenants)
                            ->pluck('full_name')
                            ->implode(', ');

                        $emailData = [
                            'property_name' => $residentSignup->property->name ?? 'N/A',
                            'unit_number' => $residentSignup->unitno ?? 'N/A',
                            'signup_uid' => $residentSignup->signup_uid ?? 'N/A',
                            'tenant_names' => $tenantNames,
                        ];

                        // Get full PDF path
                        $pdfFullPath = storage_path('app/public/pdfs/resident_signup_' . $residentSignup->signup_uid . '.pdf');

                        // Send email
                        // $emailResult = $this->emailService->sendResidentSignupEmail(
                        //     $emailData,
                        //     $pdfFullPath,
                        //     $residentSignup->property_id
                        // );

                        SendResidentSignupEmailJob::dispatch(
                            $emailData,
                            $pdfFullPath,
                            $residentSignup->property_id
                        );

                        Log::info('Resident signup email job dispatched', [
                            'signup_uid' => $residentSignup->signup_uid
                        ]);


                    } catch (Exception $e) {
                        Log::error('Failed to send email after PDF generation', [
                            'id' => $residentSignup->id,
                            'error' => $e->getMessage()
                        ]);
                        // Continue execution - don't break the flow
                    }
                } else {
                    Log::warning('PDF generation returned false', ['id' => $residentSignup->id]);
                }
            } catch (Throwable $e) {
                Log::error('PDF generation failed with exception', [
                    'error' => $e->getMessage(),
                    'id' => $residentSignup->id,
                    'trace' => $e->getTraceAsString()
                ]);
            }
        } catch (Exception $e) {
            Log::error('Failed to create resident signup record', [
                'error' => $e->getMessage(),
                'signup_uid' => $signupUid,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }

        return response()->json([
            'message' => 'Resident Signup saved successfully.',
            'data' => $residentSignup
        ], 201);
    }

    /**
     * Display a listing of resident signups
     */
    public function list(Request $request)
    {
        $query = ResidentSignup::with('property');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('signup_uid', 'LIKE', '%' . $search . '%')
                    ->orWhere('unitno', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('property', function ($propertyQuery) use ($search) {
                        $propertyQuery->where('name', 'LIKE', '%' . $search . '%');
                    });
            });
        }

        $residentSignups = $query->latest()->paginate(10);

        return Inertia::render('ResidentSignup/List', [
            'residentSignups' => $residentSignups,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display the specified resident signup
     */
    public function show($id)
    {
        $residentSignup = ResidentSignup::with('property')->findOrFail($id);

        return Inertia::render('ResidentSignup/View', [
            'residentSignup' => $residentSignup,
        ]);
    }
    /**
     * Remove the specified resident signup from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        try {
            Log::info('Attempting to delete resident signup', ['id' => $id]);

            $residentSignup = ResidentSignup::findOrFail($id);

            // Delete associated PDF file if exists
            if ($residentSignup->pdf_path) {
                $pdfPath = str_replace('storage/', '', $residentSignup->pdf_path);
                if (Storage::disk('public')->exists($pdfPath)) {
                    Storage::disk('public')->delete($pdfPath);
                    Log::info('Deleted associated PDF file', ['path' => $pdfPath]);
                }
            }

            // Delete associated signature images
            if ($residentSignup->tenants) {
                foreach ($residentSignup->tenants as $tenant) {
                    if (isset($tenant['signature'])) {
                        // Extract path from storage URL
                        $signaturePath = str_replace('storage/', '', $tenant['signature']);
                        if (Storage::disk('public')->exists($signaturePath)) {
                            Storage::disk('public')->delete($signaturePath);
                            Log::info('Deleted signature image', ['path' => $signaturePath]);
                        }
                    }
                }
            }

            // Delete the record
            $residentSignup->delete();

            Log::info('Resident signup deleted successfully', ['id' => $id]);

            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Resident signup deleted successfully.'
                ], 200);
            }

            return redirect()->back()->with('success', 'Resident signup deleted successfully.');

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Resident signup not found for deletion', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Resident signup not found.'
                ], 404);
            }

            return redirect()->back()->with('error', 'Resident signup not found.');

        } catch (Exception $e) {
            Log::error('Failed to delete resident signup', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Failed to delete resident signup: ' . $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to delete resident signup. Please try again.');
        }
    }
    private function generateAndSavePdfOnly($id)
    {
        try {
            Log::info('Step 1: Starting PDF generation', ['id' => $id]);

            // Fetch the resident signup with property relationship
            $residentSignup = ResidentSignup::with('property')->findOrFail($id);

            Log::info('Step 2: Resident signup fetched', [
                'id' => $id,
                'signup_uid' => $residentSignup->signup_uid,
                'has_tenants' => !empty($residentSignup->tenants)
            ]);

            // Prepare data for PDF view - NO BASE64 CONVERSION
            Log::info('Step 3: Preparing PDF data', ['id' => $id]);

            // Get company logo URL/path
            // $logo = env('COMPANY_LOGO');
            $path = public_path('images/Im_logo.png');

            $logo = null;

            if (file_exists($path)) {
                $logo = 'data:image/png;base64,' . base64_encode(file_get_contents($path));
            }
            // New method to get path

            $data = [
                'tenants' => $residentSignup->tenants, // Pass as is, no conversion
                'unitno' => $residentSignup->unitno ?? 'N/A',
                'propertyName' => $residentSignup->property->name ?? 'N/A',
                'propertyAddress' => $residentSignup->property->address ?? 'N/A',
                'logo' => $logo, // Pass path, not base64
                'public_path' => public_path(), // Pass public path for file access
                'storage_path' => storage_path('app/public/'), // Pass storage path
            ];

            Log::info('Step 4: PDF data prepared', [
                'id' => $id,
                'tenant_count' => count($data['tenants']),
                'has_logo' => !is_null($logo),
                'unitno' => $data['unitno'],
                'property' => $data['propertyName'],
                'logopath' => $logo,
                'logo' => asset('images/Im_logo.png'),
            ]);

            // Generate PDF
            Log::info('Step 5: Loading PDF view', ['id' => $id]);
            $pdf = Pdf::loadView('pdfs.resident-signup', $data);

            Log::info('Step 6: Setting PDF options', ['id' => $id]);
            $pdf->setPaper('a4', 'portrait')
                ->setOptions([
                    'defaultFont' => 'Helvetica',
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled' => true, // Enable remote for image loading
                    'dpi' => 96,
                    'enable_php' => true, // Enable PHP for file access
                ]);

            Log::info('Step 7: Generating PDF output', ['id' => $id]);
            $pdfOutput = $pdf->output();

            Log::info('Step 8: PDF output generated', [
                'id' => $id,
                'size' => strlen($pdfOutput)
            ]);

            // Save PDF to storage
            Log::info('Step 9: Saving PDF to storage', ['id' => $id]);
            $pdfPath = 'pdfs/resident_signup_' . $residentSignup->signup_uid . '.pdf';
            Storage::disk('public')->put($pdfPath, $pdfOutput);

            Log::info('Step 10: PDF saved to storage', [
                'id' => $id,
                'path' => $pdfPath,
                'size' => strlen($pdfOutput)
            ]);

            // Update record with PDF path
            $residentSignup->update([
                'pdf_path' => 'storage/' . $pdfPath
            ]);

            Log::info('PDF generated and saved successfully', ['id' => $id]);
            return true;

        } catch (Throwable $e) {
            Log::error('PDF generation failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Get company logo path (not base64)
     */
    private function getCompanyLogoPath()
    {
        try {
            // Check multiple locations
            $logoPaths = [
                public_path('images/Im_logo.png'),
                storage_path('app/public/images/Im_logo.png'),
                public_path('logo/Im_logo.png'),
                storage_path('app/public/logo/Im_logo.png'),
            ];

            foreach ($logoPaths as $path) {
                if (file_exists($path)) {
                    Log::info('Company logo found', ['path' => $path]);
                    return $path; // Return absolute path
                }
            }

            Log::warning('Company logo not found in any location');
            return null;

        } catch (Exception $e) {
            Log::error('Error while retrieving company logo', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }
    /**
     * Generate PDF without returning a download response
     * 
     * @param int $id
     * @return bool
     */
    /**
     * Stream PDF in browser
     * 
     * @param int $id
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function streamPdf($id)
    {
        try {
            Log::info('Starting PDF stream for resident signup', ['id' => $id]);

            // Fetch the resident signup with property relationship
            $residentSignup = ResidentSignup::with('property')->findOrFail($id);

            Log::info('Resident signup found for streaming', [
                'signup_uid' => $residentSignup->signup_uid,
                'unitno' => $residentSignup->unitno
            ]);

            // Prepare data for PDF view
            $data = [
                'tenants' => $residentSignup->tenants ?? [],
                'unitno' => $residentSignup->unitno ?? 'N/A',
                'propertyName' => $residentSignup->property->name ?? 'N/A',
                'propertyAddress' => $residentSignup->property->address ?? 'N/A',
                'logo' => $this->getCompanyLogo(),
            ];

            Log::info('PDF data prepared for streaming', [
                'tenant_count' => count($data['tenants']),
                'has_logo' => !is_null($data['logo'])
            ]);

            // Generate PDF
            $pdf = Pdf::loadView('pdfs.resident-signup', $data)
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'defaultFont' => 'Helvetica',
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled' => true,
                    'dpi' => 96,
                    'enable_php' => false,
                ]);

            Log::info('PDF generated successfully for streaming');

            // Stream PDF
            $filename = 'resident-signup-' . $residentSignup->signup_uid . '.pdf';
            Log::info('PDF streaming initiated', ['filename' => $filename]);

            return $pdf->stream($filename);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Resident signup not found for PDF streaming', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->with('error', 'Resident signup record not found.');

        } catch (Exception $e) {
            Log::error('PDF streaming failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Failed to stream PDF. Please try again.');
        }
    }

    /**
     * Get company logo
     * 
     * @return string|null
     */
    /**
     * Generate PDF from existing stored PDF or regenerate
     * 
     * @param int $id
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function downloadPdf($id)
    {
        try {
            Log::info('Attempting to download existing PDF', ['id' => $id]);

            $residentSignup = ResidentSignup::with('property')->findOrFail($id);

            // Check if PDF already exists
            if ($residentSignup->pdf_path) {
                $pdfPath = str_replace('storage/', '', $residentSignup->pdf_path);

                if (Storage::disk('public')->exists($pdfPath)) {
                    Log::info('Existing PDF found, serving download', ['path' => $pdfPath]);

                    $fullPath = Storage::disk('public')->path($pdfPath);
                    $filename = 'resident-signup-' . $residentSignup->signup_uid . '.pdf';

                    return response()->download($fullPath, $filename);
                } else {
                    Log::warning('PDF path exists in database but file not found', [
                        'path' => $pdfPath,
                        'id' => $id
                    ]);
                }
            }

            Log::info('No existing PDF found, generating new one', ['id' => $id]);
            return $this->streamPdf($id);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Resident signup not found for PDF download', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()->with('error', 'Resident signup record not found.');

        } catch (Exception $e) {
            Log::error('PDF download failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Failed to download PDF. Please try again.');
        }
    }

    public function sendEmail(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'id' => 'required|exists:resident_signups,id',
            'email' => 'required|email'
        ]);
        $propertyId = '';
        try {
            // Fetch resident signup with property relationship
            $residentSignup = ResidentSignup::with('property')->findOrFail($validated['id']);
            $propertyId = $residentSignup->property_id;
            // Prepare email data
            $emailData = [
                'property_name' => $residentSignup->property->name ?? 'N/A',
                'unit_number' => $residentSignup->unitno,
                'signup_uid' => $residentSignup->signup_uid,
                'tenant_names' => collect($residentSignup->tenants)
                    ->pluck('name')
                    ->filter()
                    ->implode(', ')
            ];

            // Send email
            Mail::to($validated['email'])
                ->send(new ResidentSignupMail(
                    $emailData,
                    $residentSignup->pdf_path
                ));

            // Log success
            Log::info('Resident signup email sent successfully', [
                'resident_signup_id' => $residentSignup->id,
                'signup_uid' => $residentSignup->signup_uid,
                'sent_to' => $validated['email']
            ]);

            // Get the full PDF path
            $pdfPath = $residentSignup->pdf_path;
            if ($pdfPath) {
                // Remove 'storage/' prefix if present
                $pdfPath = str_replace('storage/', '', $pdfPath);
                $pdfFullPath = storage_path('app/public/' . $pdfPath);

                // Check if file actually exists
                if (!file_exists($pdfFullPath)) {
                    throw new Exception('PDF file not found at: ' . $pdfFullPath);
                }

                // Extract filename for logging
                $pdfFileName = basename($pdfPath);
            } else {
                throw new Exception('PDF path is null for resident signup ID: ' . $residentSignup->id);
            }

            // Log primary email success
            $this->logEmail(
                 $pdfFileName,
                'mail sent mannual ' . $validated['email'],
                $propertyId,
                1,
                null
            );
            return redirect()->back()->with('success', 'Email sent successfully!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->with('error', 'Validation failed: ' . $e->errors());

        } catch (\Exception $e) {
            // Log error
            Log::error('Failed to send resident signup email', [
                'error' => $e->getMessage(),
                'resident_signup_id' => $request->id ?? null
            ]);
            $this->logEmail(
                $pdfFileName,
                'mail sent failed',
                $propertyId,
                0,
                $e->getMessage()
            );
            return redirect()->back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }
    private function logEmail(string $document, string $action, int $propertyId, int $status, ?string $errorMessage = null): void
    {
        try {
            MailLog::create([
                'document' => $document,
                'action' => $action,
                'user_id' => auth()->id() ?? null,
                'property_id' => $propertyId,
                'status' => $status,
                'sent_at' => now(),
                'error_message' => $errorMessage,
            ]);

            Log::info('Email logged in mail_logs', [
                'document' => $document,
                'action' => $action,
                'property_id' => $propertyId,
                'status' => $status
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to log email in mail_logs', [
                'error' => $e->getMessage(),
                'document' => $document,
                'action' => $action
            ]);
        }
    }
}