<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->success(Holiday::orderBy('date')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'date'         => 'required|date',
            'description'  => 'nullable|string',
            'is_recurring' => 'boolean',
        ]);

        $holiday = Holiday::create($validated);
        return $this->created($holiday, 'Holiday added successfully');
    }

    public function show(Holiday $holiday)
    {
        return $this->success($holiday);
    }

    public function update(Request $request, Holiday $holiday)
    {
        $validated = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'date'         => 'sometimes|date',
            'description'  => 'nullable|string',
            'is_recurring' => 'boolean',
        ]);

        $holiday->update($validated);
        return $this->success($holiday, 'Holiday updated successfully');
    }

    public function destroy(Holiday $holiday)
    {
        $holiday->delete();
        return $this->success(null, 'Holiday deleted successfully');
    }

    public function upcoming()
    {
        return $this->success(Holiday::upcoming()->limit(10)->get());
    }
}
