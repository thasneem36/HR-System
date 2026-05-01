<?php

namespace App\Mail;

use App\Models\Employee;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeEmployeeMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $employeeName;
    public string $loginEmail;
    public string $loginUrl;

    public function __construct(Employee $employee, string $loginEmail)
    {
        $this->employeeName = $employee->full_name;
        $this->loginEmail   = $loginEmail;
        $this->loginUrl     = rtrim(config('app.frontend_url', 'http://localhost:5173'), '/');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to ' . config('app.name') . ' HR Portal — Your Login Credentials',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',
        );
    }
}
