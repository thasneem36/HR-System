<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::with(['department', 'job'])->get();
        return response()->json($employees);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees',
            'phone' => 'required|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'job_id' => 'required|exists:jobs,id',
            'hire_date' => 'required|date',
            'salary' => 'required|numeric',
        ]);

        $employee = Employee::create($validated);
        return response()->json($employee, 201);
    }

    public function show(Employee $employee)
    {
        return response()->json($employee->load(['department', 'job']));
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'email' => 'email|unique:employees,email,' . $employee->id,
            'phone' => 'string|max:20',
            'department_id' => 'exists:departments,id',
            'job_id' => 'exists:jobs,id',
            'hire_date' => 'date',
            'salary' => 'numeric',
        ]);

        $employee->update($validated);
        return response()->json($employee);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return response()->json(null, 204);
    }

    public function history(Employee $employee)
    {
        return response()->json($employee->history);
    }

    public function contacts(Employee $employee)
    {
        return response()->json($employee->contacts);
    }

    public function leaveBalance(Employee $employee)
    {
        return response()->json($employee->leaveBalance);
    }
} 