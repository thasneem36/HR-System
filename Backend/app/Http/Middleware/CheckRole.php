<?php

namespace App\Http\Middleware;

use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    use ApiResponse;

    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles)) {
            return $this->forbidden('You do not have permission to perform this action.');
        }

        return $next($request);
    }
}
