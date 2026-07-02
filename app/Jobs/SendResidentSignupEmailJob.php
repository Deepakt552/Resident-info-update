<?php

namespace App\Jobs;

use App\Services\EmailService;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendResidentSignupEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $emailData;
    public $pdfPath;
    public $propertyId;

    /**
     * Number of attempts
     */
    public $tries = 3;

    /**
     * Timeout in seconds
     */
    public $timeout = 120;

    /**
     * Create a new job instance.
     */
    public function __construct(array $emailData, string $pdfPath, int $propertyId)
    {
        $this->emailData = $emailData;
        $this->pdfPath = $pdfPath;
        $this->propertyId = $propertyId;
    }

    /**
     * Execute the job.
     */
    public function handle(EmailService $emailService): void
    {
        try {

            Log::info('SendResidentSignupEmailJob started', [
                'property_id' => $this->propertyId,
                'pdf_path' => $this->pdfPath,
            ]);

            $result = $emailService->sendResidentSignupEmail(
                $this->emailData,
                $this->pdfPath,
                $this->propertyId
            );

            Log::info('Resident signup email sent successfully', [
                'property_id' => $this->propertyId,
                'result' => $result,
            ]);

        } catch (Exception $e) {

            Log::error('SendResidentSignupEmailJob failed', [
                'property_id' => $this->propertyId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e; // Queue retry karegi
        }
    }

    /**
     * Called when job fails permanently.
     */
    public function failed(Exception $exception): void
    {
        Log::error('SendResidentSignupEmailJob permanently failed', [
            'property_id' => $this->propertyId,
            'error' => $exception->getMessage(),
        ]);
    }
}