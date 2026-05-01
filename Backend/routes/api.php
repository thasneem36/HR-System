<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\AttendanceController;
use App\Http\Controllers\API\LeaveController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\JobController;
use App\Http\Controllers\API\HolidayController;
use App\Http\Controllers\API\LookupController;
use App\Http\Controllers\API\LeaveTypeController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout',          [AuthController::class, 'logout']);
    Route::get('/user',             [AuthController::class, 'user']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Lookup tables — all authenticated users (for form dropdowns)
    Route::prefix('lookup')->group(function () {
        Route::get('/employee-types', [LookupController::class, 'employeeTypes']);
        Route::get('/user-roles',     [LookupController::class, 'userRoles']);
        Route::get('/leave-types',    [LookupController::class, 'leaveTypes']);
        Route::get('/departments',    [LookupController::class, 'departments']);
        Route::get('/jobs',           [LookupController::class, 'jobs']);
    });

    // Dashboard — all authenticated users
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'getStats']);
        Route::get('/attendance-summary', [DashboardController::class, 'getAttendanceSummary']);
        Route::get('/leave-summary', [DashboardController::class, 'getLeaveSummary']);
        Route::get('/employee-summary', [DashboardController::class, 'getEmployeeSummary']);
    });

    // Employees — HR and Admin can manage, employees can view their own
    Route::get('employees/{employee}/history', [EmployeeController::class, 'history']);
    Route::get('employees/{employee}/contacts', [EmployeeController::class, 'contacts']);
    Route::get('employees/{employee}/leave-balance', [EmployeeController::class, 'leaveBalance']);
    Route::get('employees', [EmployeeController::class, 'index']);
    Route::get('employees/{employee}', [EmployeeController::class, 'show']);
    Route::middleware('role:super_admin,hr_manager')->group(function () {
        Route::post('employees', [EmployeeController::class, 'store']);
        Route::put('employees/{employee}', [EmployeeController::class, 'update']);
        Route::delete('employees/{employee}', [EmployeeController::class, 'destroy']);
    });

    // Attendance — HR/Admin manage all; employees can check in/out
    Route::post('attendances/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('attendances/check-out', [AttendanceController::class, 'checkOut']);
    Route::get('attendances/monthly-report', [AttendanceController::class, 'monthlyReport']);
    Route::get('attendances', [AttendanceController::class, 'index']);
    Route::get('attendances/{attendance}', [AttendanceController::class, 'show']);
    Route::middleware('role:super_admin,hr_manager')->group(function () {
        Route::post('attendances', [AttendanceController::class, 'store']);
        Route::put('attendances/{attendance}', [AttendanceController::class, 'update']);
        Route::delete('attendances/{attendance}', [AttendanceController::class, 'destroy']);
    });

    // Leaves — all can request; only HR/Admin can approve or reject
    Route::get('leaves/pending',  [LeaveController::class, 'pending']);
    Route::get('leaves/approved', [LeaveController::class, 'approved']);
    Route::get('leaves/rejected', [LeaveController::class, 'rejected']);
    Route::get('leaves/report',   [LeaveController::class, 'report']);
    Route::middleware('role:super_admin,hr_manager')->group(function () {
        Route::post('leaves/{leave}/approve', [LeaveController::class, 'approve']);
        Route::post('leaves/{leave}/reject', [LeaveController::class, 'reject']);
    });
    Route::apiResource('leaves', LeaveController::class);

    // Departments — HR/Admin manage; all can view
    Route::get('departments/{department}/employees', [DepartmentController::class, 'employees']);
    Route::get('departments', [DepartmentController::class, 'index']);
    Route::get('departments/{department}', [DepartmentController::class, 'show']);
    Route::middleware('role:super_admin,hr_manager')->group(function () {
        Route::post('departments', [DepartmentController::class, 'store']);
        Route::put('departments/{department}', [DepartmentController::class, 'update']);
        Route::delete('departments/{department}', [DepartmentController::class, 'destroy']);
    });

    // Jobs — HR/Admin manage; all can view
    Route::get('jobs/{job}/employees', [JobController::class, 'employees']);
    Route::get('jobs', [JobController::class, 'index']);
    Route::get('jobs/{job}', [JobController::class, 'show']);
    Route::middleware('role:super_admin,hr_manager')->group(function () {
        Route::post('jobs', [JobController::class, 'store']);
        Route::put('jobs/{job}', [JobController::class, 'update']);
        Route::delete('jobs/{job}', [JobController::class, 'destroy']);
    });

    // Leave Types — HR/Admin manage; all can view
    Route::get('leave-types', [LeaveTypeController::class, 'index']);
    Route::get('leave-types/{leaveType}', [LeaveTypeController::class, 'show']);
    Route::middleware('role:super_admin,hr_manager')->group(function () {
        Route::post('leave-types', [LeaveTypeController::class, 'store']);
        Route::put('leave-types/{leaveType}', [LeaveTypeController::class, 'update']);
        Route::delete('leave-types/{leaveType}', [LeaveTypeController::class, 'destroy']);
    });

    // Holidays — HR/Admin manage; all can view
    Route::get('holidays/upcoming', [HolidayController::class, 'upcoming']);
    Route::get('holidays', [HolidayController::class, 'index']);
    Route::get('holidays/{holiday}', [HolidayController::class, 'show']);
    Route::middleware('role:super_admin,hr_manager')->group(function () {
        Route::post('holidays', [HolidayController::class, 'store']);
        Route::put('holidays/{holiday}', [HolidayController::class, 'update']);
        Route::delete('holidays/{holiday}', [HolidayController::class, 'destroy']);
    });
});
