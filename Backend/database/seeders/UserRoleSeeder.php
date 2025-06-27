<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserRoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('user_roles')->insert([
            [
                'name' => 'Admin',
                'description' => 'Administrator role with full access',
                'permissions' => json_encode(['all']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Manager',
                'description' => 'Department manager role',
                'permissions' => json_encode(['view', 'edit', 'approve']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Employee',
                'description' => 'Regular employee role',
                'permissions' => json_encode(['view']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
} 