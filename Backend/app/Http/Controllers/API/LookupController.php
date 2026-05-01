<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\EmployeeType;
use App\Models\Job;
use App\Models\LeaveType;
use App\Models\UserRole;
use App\Traits\ApiResponse;

class LookupController extends Controller
{
    use ApiResponse;

    public function employeeTypes()
    {
        return $this->success(EmployeeType::orderBy('name')->get());
    }

    public function userRoles()
    {
        return $this->success(UserRole::orderBy('name')->get());
    }

    public function leaveTypes()
    {
        return $this->success(LeaveType::orderBy('name')->get());
    }

    public function departments()
    {
        return $this->success(Department::orderBy('name')->get(['id', 'name']));
    }

    public function jobs()
    {
        return $this->success(Job::with('department')->orderBy('title')->get(['id', 'title', 'department_id']));
    }
}
