<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['name' => 'Annual Leave',    'description' => 'Paid annual leave',          'default_days' => 14],
            ['name' => 'Sick Leave',       'description' => 'Medical/sick leave',          'default_days' => 7],
            ['name' => 'Casual Leave',     'description' => 'Short unplanned leave',       'default_days' => 7],
            ['name' => 'Maternity Leave',  'description' => 'Leave for new mothers',       'default_days' => 84],
            ['name' => 'Paternity Leave',  'description' => 'Leave for new fathers',       'default_days' => 3],
            ['name' => 'No Pay Leave',     'description' => 'Unpaid leave',                'default_days' => 0],
        ];

        foreach ($types as $type) {
            DB::table('leave_types')->updateOrInsert(
                ['name' => $type['name']],
                array_merge($type, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
