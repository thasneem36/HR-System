<?php

namespace App\Http\Controllers\API;

use App\Events\HrFeedEvent;
use App\Events\UserFeedEvent;
use App\Http\Controllers\Controller;
use App\Models\Leave;
use App\Models\LeaveBalance;
use App\Models\LeaveStatus;
use App\Models\Notification;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Leave::with(['employee', 'leaveType', 'leaveStatus']);

        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->has('status')) {
            $query->whereHas('leaveStatus', fn($q) => $q->where('name', $request->status));
        }

        return $this->success($query->orderByDesc('created_at')->paginate($request->get('per_page', 15)));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id'   => 'required|exists:employees,id',
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date'    => 'required|date|after_or_equal:today',
            'end_date'      => 'required|date|after_or_equal:start_date',
            'reason'        => 'nullable|string|max:1000',
        ]);

        $pendingStatus = LeaveStatus::where('name', 'Pending')->firstOrFail();
        $validated['leave_status_id'] = $pendingStatus->id;

        // Check leave balance
        $balance = LeaveBalance::where('employee_id', $validated['employee_id'])
            ->where('leave_type_id', $validated['leave_type_id'])
            ->where('year', now()->year)
            ->first();

        if ($balance) {
            $requestedDays = (new \Carbon\Carbon($validated['start_date']))->diffInDays(new \Carbon\Carbon($validated['end_date'])) + 1;
            if ($balance->remaining_days < $requestedDays) {
                return $this->error("Insufficient leave balance. Available: {$balance->remaining_days} days", 422);
            }
        }

        $leave = Leave::create($validated);
        $leave->load(['employee', 'leaveType', 'leaveStatus']);

        try {
            broadcast(new HrFeedEvent('leave.requested', [
                'leave_id'      => $leave->id,
                'employee_name' => $leave->employee->full_name ?? 'Employee',
                'leave_type'    => $leave->leaveType->name ?? '',
                'start_date'    => $leave->start_date,
                'end_date'      => $leave->end_date,
                'total_days'    => $leave->total_days,
            ]));
        } catch (\Throwable) {}

        return $this->created($leave, 'Leave request submitted successfully');
    }

    public function show(Leave $leave)
    {
        return $this->success($leave->load(['employee', 'leaveType', 'leaveStatus', 'approvedBy']));
    }

    public function update(Request $request, Leave $leave)
    {
        if ($leave->leaveStatus->name !== 'Pending') {
            return $this->error('Only pending leaves can be modified', 422);
        }

        $validated = $request->validate([
            'start_date'    => 'sometimes|date',
            'end_date'      => 'sometimes|date|after_or_equal:start_date',
            'leave_type_id' => 'sometimes|exists:leave_types,id',
            'reason'        => 'nullable|string|max:1000',
        ]);

        $leave->update($validated);
        return $this->success($leave->load(['leaveType', 'leaveStatus']), 'Leave updated successfully');
    }

    public function destroy(Leave $leave)
    {
        if ($leave->leaveStatus->name !== 'Pending') {
            return $this->error('Only pending leaves can be cancelled', 422);
        }

        $leave->delete();
        return $this->success(null, 'Leave request cancelled');
    }

    public function approve(Request $request, Leave $leave)
    {
        if ($leave->leaveStatus->name !== 'Pending') {
            return $this->error('Leave is not in pending state', 422);
        }

        $approvedStatus = LeaveStatus::where('name', 'Approved')->firstOrFail();

        $leave->update([
            'leave_status_id' => $approvedStatus->id,
            'approved_by'     => $request->user()->employee_id,
        ]);

        // Deduct from leave balance
        LeaveBalance::where('employee_id', $leave->employee_id)
            ->where('leave_type_id', $leave->leave_type_id)
            ->where('year', $leave->start_date->year)
            ->increment('used_days', $leave->total_days);

        $leave->load(['leaveType', 'leaveStatus', 'employee']);

        try {
            $employeeUser = User::where('employee_id', $leave->employee_id)->first();
            if ($employeeUser) {
                $notif = Notification::create([
                    'user_id' => $employeeUser->id,
                    'title'   => '✅ Leave Approved',
                    'message' => "Your {$leave->leaveType->name} leave from {$leave->start_date->format('d M')} to {$leave->end_date->format('d M Y')} has been approved.",
                    'type'    => 'success',
                ]);
                broadcast(new \App\Events\NotificationSent($notif));
                broadcast(new UserFeedEvent($employeeUser->id, 'leave.status.updated', [
                    'leave_id' => $leave->id,
                    'status'   => 'Approved',
                ]));
            }
            broadcast(new HrFeedEvent('leave.updated', ['leave_id' => $leave->id, 'status' => 'Approved']));
        } catch (\Throwable) {}

        return $this->success($leave, 'Leave approved');
    }

    public function reject(Request $request, Leave $leave)
    {
        if ($leave->leaveStatus->name !== 'Pending') {
            return $this->error('Leave is not in pending state', 422);
        }

        $request->validate(['rejection_reason' => 'required|string']);

        $rejectedStatus = LeaveStatus::where('name', 'Rejected')->firstOrFail();

        $leave->update([
            'leave_status_id'  => $rejectedStatus->id,
            'rejection_reason' => $request->rejection_reason,
            'approved_by'      => $request->user()->employee_id,
        ]);

        $leave->load(['leaveType', 'leaveStatus', 'employee']);

        try {
            $employeeUser = User::where('employee_id', $leave->employee_id)->first();
            if ($employeeUser) {
                $notif = Notification::create([
                    'user_id' => $employeeUser->id,
                    'title'   => '❌ Leave Rejected',
                    'message' => "Your {$leave->leaveType->name} leave request has been rejected.",
                    'type'    => 'error',
                ]);
                broadcast(new \App\Events\NotificationSent($notif));
                broadcast(new UserFeedEvent($employeeUser->id, 'leave.status.updated', [
                    'leave_id' => $leave->id,
                    'status'   => 'Rejected',
                ]));
            }
            broadcast(new HrFeedEvent('leave.updated', ['leave_id' => $leave->id, 'status' => 'Rejected']));
        } catch (\Throwable) {}

        return $this->success($leave, 'Leave rejected');
    }

    public function pending()
    {
        $leaves = Leave::pending()->with(['employee', 'leaveType', 'leaveStatus'])->orderBy('start_date')->get();
        return $this->success($leaves);
    }

    public function approved()
    {
        $leaves = Leave::approved()->with(['employee', 'leaveType'])->orderByDesc('start_date')->get();
        return $this->success($leaves);
    }

    public function rejected()
    {
        $leaves = Leave::rejected()->with(['employee', 'leaveType'])->orderByDesc('start_date')->get();
        return $this->success($leaves);
    }

    public function report(Request $request)
    {
        $request->validate([
            'start_date'    => 'nullable|date',
            'end_date'      => 'nullable|date|after_or_equal:start_date',
            'employee_id'   => 'nullable|exists:employees,id',
            'leave_type_id' => 'nullable|exists:leave_types,id',
            'status'        => 'nullable|string',
        ]);

        $query = Leave::with(['employee', 'leaveType', 'leaveStatus']);

        if ($request->start_date)    $query->where('start_date', '>=', $request->start_date);
        if ($request->end_date)      $query->where('end_date',   '<=', $request->end_date);
        if ($request->employee_id)   $query->where('employee_id', $request->employee_id);
        if ($request->leave_type_id) $query->where('leave_type_id', $request->leave_type_id);
        if ($request->status)        $query->whereHas('leaveStatus', fn($q) => $q->where('name', $request->status));

        $leaves = $query->orderByDesc('start_date')->get();

        $summary = [
            'total'      => $leaves->count(),
            'approved'   => $leaves->filter(fn($l) => $l->leaveStatus?->name === 'Approved')->count(),
            'pending'    => $leaves->filter(fn($l) => $l->leaveStatus?->name === 'Pending')->count(),
            'rejected'   => $leaves->filter(fn($l) => $l->leaveStatus?->name === 'Rejected')->count(),
            'total_days' => $leaves->sum('total_days'),
        ];

        return $this->success(['summary' => $summary, 'records' => $leaves]);
    }
}
