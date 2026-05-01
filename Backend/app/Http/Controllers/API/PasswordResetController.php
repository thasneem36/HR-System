<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Employee;
use App\Traits\ApiResponse;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    use ApiResponse;

    /* ── Step 1: send reset link ─────────────────────────────────────────── */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return $this->success(null, 'Password reset link sent. Check your email.');
        }

        // User not found — return generic message to avoid email enumeration
        return $this->success(null, 'If that email exists in our system, a reset link has been sent.');
    }

    /* ── Step 2: reset password using token ─────────────────────────────── */
    public function reset(Request $request)
    {
        $request->validate([
            'token'                 => 'required|string',
            'email'                 => 'required|email',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password'       => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->success(null, 'Password has been reset successfully.');
        }

        return $this->error(match ($status) {
            Password::INVALID_TOKEN => 'This reset link is invalid or has expired.',
            Password::INVALID_USER  => 'No account found with that email address.',
            default                 => 'Unable to reset password. Please try again.',
        }, 422);
    }

    /* ── HR: reset any employee's password directly ──────────────────────── */
    public function adminReset(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:8',
        ]);

        $user = $employee->user;

        if (!$user) {
            return $this->error('No user account is linked to this employee.', 404);
        }

        $user->update(['password' => Hash::make($validated['password'])]);

        AuditLog::record(
            $request->user()->id, 'auth.admin_password_reset',
            "Admin reset password for: {$employee->full_name} ({$user->email})",
            'Employee', $employee->id
        );

        return $this->success(null, "Password for {$employee->full_name} has been reset.");
    }
}
