<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Property;
use App\Models\User;
use App\Models\Pdf as PdfModel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Exception;

class InspectionPdfService
{
    /**
     * Generate PDF from inspection data stored in Pdf model
     * 
     * @param int $tenantId
     * @param int $propertyId  
     * @param int|null $pdfId
     * @return PdfModel|null
     */
    public function generateInspectionPdf(int $tenantId, int $propertyId, ?int $pdfId = null): ?PdfModel
    {
        try {
            // Get the PDF record
            $pdfRecord = null;
            
            if ($pdfId) {
                $pdfRecord = PdfModel::withTrashed()->find($pdfId);
            }
            
            if (!$pdfRecord) {
                $pdfRecord = PdfModel::withTrashed()
                    ->where('tenant_id', $tenantId)
                    ->where('property_id', $propertyId)
                    ->latest()
                    ->first();
            }

            if (!$pdfRecord) {
                Log::warning('No PDF record found for generation', [
                    'tenant_id' => $tenantId,
                    'property_id' => $propertyId,
                    'pdf_id' => $pdfId
                ]);
                return null;
            }

            // Get tenant and property details as arrays (not objects)
            $tenant = User::findOrFail($tenantId);
            $property = Property::findOrFail($propertyId);

            // Convert to arrays for consistent access in view
            $tenantArray = [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'email' => $tenant->email ?? '',
            ];

            $propertyArray = [
                'id' => $property->id,
                'name' => $property->name,
                'address' => $property->address,
                'city' => $property->city ?? '',
                'state' => $property->state ?? '',
                'zip' => $property->zip ?? '',
            ];

            // Extract inspection data from draft_data JSON field
            $inspectionData = $pdfRecord->draft_data ?? [];
            
            // Prepare checklist items with images
            $checklistItems = [];
            $allImages = [];
            
            if (isset($inspectionData['checklists']) && is_array($inspectionData['checklists'])) {
                foreach ($inspectionData['checklists'] as $item) {
                    // Get checklist item details
                    $checklistItem = \App\Models\ChecklistItem::find($item['checklist_item_id']);
                    $itemName = $checklistItem ? $checklistItem->name : 'Unknown Item';
                    
                    // Process images - convert URLs to absolute paths for PDF
                    $imagePaths = [];
                    if (isset($item['images']) && is_array($item['images'])) {
                        foreach ($item['images'] as $imageUrl) {
                            // Convert storage URL to absolute path
                            $relativePath = str_replace('/storage/', '', $imageUrl);
                            if (Storage::disk('public')->exists($relativePath)) {
                                $imagePaths[] = Storage::disk('public')->path($relativePath);
                            } else {
                                Log::warning('Image file not found', ['path' => $relativePath]);
                            }
                        }
                    }
                    
                    $checklistItems[] = [
                        'id' => $item['checklist_item_id'],
                        'name' => $itemName,
                        'status' => $this->getStatusText($item['checklist_value'] ?? 0),
                        'status_value' => $item['checklist_value'] ?? 0,
                        'images' => $imagePaths,
                        'is_checked' => $item['is_checked'] ?? true,
                    ];
                    
                    // Collect all images with their associated checklist item name
                    foreach ($imagePaths as $imagePath) {
                        $allImages[] = [
                            'path' => $imagePath,
                            'checklist_item_name' => $itemName,
                        ];
                    }
                }
            }

            // Prepare data for PDF view (using arrays instead of objects)
            $data = [
                'tenant' => $tenantArray, // Now this is an array
                'property' => $propertyArray, // Now this is an array
                'checklist_items' => $checklistItems,
                'all_images' => $allImages,
                'inspection_type' => $inspectionData['inspection_type'] ?? null,
                'inspection_type_text' => $this->getInspectionTypeText($inspectionData['inspection_type'] ?? null),
                'general_comment' => $inspectionData['general_comment'] ?? $pdfRecord->comment,
                'status' => $pdfRecord->status,
                'status_text' => ucfirst($pdfRecord->status),
                'submitted_at' => $inspectionData['submitted_at'] ?? $pdfRecord->created_at,
                'updated_at' => $inspectionData['updated_at'] ?? $pdfRecord->updated_at,
                'generated_date' => now()->format('F d, Y H:i:s'),
                'inspection_id' => $pdfRecord->id,
            ];

            // Generate PDF
            $pdf = Pdf::loadView('pdfs.inspection-checklist', $data);
            $pdf->setPaper('a4', 'portrait');

            // Generate unique filename
            $timestamp = now()->timestamp;
            $filename = "inspection_{$tenantId}_{$propertyId}_{$timestamp}.pdf";
            $pdfPath = "pdfs/{$filename}";

            // Delete old PDF file if it exists
            if ($pdfRecord->pdf_path && Storage::disk('public')->exists($pdfRecord->pdf_path)) {
                Storage::disk('public')->delete($pdfRecord->pdf_path);
                Log::info('Deleted old PDF file', ['old_path' => $pdfRecord->pdf_path]);
            }
            
            // Store the PDF file
            Storage::disk('public')->put($pdfPath, $pdf->output());

            // Update PDF record
            $pdfRecord->update([
                'pdf_path' => $pdfPath,
                'original_name' => $filename,
            ]);

            Log::info('PDF generated and stored successfully', [
                'pdf_id' => $pdfRecord->id,
                'tenant_id' => $tenantId,
                'property_id' => $propertyId,
                'filename' => $filename,
            ]);

            return $pdfRecord;

        } catch (Exception $e) {
            Log::error('PDF generation failed', [
                'tenant_id' => $tenantId,
                'property_id' => $propertyId,
                'pdf_id' => $pdfId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            throw new Exception('Failed to generate inspection PDF: ' . $e->getMessage());
        }
    }

    /**
     * Get status text from value
     */
    private function getStatusText(int $value): string
    {
        return match($value) {
            0 => 'Pass',
            1 => 'Fail', 
            2 => 'N/A',
            default => 'Not Inspected'
        };
    }

    /**
     * Get inspection type text from value
     */
    private function getInspectionTypeText(?int $value): string
    {
        return match($value) {
            0 => 'Move In Inspection',
            1 => 'Move Out Inspection',
            2 => 'Unit Inspection',
            default => 'Standard Inspection'
        };
    }
}