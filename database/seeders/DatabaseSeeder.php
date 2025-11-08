<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\BarangaySeeder;;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'id' => 1,
            'name' => 'Admin Swmis',
            'email' => 'admin@test.com',
            'role' => 'admin',
            'barangay' => 'Tabon',
            'phone_number' => '09123456789',
            'password' => Hash::make('12341234'),
        ]);

        User::factory()->create([
            'id' => 2,
            'name' => 'Driver Swmis',
            'email' => 'driver@test.com',
            'role' => 'driver',
            'barangay' => 'Tabon',
            'phone_number' => '09123456789',
            'password' => Hash::make('12341234'),
        ]);


        User::factory()->create([
            'id' => 3,
            'name' => 'Resident Swmis',
            'email' => 'resident@test.com',
            'role' => 'resident',
            'barangay' => 'Tabon',
            'phone_number' => '09062377530',
            'password' => Hash::make('12341234'),
        ]);

        $this->call(BarangaySeeder::class);
    }
}
