<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $departments = Department::withCount('employees')->get();
        return $this->success($departments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:departments',
            'description' => 'nullable|string',
        ]);

        $department = Department::create($validated);
        return $this->created($department, 'Department created successfully');
    }

    public function show(Department $department)
    {
        return $this->success($department->loadCount('employees'));
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255|unique:departments,name,' . $department->id,
            'description' => 'nullable|string',
        ]);

        $department->update($validated);
        return $this->success($department, 'Department updated successfully');
    }

    public function destroy(Department $department)
    {
        if ($department->employees()->exists()) {
            return $this->error('Cannot delete department with active employees', 422);
        }

        $department->delete();
        return $this->success(null, 'Department deleted successfully');
    }

    public function employees(Department $department)
    {
        $employees = $department->employees()->with('job')->get();
        return $this->success($employees);
    }
}
