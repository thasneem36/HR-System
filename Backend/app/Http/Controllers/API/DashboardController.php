<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Job;
use App\Models\Leave;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiResponse;

    public function getStats()
    {
        $onLeaveEmployeeIds = Leave::approved()
            ->where('start_date', '<=', today())
            ->where('end_date', '>=', today())
            ->pluck('employee_id');

        return $this->success([
            'total_employees'   => Employee::count(),
            'active_employees'  => Employee::active()->count(),
            'present_today'     => Attendance::today()->where('status', 'present')->count(),
            'on_leave_today'    => $onLeaveEmployeeIds->count(),
            'total_departments' => Department::count(),
            'total_jobs'        => Job::count(),
        ]);
    }

    public function getAttendanceSummary()
    {
        $data = Attendance::select(
                DB::raw('DATE(date) as date'),
                DB::raw('COUNT(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present"),
                DB::raw("SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent"),
                DB::raw("SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late")
            )
            ->where('date', '>=', Carbon::now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $this->success($data);
    }

    public function getLeaveSummary()
    {
        $month = Carbon::now()->startOfMonth();

        $byStatus = Leave::with('leaveStatus')
            ->where('start_date', '>=', $month)
            ->get()
            ->groupBy('leaveStatus.name')
            ->map(fn($group) => $group->count());

        $byType = Leave::with('leaveType')
            ->where('start_date', '>=', $month)
            ->get()
            ->groupBy('leaveType.name')
            ->map(fn($group) => $group->count());

        return $this->success([
            'by_status' => $byStatus,
            'by_type'   => $byType,
        ]);
    }

    public function getEmployeeSummary()
    {
        $recentHires = Employee::with(['job', 'department'])
            ->orderByDesc('hire_date')
            ->take(5)
            ->get();

        return $this->success([
            'by_department' => Department::withCount('employees')->get(),
            'by_type'       => DB::table('employees')
                ->join('employee_types', 'employees.employee_type_id', '=', 'employee_types.id')
                ->select('employee_types.name', DB::raw('COUNT(*) as count'))
                ->groupBy('employee_types.name')
                ->get(),
            'recent_hires'  => $recentHires,
        ]);
    }
}
