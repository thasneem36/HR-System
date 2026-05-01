<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ $subject ?? 'HR Portal Notification' }}</title>
  <style>
    body  { margin:0; padding:0; background:#f4f6f8; font-family:'Segoe UI',Arial,sans-serif; color:#333; }
    .wrap { max-width:600px; margin:32px auto; }
    .card { background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.08); }
    .hdr  { background:#941936; padding:28px 32px; }
    .hdr h1 { margin:0; color:#fff; font-size:22px; font-weight:700; letter-spacing:.3px; }
    .hdr p  { margin:4px 0 0; color:rgba(255,255,255,.75); font-size:13px; }
    .body { padding:32px; }
    .body p  { margin:0 0 16px; line-height:1.6; font-size:15px; }
    .body h2 { margin:0 0 16px; font-size:17px; color:#941936; }
    .infobox { background:#f9f9f9; border-left:4px solid #941936; border-radius:4px; padding:16px 20px; margin:20px 0; }
    .infobox table { width:100%; border-collapse:collapse; }
    .infobox td   { padding:6px 0; font-size:14px; vertical-align:top; }
    .infobox td:first-child { color:#666; width:40%; }
    .infobox td:last-child  { font-weight:600; color:#222; }
    .btn-wrap { text-align:center; margin:28px 0 8px; }
    .btn { display:inline-block; background:#941936; color:#fff; text-decoration:none;
           padding:12px 32px; border-radius:6px; font-size:15px; font-weight:600; }
    .footer { padding:20px 32px; background:#f9f9f9; border-top:1px solid #eee; font-size:12px; color:#999; text-align:center; }
    .badge-success { display:inline-block; background:#e8f5e9; color:#2e7d32; border-radius:20px; padding:4px 14px; font-size:13px; font-weight:700; }
    .badge-error   { display:inline-block; background:#fce4ec; color:#c62828; border-radius:20px; padding:4px 14px; font-size:13px; font-weight:700; }
    .badge-info    { display:inline-block; background:#e3f2fd; color:#1565c0; border-radius:20px; padding:4px 14px; font-size:13px; font-weight:700; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="hdr">
      <h1>{{ config('app.name') }} — HR Portal</h1>
      <p>Automated notification — please do not reply to this email</p>
    </div>
    <div class="body">
      @yield('content')
    </div>
    <div class="footer">
      &copy; {{ date('Y') }} {{ config('app.name') }}. This is an automated message.<br>
      If you did not expect this email, please contact HR immediately.
    </div>
  </div>
</div>
</body>
</html>
