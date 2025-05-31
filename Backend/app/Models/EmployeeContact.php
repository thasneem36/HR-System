<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeController extends Controller
{
    public function index() {
        return Employee::with(['job', 'employeeType', 'role'])->get();
    }

    public function store(Request $request) {
        return Employee::create($request->all());
    }

    public function show($id) {
        return Employee::with(['job', 'employeeType', 'role'])->findOrFail($id);
    }

    public function update(Request $request, $id) {
        $employee = Employee::findOrFail($id);
        $employee->update($request->all());
        return $employee;
    }

    public function destroy($id) {
        $employee = Employee::findOrFail($id);
        $employee->delete();
        return response()->json(['message' => 'Deleted']);
    }
}

