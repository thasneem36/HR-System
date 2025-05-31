<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\AttendanceController;
use App\Http\Controllers\API\LeaveController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\API\JobController;
use App\Http\Controllers\API\HolidayController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/



Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard routes
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/dashboard/attendance-summary', [DashboardController::class, 'getAttendanceSummary']);
    Route::get('/dashboard/leave-summary', [DashboardController::class, 'getLeaveSummary']);
    Route::get('/dashboard/employee-summary', [DashboardController::class, 'getEmployeeSummary']);

    // Employee routes
    Route::apiResource('employees', EmployeeController::class);
    Route::get('employees/{employee}/history', [EmployeeController::class, 'history']);
    Route::get('employees/{employee}/contacts', [EmployeeController::class, 'contacts']);
    Route::get('employees/{employee}/leave-balance', [EmployeeController::class, 'leaveBalance']);

    // Attendance routes
    Route::apiResource('attendances', AttendanceController::class);
    Route::post('attendances/check-in', [AttendanceController::class, 'checkIn']);
    Route::post('attendances/check-out', [AttendanceController::class, 'checkOut']);
    Route::get('attendances/monthly-report', [AttendanceController::class, 'monthlyReport']);

    // Leave routes
    Route::apiResource('leaves', LeaveController::class);
    Route::post('leaves/{leave}/approve', [LeaveController::class, 'approve']);
    Route::post('leaves/{leave}/reject', [LeaveController::class, 'reject']);
    Route::get('leaves/pending', [LeaveController::class, 'pending']);
    Route::get('leaves/approved', [LeaveController::class, 'approved']);
    Route::get('leaves/rejected', [LeaveController::class, 'rejected']);

    // Department routes
    Route::apiResource('departments', DepartmentController::class);
    Route::get('departments/{department}/employees', [DepartmentController::class, 'employees']);

    // Job routes
    Route::apiResource('jobs', JobController::class);
    Route::get('jobs/{job}/employees', [JobController::class, 'employees']);

    // Holiday routes
    Route::apiResource('holidays', HolidayController::class);
    Route::get('holidays/upcoming', [HolidayController::class, 'upcoming']);
}); 