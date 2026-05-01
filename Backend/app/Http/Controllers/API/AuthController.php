<?php

namespace App\Http\Controllers\API;

use App\Events\HrFeedEvent;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user  = User::with('employee.department', 'employee.job')->where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'user'  => $user,
            'token' => $token,
        ], 'Login successful');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success(null, 'Successfully logged out');
    }

    public function user(Request $request)
    {
        return $this->success(
            $request->user()->load('employee.department', 'employee.job')
        );
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->validationError(['current_password' => ['Current password is incorrect.']]);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        AuditLog::record(
            $user->id, 'auth.password_changed',
            "{$user->name} changed their password",
            'User', $user->id
        );

        try {
            broadcast(new HrFeedEvent('password.changed', [
                'user_id' => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
            ]));
        } catch (\Throwable) {}

        return $this->success(null, 'Password changed successfully');
    }
}
