<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = AuditLog::with('user')
            ->orderByDesc('created_at');

        if ($request->filled('action'))  $query->where('action', 'like', "%{$request->action}%");
        if ($request->filled('user_id')) $query->where('user_id', $request->user_id);
        if ($request->filled('date'))    $query->whereDate('created_at', $request->date);
        if ($request->filled('search'))  $query->where('description', 'like', "%{$request->search}%");

        return $this->success($query->paginate($request->get('per_page', 30)));
    }
}
