<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            DepartmentSeeder::class,
            JobSeeder::class,
            EmployeeTypeSeeder::class,
            UserRoleSeeder::class,
            EmployeeSeeder::class,
        ]);
    }
}
