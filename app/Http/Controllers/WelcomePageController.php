<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomePageController extends Controller
{

    public function index()
    {
        $barangays = Barangay::select('id', 'name')->get();

        $successCount = Schedule::where('status', 'success')->count();

        return Inertia::render('Welcome', [
            'barangays' => $barangays,
            'successCount' => $successCount
        ]);


    }
}
