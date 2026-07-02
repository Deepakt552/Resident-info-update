<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResidentSignupMail extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $pdfPath;

    /**
     * Create a new message instance.
     */
    public function __construct($data, $pdfPath)
    {
        $this->data = $data;
        $this->pdfPath = $pdfPath;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $email = $this->view('emails.resident-signup')
            ->subject('Resident Signup Form Submitted')
            ->with([
                'propertyName' => $this->data['property_name'],
                'unitNumber' => $this->data['unit_number'],
                'signupUid' => $this->data['signup_uid'],
                'tenantNames' => $this->data['tenant_names'],
            ]);

        // Attach PDF if exists
        if ($this->pdfPath && file_exists($this->pdfPath)) {
            $email->attach($this->pdfPath, [
                'as' => 'resident-signup-' . $this->data['signup_uid'] . '.pdf',
                'mime' => 'application/pdf',
            ]);
        }

        return $email;
    }
}