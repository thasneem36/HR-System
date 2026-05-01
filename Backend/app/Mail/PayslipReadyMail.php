<?php

namespace App\Mail;

use App\Models\Payroll;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PayslipReadyMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $employeeName;
    public string $monthName;
    public int    $year;
    public float  $basicSalary;
    public float  $grossSalary;
    public float  $totalDeductions;
    public float  $netSalary;
    public string $portalUrl;

    public function __construct(Payroll $payroll)
    {
        $this->employeeName    = $payroll->employee->full_name;
        $this->monthName       = $payroll->month_name;
        $this->year            = $payroll->year;
        $this->basicSalary     = (float) $payroll->basic_salary;
        $this->grossSalary     = (float) $payroll->gross_salary;
        $this->totalDeductions = (float) ($payroll->gross_salary - $payroll->net_salary);
        $this->netSalary       = (float) $payroll->net_salary;
        $this->portalUrl       = rtrim(config('app.frontend_url', 'http://localhost:5173'), '/');
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your Payslip for {$this->monthName} {$this->year} is Ready",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payslip-ready',
        );
    }
}
