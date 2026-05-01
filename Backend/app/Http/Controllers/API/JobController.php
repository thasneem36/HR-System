<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Job::with('department')->withCount('employees');

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        return $this->success($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'department_id' => 'required|exists:departments,id',
            'min_salary'    => 'nullable|numeric|min:0',
            'max_salary'    => 'nullable|numeric|min:0|gte:min_salary',
        ]);

        $job = Job::create($validated);
        return $this->created($job->load('department'), 'Job created successfully');
    }

    public function show(Job $job)
    {
        return $this->success($job->load('department')->loadCount('employees'));
    }

    public function update(Request $request, Job $job)
    {
        $validated = $request->validate([
            'title'         => 'sometimes|string|max:255',
            'description'   => 'nullable|string',
            'department_id' => 'sometimes|exists:departments,id',
            'min_salary'    => 'nullable|numeric|min:0',
            'max_salary'    => 'nullable|numeric|min:0',
        ]);

        $job->update($validated);
        return $this->success($job->load('department'), 'Job updated successfully');
    }

    public function destroy(Job $job)
    {
        if ($job->employees()->exists()) {
            return $this->error('Cannot delete job with active employees', 422);
        }

        $job->delete();
        return $this->success(null, 'Job deleted successfully');
    }

    public function employees(Job $job)
    {
        return $this->success($job->employees()->with('department')->get());
    }
}
