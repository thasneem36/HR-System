<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Employee::with(['department', 'job', 'employeeType']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nic', 'like', "%{$search}%");
            });
        }

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $employees = $query->paginate($request->get('per_page', 15));

        return $this->success($employees);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'               => 'required|string|max:255',
            'last_name'                => 'required|string|max:255',
            'email'                    => 'required|email|unique:employees',
            'phone'                    => 'required|string|max:20',
            'nic'                      => 'required|string|max:20|unique:employees',
            'date_of_birth'            => 'nullable|date',
            'hire_date'                => 'required|date',
            'department_id'            => 'required|exists:departments,id',
            'job_id'                   => 'required|exists:jobs,id',
            'employee_type_id'         => 'required|exists:employee_types,id',
            'role_id'                  => 'required|exists:user_roles,id',
            'salary'                   => 'nullable|numeric|min:0',
            'status'                   => 'nullable|in:active,inactive,on_leave,terminated',
            'address'                  => 'nullable|string',
            'emergency_contact_name'   => 'nullable|string|max:255',
            'emergency_contact_phone'  => 'nullable|string|max:20',
        ]);

        $employee = Employee::create($validated);

        return $this->created(
            $employee->load(['department', 'job', 'employeeType']),
            'Employee created successfully'
        );
    }

    public function show(Employee $employee)
    {
        return $this->success(
            $employee->load(['department', 'job', 'employeeType', 'contacts', 'leaveBalances.leaveType'])
        );
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name'               => 'sometimes|string|max:255',
            'last_name'                => 'sometimes|string|max:255',
            'email'                    => 'sometimes|email|unique:employees,email,' . $employee->id,
            'phone'                    => 'sometimes|string|max:20',
            'nic'                      => 'sometimes|string|max:20|unique:employees,nic,' . $employee->id,
            'date_of_birth'            => 'nullable|date',
            'hire_date'                => 'sometimes|date',
            'department_id'            => 'sometimes|exists:departments,id',
            'job_id'                   => 'sometimes|exists:jobs,id',
            'employee_type_id'         => 'sometimes|exists:employee_types,id',
            'role_id'                  => 'sometimes|exists:user_roles,id',
            'salary'                   => 'nullable|numeric|min:0',
            'status'                   => 'nullable|in:active,inactive,on_leave,terminated',
            'address'                  => 'nullable|string',
            'emergency_contact_name'   => 'nullable|string|max:255',
            'emergency_contact_phone'  => 'nullable|string|max:20',
        ]);

        $employee->update($validated);

        return $this->success(
            $employee->load(['department', 'job', 'employeeType']),
            'Employee updated successfully'
        );
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return $this->success(null, 'Employee deleted successfully');
    }

    public function history(Employee $employee)
    {
        return $this->success(
            $employee->histories()->with(['department', 'job'])->orderByDesc('start_date')->get()
        );
    }

    public function contacts(Employee $employee)
    {
        return $this->success($employee->contacts);
    }

    public function leaveBalance(Employee $employee)
    {
        return $this->success(
            $employee->leaveBalances()->with('leaveType')->where('year', now()->year)->get()
        );
    }
}
