@extends('emails.layout')

@section('content')
<p>Dear <strong>{{ $employeeName }}</strong>,</p>

<p>Your payslip for <strong>{{ $monthName }} {{ $year }}</strong> has been approved and is now available in the HR Portal.</p>

<h2>Payslip Summary</h2>

<div class="infobox">
  <table>
    <tr>
      <td>Period</td>
      <td>{{ $monthName }} {{ $year }}</td>
    </tr>
    <tr>
      <td>Basic Salary</td>
      <td>LKR {{ number_format($basicSalary, 2) }}</td>
    </tr>
    <tr>
      <td>Gross Salary</td>
      <td>LKR {{ number_format($grossSalary, 2) }}</td>
    </tr>
    <tr>
      <td>Total Deductions</td>
      <td style="color:#c62828;">- LKR {{ number_format($totalDeductions, 2) }}</td>
    </tr>
    <tr>
      <td>Net Salary</td>
      <td style="color:#2e7d32;font-size:16px;">LKR {{ number_format($netSalary, 2) }}</td>
    </tr>
  </table>
</div>

<p>Log in to the HR Portal to view and download your full payslip.</p>

<div class="btn-wrap">
  <a href="{{ $portalUrl }}/payroll" class="btn">View My Payslip</a>
</div>

<p style="font-size:13px;color:#999;margin-top:24px;">
  If you have any queries regarding your payslip, please contact the HR or Finance department.
</p>
@endsection
