<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\EmployeeType;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $hrDept     = Department::where('name', 'Human Resources')->first();
        $hrType     = EmployeeType::where('name', 'Full-time')->first();
        $adminRole  = UserRole::where('name', 'HR')->first();

        $employee = Employee::firstOrCreate(
            ['email' => 'admin@university.lk'],
            [
                'first_name'      => 'System',
                'last_name'       => 'Administrator',
                'phone'           => '0112345678',
                'nic'             => 'ADMIN000001',
                'hire_date'       => now(),
                'department_id'   => $hrDept?->id ?? 1,
                'job_id'          => 1,
                'employee_type_id'=> $hrType?->id ?? 1,
                'role_id'         => $adminRole?->id ?? 1,
                'status'          => 'active',
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@university.lk'],
            [
                'name'        => 'System Administrator',
                'password'    => Hash::make('Admin@1234'),
                'role'        => 'super_admin',
                'employee_id' => $employee->id,
            ]
        );
    }
}
