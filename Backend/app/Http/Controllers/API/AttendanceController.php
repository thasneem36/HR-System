<?php

namespace App\Http\Controllers\API;

use App\Events\HrFeedEvent;
use App\Events\UserFeedEvent;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Attendance::with('employee.department');

        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('month') && $request->has('year')) {
            $query->forMonth($request->month, $request->year);
        }

        return $this->success($query->orderByDesc('date')->paginate($request->get('per_page', 30)));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date'        => 'required|date',
            'check_in'    => 'nullable|date_format:H:i',
            'check_out'   => 'nullable|date_format:H:i|after:check_in',
            'status'      => 'required|in:present,absent,late,half_day',
            'notes'       => 'nullable|string',
        ]);

        $attendance = Attendance::updateOrCreate(
            ['employee_id' => $validated['employee_id'], 'date' => $validated['date']],
            $validated
        );

        try {
            broadcast(new HrFeedEvent('attendance.updated', [
                'employee_id' => $attendance->employee_id,
                'date'        => $attendance->date,
                'status'      => $attendance->status,
            ]));
        } catch (\Throwable) {}

        return $this->created($attendance->load('employee'), 'Attendance recorded');
    }

    public function show(Attendance $attendance)
    {
        return $this->success($attendance->load('employee.department'));
    }

    public function update(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'check_in'  => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i|after:check_in',
            'status'    => 'nullable|in:present,absent,late,half_day',
            'notes'     => 'nullable|string',
        ]);

        $attendance->update($validated);

        try {
            broadcast(new HrFeedEvent('attendance.updated', [
                'employee_id' => $attendance->employee_id,
                'date'        => $attendance->date,
                'status'      => $attendance->status,
            ]));
        } catch (\Throwable) {}

        return $this->success($attendance, 'Attendance updated');
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return $this->success(null, 'Attendance deleted');
    }

    public function checkIn(Request $request)
    {
        $request->validate(['employee_id' => 'required|exists:employees,id']);

        $attendance = Attendance::updateOrCreate(
            ['employee_id' => $request->employee_id, 'date' => today()],
            ['check_in' => now()->format('H:i'), 'status' => 'present']
        );

        try {
            broadcast(new HrFeedEvent('attendance.updated', [
                'employee_id' => $attendance->employee_id,
                'date'        => $attendance->date,
                'status'      => 'present',
                'event'       => 'check_in',
            ]));
            $empUser = User::where('employee_id', $request->employee_id)->first();
            if ($empUser) {
                broadcast(new UserFeedEvent($empUser->id, 'attendance.updated', [
                    'date'   => $attendance->date,
                    'status' => 'present',
                ]));
            }
        } catch (\Throwable) {}

        return $this->success($attendance, 'Checked in successfully');
    }

    public function checkOut(Request $request)
    {
        $request->validate(['employee_id' => 'required|exists:employees,id']);

        $attendance = Attendance::where('employee_id', $request->employee_id)
            ->whereDate('date', today())
            ->first();

        if (!$attendance) {
            return $this->error('No check-in record found for today', 404);
        }

        $attendance->update(['check_out' => now()->format('H:i')]);

        try {
            broadcast(new HrFeedEvent('attendance.updated', [
                'employee_id' => $attendance->employee_id,
                'date'        => $attendance->date,
                'event'       => 'check_out',
            ]));
            $empUser = User::where('employee_id', $request->employee_id)->first();
            if ($empUser) {
                broadcast(new UserFeedEvent($empUser->id, 'attendance.updated', [
                    'date'  => $attendance->date,
                    'event' => 'check_out',
                ]));
            }
        } catch (\Throwable) {}

        return $this->success($attendance, 'Checked out successfully');
    }

    public function monthlyReport(Request $request)
    {
        $request->validate([
            'month'       => 'required|integer|between:1,12',
            'year'        => 'required|integer|min:2020',
            'employee_id' => 'nullable|exists:employees,id',
        ]);

        $query = Attendance::with('employee')
            ->forMonth($request->month, $request->year);

        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        $records = $query->get();

        $summary = [
            'total'     => $records->count(),
            'present'   => $records->where('status', 'present')->count(),
            'absent'    => $records->where('status', 'absent')->count(),
            'late'      => $records->where('status', 'late')->count(),
            'half_day'  => $records->where('status', 'half_day')->count(),
            'records'   => $records,
        ];

        return $this->success($summary);
    }
}
