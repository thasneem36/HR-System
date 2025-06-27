<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('employees')->insert([
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@example.com',
                'phone' => '1234567890',
                'nic' => '123456789V',
                'date_of_birth' => '1990-01-01',
                'hire_date' => '2023-01-01',
                'department_id' => 1,
                'job_id' => 1,
                'employee_type_id' => 1,
                'role_id' => 1,
                'status' => 'active',
                'address' => '123 Main St, City',
                'emergency_contact_name' => 'Jane Doe',
                'emergency_contact_phone' => '0987654321',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane.smith@example.com',
                'phone' => '2345678901',
                'nic' => '234567890V',
                'date_of_birth' => '1992-02-02',
                'hire_date' => '2023-02-01',
                'department_id' => 2,
                'job_id' => 2,
                'employee_type_id' => 1,
                'role_id' => 2,
                'status' => 'active',
                'address' => '456 Oak St, City',
                'emergency_contact_name' => 'John Smith',
                'emergency_contact_phone' => '9876543210',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
} 