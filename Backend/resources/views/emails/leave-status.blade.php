@extends('emails.layout')

@section('content')
<p>Dear <strong>{{ $employeeName }}</strong>,</p>

@if($status === 'approved')
<p>Great news! Your leave request has been reviewed and <span class="badge-success">✅ Approved</span>.</p>
@else
<p>We regret to inform you that your leave request has been <span class="badge-error">❌ Rejected</span>.</p>
@endif

<h2>Leave Request Details</h2>

<div class="infobox">
  <table>
    <tr>
      <td>Leave Type</td>
      <td>{{ $leaveType }}</td>
    </tr>
    <tr>
      <td>From</td>
      <td>{{ $startDate }}</td>
    </tr>
    <tr>
      <td>To</td>
      <td>{{ $endDate }}</td>
    </tr>
    <tr>
      <td>Total Days</td>
      <td>{{ $totalDays }} day{{ $totalDays != 1 ? 's' : '' }}</td>
    </tr>
    @if($status === 'approved')
    <tr>
      <td>Approved By</td>
      <td>{{ $actionBy }}</td>
    </tr>
    @else
    <tr>
      <td>Rejected By</td>
      <td>{{ $actionBy }}</td>
    </tr>
    <tr>
      <td>Reason</td>
      <td style="color:#c62828;">{{ $rejectionReason }}</td>
    </tr>
    @endif
  </table>
</div>

@if($status === 'approved')
<p>Please ensure you complete any pending handovers before your leave begins. Have a restful time off!</p>
@else
<p>If you believe this decision is incorrect or wish to discuss further, please reach out to the HR department directly.</p>
@endif

<div class="btn-wrap">
  <a href="{{ $portalUrl }}/leaves" class="btn">View My Leaves</a>
</div>
@endsection
