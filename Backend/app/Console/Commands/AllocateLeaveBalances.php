<?php

namespace App\Console\Commands;

use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveType;
use Illuminate\Console\Command;

class AllocateLeaveBalances extends Command
{
    protected $signature   = 'leaves:allocate {--year= : Year to allocate (default: current year)} {--overwrite : Reset existing allocations to defaults}';
    protected $description = 'Allocate annual leave balances for all active employees';

    public function handle(): int
    {
        $year      = (int) ($this->option('year') ?: date('Y'));
        $overwrite = (bool) $this->option('overwrite');

        $this->info("Allocating leave balances for {$year}...");

        $employees  = Employee::where('status', 'active')->get();
        $leaveTypes = LeaveType::all();

        $created = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($employees as $emp) {
            foreach ($leaveTypes as $lt) {
                $existing = LeaveBalance::where([
                    'employee_id'   => $emp->id,
                    'leave_type_id' => $lt->id,
                    'year'          => $year,
                ])->first();

                if ($existing) {
                    if ($overwrite) {
                        $existing->update(['allocated_days' => $lt->default_days]);
                        $updated++;
                    } else {
                        $skipped++;
                    }
                } else {
                    LeaveBalance::create([
                        'employee_id'    => $emp->id,
                        'leave_type_id'  => $lt->id,
                        'allocated_days' => $lt->default_days,
                        'used_days'      => 0,
                        'year'           => $year,
                    ]);
                    $created++;
                }
            }
        }

        $this->table(
            ['Metric', 'Count'],
            [
                ['Employees processed', $employees->count()],
                ['Leave types',         $leaveTypes->count()],
                ['Records created',     $created],
                ['Records updated',     $updated],
                ['Records skipped',     $skipped],
            ]
        );

        $this->info('Done! Run with --overwrite to reset existing allocations to defaults.');

        return Command::SUCCESS;
    }
}
