<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResidentScheduleController extends Controller
{

    public function index(){
        $schedules = Schedule::with(['scheduleRoute', 'driver'])
            ->latest()
            ->get()
            ->map(function ($schedule) {
                // Use the accessor to get station routes
                $stationRoutes = $schedule->scheduleRoute ? $schedule->scheduleRoute->station_routes : collect();

                return [
                    'id' => $schedule->id,
                    'date' => $schedule->date,
                    'time' => $schedule->time,
                    'route_name' => $schedule->scheduleRoute->route_name ?? 'No Route',
                    'driver_name' => $schedule->driver->name ?? 'No Driver',
                    'type' => $schedule->type,
                    'status' => $schedule->status,
                    'created_at' => $schedule->created_at->toISOString(),
                    'station_routes' => $stationRoutes->map(function ($station) {
                        return [
                            'id' => $station->id,
                            'name' => $station->name,
                            'latitude' => $station->latitude,
                            'longitude' => $station->longitude,
                        ];
                    })->toArray()
                ];
            });

        return Inertia::render('Resident/Schedule',[
            'schedules' => $schedules
        ]);
    }
}
