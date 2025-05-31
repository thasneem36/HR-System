<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Leave;
use App\Models\Department;
use App\Models\Job;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        $totalEmployees = Employee::count();
        $presentToday = Attendance::whereDate('Attend_Date', Carbon::today())->count();
        $onLeave = Leave::where('start_date', '<=', Carbon::today())
            ->where('end_date', '>=', Carbon::today())
            ->where('Leave_Status', 2) // Assuming 2 is for approved leaves
            ->count();
        $departments = Department::count();
        $jobs = Job::count();

        return response()->json([
            'total_employees' => $totalEmployees,
            'present_today' => $presentToday,
            'on_leave' => $onLeave,
            'total_departments' => $departments,
            'total_jobs' => $jobs
        ]);
    }

    public function getAttendanceSummary()
    {
        $lastWeek = Carbon::now()->subDays(7);
        
        $attendanceData = Attendance::select(
            DB::raw('DATE(Attend_Date) as date'),
            DB::raw('COUNT(*) as total'),
            DB::raw('SUM(CASE WHEN check_in IS NOT NULL THEN 1 ELSE 0 END) as present')
        )
        ->where('Attend_Date', '>=', $lastWeek)
        ->groupBy('date')
        ->orderBy('date')
        ->get();

        return response()->json($attendanceData);
    }

    public function getLeaveSummary()
    {
        $currentMonth = Carbon::now()->startOfMonth();
        
        $leaveData = Leave::select(
            'Leave_Status',
            DB::raw('COUNT(*) as count')
        )
        ->where('start_date', '>=', $currentMonth)
        ->groupBy('Leave_Status')
        ->get();

        $leaveTypes = DB::table('leaves')
            ->join('employee_leave_plans', 'leaves.ELP_ID', '=', 'employee_leave_plans.ELP_ID')
            ->join('leave_types', 'employee_leave_plans.LeaveType_ID', '=', 'leave_types.LeaveType_ID')
            ->select('leave_types.LeaveName', DB::raw('COUNT(*) as count'))
            ->where('leaves.start_date', '>=', $currentMonth)
            ->groupBy('leave_types.LeaveName')
            ->get();

        return response()->json([
            'by_status' => $leaveData,
            'by_type' => $leaveTypes
        ]);
    }

    public function getEmployeeSummary()
    {
        $departmentStats = Department::withCount('employees')->get();
        
        $employeeTypes = DB::table('employees')
            ->join('employee_types', 'employees.EmployeeType_ID', '=', 'employee_types.EmployeeType_ID')
            ->select('employee_types.TypeName', DB::raw('COUNT(*) as count'))
            ->groupBy('employee_types.TypeName')
            ->get();

        $recentHires = Employee::with(['job', 'department'])
            ->orderBy('StartDate', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'department_stats' => $departmentStats,
            'employee_types' => $employeeTypes,
            'recent_hires' => $recentHires
        ]);
    }
} 