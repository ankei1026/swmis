<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('schedules')->insert([
            [
                'date' => Carbon::now()->addDays(1)->toDateString(),
                'time' => '08:00:00',
                'route' => 'Zone 1 - Main Road',
                'driver_id' => 1, // ensure this user exists in users table
                'type' => 'Biodegradable (Malata)',
                'status' => 'ongoing',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'date' => Carbon::now()->addDays(2)->toDateString(),
                'time' => '09:30:00',
                'route' => 'Zone 2 - Riverside',
                'driver_id' => 1,
                'type' => 'Non-Biodegradable (Di-Malata)',
                'status' => 'ongoing',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'date' => Carbon::now()->subDays(1)->toDateString(),
                'time' => '07:00:00',
                'route' => 'Zone 3 - Market Area',
                'driver_id' => 2,
                'type' => 'Biodegradable (Malata)',
                'status' => 'success',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'date' => Carbon::now()->subDays(3)->toDateString(),
                'time' => '10:00:00',
                'route' => 'Zone 4 - School District',
                'driver_id' => 2,
                'type' => 'Non-Biodegradable (Di-Malata)',
                'status' => 'failed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
