<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;

class GarbageInfoController extends Controller
{
    public function index()
    {
        // Get counts based on status
        $totalCollections = Schedule::count();
        $totalSuccess = Schedule::where('status', 'success')->count();
        $totalFailed = Schedule::where('status', 'failed')->count();

        return Inertia::render('Components/GarbageInfoDashboard', [
            'totalCollections' => $totalCollections,
            'totalSuccess' => $totalSuccess,
            'totalFailed' => $totalFailed,
        ]);
    }
}
