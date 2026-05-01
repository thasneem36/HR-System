<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class LeaveTypeController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->success(LeaveType::withCount('leaves')->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:100|unique:leave_types,name',
            'description'  => 'nullable|string|max:500',
            'default_days' => 'required|integer|min:1|max:365',
        ]);

        return $this->created(LeaveType::create($validated), 'Leave type created');
    }

    public function show(LeaveType $leaveType)
    {
        return $this->success($leaveType);
    }

    public function update(Request $request, LeaveType $leaveType)
    {
        $validated = $request->validate([
            'name'         => 'sometimes|string|max:100|unique:leave_types,name,' . $leaveType->id,
            'description'  => 'nullable|string|max:500',
            'default_days' => 'sometimes|integer|min:1|max:365',
        ]);

        $leaveType->update($validated);
        return $this->success($leaveType, 'Leave type updated');
    }

    public function destroy(LeaveType $leaveType)
    {
        if ($leaveType->leaves()->exists()) {
            return $this->error('Cannot delete leave type that has existing leave requests', 422);
        }

        $leaveType->delete();
        return $this->success(null, 'Leave type deleted');
    }
}
