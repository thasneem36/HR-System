@extends('emails.layout')

@section('content')
<p>Dear <strong>{{ $employeeName }}</strong>,</p>

<p>Welcome to <strong>{{ config('app.name') }}</strong>! Your employee account has been created.
You can now access the HR Portal to view your payslips, apply for leave, check attendance, and more.</p>

<h2>Your Login Credentials</h2>

<div class="infobox">
  <table>
    <tr>
      <td>Portal URL</td>
      <td><a href="{{ $loginUrl }}" style="color:#941936;">{{ $loginUrl }}</a></td>
    </tr>
    <tr>
      <td>Login Email</td>
      <td>{{ $loginEmail }}</td>
    </tr>
    <tr>
      <td>Temporary Password</td>
      <td><code style="background:#f4f4f4;padding:2px 6px;border-radius:3px;">Welcome@1234</code></td>
    </tr>
  </table>
</div>

<p style="background:#fff3e0;border-left:4px solid #ffb74d;border-radius:4px;padding:12px 16px;font-size:13px;color:#e65100;">
  <strong>⚠️ Security Notice:</strong> Please change your password immediately after your first login
  by going to <em>Profile → Change Password</em>.
</p>

<div class="btn-wrap">
  <a href="{{ $loginUrl }}" class="btn">Log In to HR Portal</a>
</div>

<p style="font-size:13px;color:#999;margin-top:24px;">
  If you have any issues logging in, contact HR or your system administrator.
</p>
@endsection
