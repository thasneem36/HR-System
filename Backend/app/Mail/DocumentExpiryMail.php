<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DocumentExpiryMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $employeeName;
    public array  $documents;
    public string $portalUrl;

    /**
     * @param string $employeeName
     * @param array  $documents  [['title'=>, 'category'=>, 'expiry_date'=>, 'days_left'=>], ...]
     */
    public function __construct(string $employeeName, array $documents)
    {
        $this->employeeName = $employeeName;
        $this->documents    = $documents;
        $this->portalUrl    = rtrim(config('app.frontend_url', 'http://localhost:5173'), '/');
    }

    public function envelope(): Envelope
    {
        $count = count($this->documents);

        return new Envelope(
            subject: "Action Required: {$count} Document" . ($count > 1 ? 's' : '') . ' Expiring Soon',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.document-expiry',
        );
    }
}
