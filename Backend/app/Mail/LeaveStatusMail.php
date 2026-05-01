<?php

namespace App\Mail;

use App\Models\Leave;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LeaveStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $employeeName;
    public string $status;
    public string $leaveType;
    public string $startDate;
    public string $endDate;
    public int    $totalDays;
    public string $actionBy;
    public string $rejectionReason;
    public string $portalUrl;

    public function __construct(Leave $leave, string $status, string $actionBy, string $rejectionReason = '')
    {
        $this->employeeName    = $leave->employee->full_name;
        $this->status          = $status; // 'approved' or 'rejected'
        $this->leaveType       = $leave->leaveType->name ?? 'Leave';
        $this->startDate       = $leave->start_date->format('d M Y');
        $this->endDate         = $leave->end_date->format('d M Y');
        $this->totalDays       = $leave->total_days;
        $this->actionBy        = $actionBy;
        $this->rejectionReason = $rejectionReason;
        $this->portalUrl       = rtrim(config('app.frontend_url', 'http://localhost:5173'), '/');
    }

    public function envelope(): Envelope
    {
        $label = $this->status === 'approved' ? 'Approved ✅' : 'Rejected ❌';

        return new Envelope(
            subject: "Your {$this->leaveType} Request has been {$label}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.leave-status',
        );
    }
}
