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
            'name' => 'Jane Doe',
            'email' => 'admin@test.com',
            'role' => 'admin',
            'barangay' => 'Castillo Village, Purok 1',
            'phone_number' => '09123456789',
            'password' => Hash::make('12341234'),
        ]);

        // User::factory()->create([
        //     'id' => 2,
        //     'name' => 'Will Smith',
        //     'email' => 'driver@test.com',
        //     'role' => 'driver',
        //     'barangay' => 'Tabon',
        //     'phone_number' => '09123456789',
        //     'password' => Hash::make('12341234'),
        // ]);


        // User::factory()->create([
        //     'id' => 3,
        //     'name' => 'Chris Blow',
        //     'email' => 'resident@test.com',
        //     'role' => 'resident',
        //     'barangay' => 'Tabon',
        //     'phone_number' => '09062377530',
        //     'password' => Hash::make('12341234'),
        // ]);

        // $this->call(BarangaySeeder::class);
    }
}
