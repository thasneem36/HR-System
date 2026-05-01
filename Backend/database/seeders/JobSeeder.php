<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('jobs')->insert([
            [
                'title' => 'HR Manager',
                'description' => 'Manages HR operations',
                'department_id' => 1,
                'min_salary' => 50000,
                'max_salary' => 80000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Software Developer',
                'description' => 'Develops software applications',
                'department_id' => 2,
                'min_salary' => 60000,
                'max_salary' => 100000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Financial Analyst',
                'description' => 'Analyzes financial data',
                'department_id' => 3,
                'min_salary' => 55000,
                'max_salary' => 90000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
} 