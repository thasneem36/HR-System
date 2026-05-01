<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserRoleSeeder::class,
            DepartmentSeeder::class,
            JobSeeder::class,
            EmployeeTypeSeeder::class,
            LeaveTypeSeeder::class,
            LeaveStatusSeeder::class,
            HolidaySeeder::class,
            EmployeeSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}
