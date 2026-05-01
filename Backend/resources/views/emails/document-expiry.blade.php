@extends('emails.layout')

@section('content')
<p>Dear <strong>{{ $employeeName }}</strong>,</p>

<p>This is a reminder that the following document{{ count($documents) > 1 ? 's are' : ' is' }} expiring soon.
Please take action to renew {{ count($documents) > 1 ? 'them' : 'it' }} before the expiry date.</p>

<h2>Expiring Documents</h2>

<div class="infobox">
  <table>
    <tr style="border-bottom:1px solid #eee;">
      <td style="font-weight:700;color:#444;padding-bottom:8px;">Document</td>
      <td style="font-weight:700;color:#444;padding-bottom:8px;">Category</td>
      <td style="font-weight:700;color:#444;padding-bottom:8px;">Expires On</td>
      <td style="font-weight:700;color:#444;padding-bottom:8px;">Days Left</td>
    </tr>
    @foreach($documents as $doc)
    <tr>
      <td>{{ $doc['title'] }}</td>
      <td>{{ ucfirst(str_replace('_', ' ', $doc['category'])) }}</td>
      <td>{{ $doc['expiry_date'] }}</td>
      <td>
        @if($doc['days_left'] <= 7)
          <span class="badge-error">{{ $doc['days_left'] }} days</span>
        @elseif($doc['days_left'] <= 30)
          <span style="display:inline-block;background:#fff3e0;color:#e65100;border-radius:20px;padding:4px 14px;font-size:13px;font-weight:700;">{{ $doc['days_left'] }} days</span>
        @else
          <span class="badge-info">{{ $doc['days_left'] }} days</span>
        @endif
      </td>
    </tr>
    @endforeach
  </table>
</div>

<p>Please upload the renewed documents through the HR Portal under the <strong>Documents</strong> section,
or contact HR for assistance.</p>

<div class="btn-wrap">
  <a href="{{ $portalUrl }}/documents" class="btn">Manage My Documents</a>
</div>
@endsection
