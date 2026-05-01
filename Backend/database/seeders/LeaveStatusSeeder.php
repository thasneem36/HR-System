<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = ['Pending', 'Approved', 'Rejected'];

        foreach ($statuses as $status) {
            DB::table('leave_statuses')->updateOrInsert(
                ['name' => $status],
                ['name' => $status, 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }
}
