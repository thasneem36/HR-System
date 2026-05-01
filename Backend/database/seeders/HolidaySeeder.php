<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HolidaySeeder extends Seeder
{
    public function run(): void
    {
        $year = now()->year;

        $holidays = [
            ['title' => "New Year's Day",         'date' => "{$year}-01-01", 'is_recurring' => true],
            ['title' => 'Tamil Thai Pongal Day',   'date' => "{$year}-01-14", 'is_recurring' => true],
            ['title' => 'National Day',             'date' => "{$year}-02-04", 'is_recurring' => true],
            ['title' => 'Sinhala & Tamil New Year', 'date' => "{$year}-04-14", 'is_recurring' => true],
            ['title' => 'May Day',                  'date' => "{$year}-05-01", 'is_recurring' => true],
            ['title' => 'Eid ul-Fitr',              'date' => "{$year}-03-31", 'is_recurring' => false],
            ['title' => 'Vesak Full Moon Poya Day', 'date' => "{$year}-05-23", 'is_recurring' => false],
            ['title' => 'Christmas Day',            'date' => "{$year}-12-25", 'is_recurring' => true],
        ];

        foreach ($holidays as $holiday) {
            DB::table('holidays')->updateOrInsert(
                ['title' => $holiday['title'], 'date' => $holiday['date']],
                array_merge($holiday, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }
}
