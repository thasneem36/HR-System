<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'     => 'System Admin',
            'email'    => 'admin@university.lk',
            'password' => Hash::make('Admin@1234'),
            'role'     => 'super_admin',
        ]);

        User::create([
            'name'     => 'HR Manager',
            'email'    => 'hr@university.lk',
            'password' => Hash::make('Admin@1234'),
            'role'     => 'hr_manager',
        ]);
    }
}
