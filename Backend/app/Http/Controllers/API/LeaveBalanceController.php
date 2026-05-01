<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class LeaveBalanceController extends Controller
{
    use ApiResponse;

    /**
     * List balances — filterable by year and employee_id.
     * Returns each balance with employee + leave_type loaded.
     */
    public function index(Request $request)
    {
        $year       = $request->get('year', now()->year);
        $employeeId = $request->get('employee_id');

        $query = LeaveBalance::with(['employee', 'leaveType'])
            ->where('year', $year);

        if ($employeeId) {
            $query->where('employee_id', $employeeId);
        }

        $balances = $query->orderBy('employee_id')->orderBy('leave_type_id')->get();

        return $this->success($balances);
    }

    /**
     * Allocate leave balances for all active employees for a given year.
     *
     * - Uses each LeaveType's default_days as the allocation.
     * - Skips employees that already have a balance for that type/year,
     *   unless overwrite=true is passed (resets allocated_days to default).
     * - Returns counts of created / skipped / updated records.
     */
    public function allocate(Request $request)
    {
        $request->validate([
            'year'      => 'required|integer|min:2020|max:2100',
            'overwrite' => 'boolean',
        ]);

        $year      = (int) $request->year;
        $overwrite = (bool) $request->get('overwrite', false);

        $employees  = Employee::where('status', 'active')->pluck('id');
        $leaveTypes = LeaveType::all(['id', 'default_days']);

        if ($employees->isEmpty() || $leaveTypes->isEmpty()) {
            return $this->success(['created' => 0, 'updated' => 0, 'skipped' => 0], 'No active employees or leave types found');
        }

        // BUG-13: replace N×M individual queries with a single batch upsert/insertOrIgnore
        $now  = now()->toDateTimeString();
        $rows = [];
        foreach ($employees as $empId) {
            foreach ($leaveTypes as $lt) {
                $rows[] = [
                    'employee_id'    => $empId,
                    'leave_type_id'  => $lt->id,
                    'allocated_days' => $lt->default_days,
                    'used_days'      => 0,
                    'year'           => $year,
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ];
            }
        }

        $beforeCount = LeaveBalance::where('year', $year)->count();

        if ($overwrite) {
            // Update allocated_days for existing rows; insert new ones (unique key: employee_id, leave_type_id, year)
            LeaveBalance::upsert($rows, ['employee_id', 'leave_type_id', 'year'], ['allocated_days', 'updated_at']);
        } else {
            // Insert only rows that don't already exist; unique constraint prevents duplicates
            LeaveBalance::insertOrIgnore($rows);
        }

        $afterCount = LeaveBalance::where('year', $year)->count();
        $total   = count($rows);
        $created = $afterCount - $beforeCount;
        $skipped = $overwrite ? 0 : ($total - $created);
        $updated = $overwrite ? ($total - $created) : 0;

        return $this->success(
            compact('created', 'updated', 'skipped'),
            "Allocation complete — {$created} created, {$updated} updated, {$skipped} skipped"
        );
    }

    /**
     * Allocate balances for a single employee (used when creating a new employee).
     * Called internally from EmployeeController@store.
     */
    public static function allocateForEmployee(int $employeeId, int $year): void
    {
        $leaveTypes = LeaveType::all();
        foreach ($leaveTypes as $lt) {
            LeaveBalance::firstOrCreate(
                [
                    'employee_id'   => $employeeId,
                    'leave_type_id' => $lt->id,
                    'year'          => $year,
                ],
                [
                    'allocated_days' => $lt->default_days,
                    'used_days'      => 0,
                ]
            );
        }
    }

    /**
     * Update the allocated_days for one balance record.
     * HR can also manually set used_days if needed.
     */
    public function update(Request $request, LeaveBalance $leaveBalance)
    {
        $validated = $request->validate([
            'allocated_days' => 'required|integer|min:0|max:365',
            'used_days'      => 'sometimes|integer|min:0',
        ]);

        // BUG-02: compare the EFFECTIVE used_days (new if provided, existing otherwise)
        // against the new allocated_days to prevent negative remaining balances.
        $newAllocated = $validated['allocated_days'];
        $newUsed      = $validated['used_days'] ?? $leaveBalance->used_days;

        if ($newUsed > $newAllocated) {
            return $this->error("Used days ({$newUsed}) cannot exceed allocated days ({$newAllocated})", 422);
        }

        $leaveBalance->update($validated);

        return $this->success(
            $leaveBalance->load(['employee', 'leaveType']),
            'Leave balance updated'
        );
    }

    /**
     * Delete one balance record (allows re-allocation).
     */
    public function destroy(LeaveBalance $leaveBalance)
    {
        $leaveBalance->delete();
        return $this->success(null, 'Leave balance removed');
    }

    /**
     * Summary: how many employees have balances vs. don't for a given year.
     * Useful for the "allocate" button status display.
     */
    public function summary(Request $request)
    {
        $year = (int) $request->get('year', now()->year);

        $totalActive = Employee::where('status', 'active')->count();
        $leaveTypes  = LeaveType::count();
        $allocated   = LeaveBalance::where('year', $year)->count();
        $expected    = $totalActive * $leaveTypes;

        return $this->success([
            'year'             => $year,
            'active_employees' => $totalActive,
            'leave_types'      => $leaveTypes,
            'allocated'        => $allocated,
            'expected'         => $expected,
            'fully_allocated'  => $allocated >= $expected,
            'missing'          => max(0, $expected - $allocated),
        ]);
    }
}
