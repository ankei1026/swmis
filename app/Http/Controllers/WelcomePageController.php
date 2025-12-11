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
        
        // Fetch schedules without the problematic scheduleRoute relationship
        // or fix the relationship query
        $schedules = Schedule::with(['driver:id,name,email'])
            ->whereNotNull('date')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'title' => 'Schedule',
                    'date' => $schedule->date,
                    'time' => $schedule->time,
                    'status' => $schedule->status,
                    'type' => $schedule->type,
                    'driver_name' => $schedule->driver ? $schedule->driver->name : 'Not Assigned',
                    'driver_email' => $schedule->driver ? $schedule->driver->email : null,
                    // Remove or fix route_name if the column doesn't exist
                    'route_name' => 'Route ' . $schedule->schedule_route_id, // Simple fallback
                ];
            });

        return Inertia::render('Welcome', [
            'barangays' => $barangays,
            'successCount' => $successCount,
            'schedules' => $schedules
        ]);
    }
}