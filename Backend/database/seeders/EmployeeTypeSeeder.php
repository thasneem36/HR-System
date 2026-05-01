<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeTypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('employee_types')->insert([
            [
                'name' => 'Full-time',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Part-time',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Contract',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
} 