<?php

namespace Database\Seeders;

use App\Models\Barangay;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BarangaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Barangay::factory()->create([
            'id' => 1,
            'name' => 'Tabon',
            'latitude' => 8.18223,
            'longitude' =>  126.361,
        ]);

        Barangay::factory()->create([
            'id' => 2,
            'name' => 'Union Site',
            'latitude' => 8.18510314811277,
            'longitude' =>  126.35441376975687,
        ]);

    }
}   
