<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            ['name' => 'Staff',    'description' => 'Regular staff member'],
            ['name' => 'Manager',  'description' => 'Department manager'],
            ['name' => 'HR',       'description' => 'HR personnel'],
            ['name' => 'Director', 'description' => 'Department director'],
        ];

        foreach ($roles as $role) {
            DB::table('user_roles')->updateOrInsert(
                ['name' => $role['name']],
                array_merge($role, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
} 