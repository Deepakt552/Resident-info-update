<?php

namespace App\Services;

use App\Mail\ResidentSignupMail;
use App\Models\MailLog;
use App\Models\Setting;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class EmailService
{
    /**
     * Send resident signup email with PDF attachment
     *
     * @param array $data
     * @param string $pdfPath
     * @param int $propertyId
     * @return array
     */
    public function sendResidentSignupEmail(array $data, string $pdfPath, int $propertyId): array
    {
        try {
            Log::info('Starting resident signup email sending', [
                'signup_uid' => $data['signup_uid'] ?? null,
                'property_id' => $propertyId
            ]);

            // Primary recipient
            $primaryEmail = 'itdev1@navkarservices.com';

            // Get CC recipients from settings
            $ccEmails = $this->getCcRecipients();

            // Get PDF file name for logging
            $pdfFileName = basename($pdfPath);

            // Prepare email data
            $emailData = [
                'property_name' => $data['property_name'] ?? 'N/A',
                'unit_number' => $data['unit_number'] ?? 'N/A',
                'signup_uid' => $data['signup_uid'] ?? 'N/A',
                'tenant_names' => $data['tenant_names'] ?? 'N/A',
            ];

            // Build email
            $mail = new ResidentSignupMail($emailData, $pdfPath);

            // Set recipients
            $mail->to($primaryEmail);

            // Add CC recipients if any
            if (!empty($ccEmails)) {
                $mail->cc($ccEmails);
            }


            $settings = Setting::where('send_mail', 1)
                ->first();

            if (!$settings || empty($settings->send_user_emails)) {
                Log::info('Email senting if off');

                // Log success
                $this->logEmail(
                    $pdfFileName,
                    'mail sentting off',
                    $propertyId,
                    0,
                    "Not send. Setting is disable"
                );
                return [
                    'status' => true,
                    'message' => 'Email senting if off'
                ];
            }

            // Send email
            Mail::send($mail);

            Log::info('Resident signup email sent successfully', [
                'signup_uid' => $data['signup_uid'] ?? null,
                'primary_email' => $primaryEmail,
                'cc_emails' => $ccEmails
            ]);

            // Log success
            $this->logEmail(
                $pdfFileName,
                'mail sent',
                $propertyId,
                1,
                null
            );

            return [
                'status' => true,
                'message' => 'Email sent successfully'
            ];

        } catch (Exception $e) {
            Log::error('Failed to send resident signup email', [
                'signup_uid' => $data['signup_uid'] ?? null,
                'property_id' => $propertyId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Log failure
            $pdfFileName = basename($pdfPath);
            $this->logEmail(
                $pdfFileName,
                'mail sent failed',
                $propertyId,
                0,
                $e->getMessage()
            );

            return [
                'status' => false,
                'message' => 'Failed to send email: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get CC recipients from settings
     *
     * @return array
     */
    private function getCcRecipients(): array
    {
        try {

            $settings = Setting::where('send_mail', 1)
                ->first();

            if (!$settings || empty($settings->send_user_emails)) {

                Log::info('No CC recipients found in settings');

                return [];
            }

            // Already array because of cast
            $emails = $settings->send_user_emails;

            $validEmails = array_filter($emails, function ($email) {

                return filter_var(
                    trim($email),
                    FILTER_VALIDATE_EMAIL
                );

            });

            Log::info('CC recipients retrieved from settings', [
                'count' => count($validEmails),
                'emails' => $validEmails
            ]);

            return array_values($validEmails);

        } catch (\Exception $e) {

            Log::error('Error fetching CC recipients', [
                'error' => $e->getMessage()
            ]);

            return [];
        }
    }

    /**
     * Log email in mail_logs table
     *
     * @param string $document
     * @param string $action
     * @param int $propertyId
     * @param int $status
     * @param string|null $errorMessage
     * @return void
     */
    private function logEmail(string $document, string $action, int $propertyId, int $status, ?string $errorMessage = null): void
    {
        try {
            MailLog::create([
                'document' => $document,
                'action' => $action,
                'user_id' => null,
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

        } catch (Exception $e) {
            Log::error('Failed to log email in mail_logs', [
                'error' => $e->getMessage(),
                'document' => $document,
                'action' => $action
            ]);
        }
    }
}