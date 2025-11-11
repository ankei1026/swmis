<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\User;
use App\Models\ScheduleStationLog;
use App\Models\StationRoute;

class MonitoringController extends Controller
{
    public function index()
    {
        // Get all active schedules with their drivers and progress
        $activeSchedules = Schedule::with([
            'driver', 
            'scheduleRoute', 
            'stationLogs.station',
            'stationLogs' => function($query) {
                $query->orderBy('station_order');
            }
        ])
        ->whereIn('status', ['in_progress', 'completed'])
        ->whereHas('driver')
        ->orderBy('status')
        ->orderBy('started_at', 'desc')
        ->get()
        ->map(function ($schedule) {
            $stations = $schedule->scheduleRoute->station_routes ?? collect();
            
            return [
                'id' => $schedule->id,
                'driver_id' => $schedule->driver_id,
                'driver_name' => $schedule->driver->name ?? 'Unknown Driver',
                'driver_avatar' => $schedule->driver->profile_photo_url ?? null,
                'route_name' => $schedule->scheduleRoute->route_name ?? 'Unknown Route',
                'status' => $schedule->status,
                'started_at' => $schedule->started_at?->toDateTimeString(),
                'completed_at' => $schedule->completed_at?->toDateTimeString(),
                'progress_percentage' => $schedule->progress_percentage,
                'current_station' => $schedule->currentStation?->station?->name ?? 'Not started',
                'stations' => $stations->map(function ($station, $index) use ($schedule) {
                    if (!$station) return null;

                    $log = $schedule->stationLogs->where('station_route_id', $station->id)->first();
                    return [
                        'id' => $station->id,
                        'name' => $station->name,
                        'latitude' => $station->latitude,
                        'longitude' => $station->longitude,
                        'status' => $log ? $log->status : 'pending',
                        'order' => $index,
                        'arrived_at' => $log?->arrived_at?->toDateTimeString(),
                        'completed_at' => $log?->completed_at?->toDateTimeString(),
                        'departed_at' => $log?->departed_at?->toDateTimeString(),
                    ];
                })->filter(),
                'last_updated' => $schedule->updated_at?->toDateTimeString(),
            ];
        });

        // Get all drivers with their current locations
        $drivers = User::where('role', 'driver')
            ->whereHas('schedules', function($query) {
                $query->whereIn('status', ['in_progress']);
            })
            ->with(['schedules' => function($query) {
                $query->whereIn('status', ['in_progress'])
                      ->with(['stationLogs' => function($q) {
                          $q->whereIn('status', ['arrived', 'collecting'])
                            ->orderBy('station_order')
                            ->with('station');
                      }]);
            }])
            ->get()
            ->map(function ($driver) {
                $currentSchedule = $driver->schedules->first();
                $currentStationLog = $currentSchedule?->stationLogs->first();
                
                return [
                    'id' => $driver->id,
                    'name' => $driver->name,
                    'email' => $driver->email,
                    'avatar' => $driver->profile_photo_url,
                    'current_schedule_id' => $currentSchedule?->id,
                    'current_station' => $currentStationLog?->station,
                    'status' => $currentSchedule ? 'active' : 'inactive',
                    'last_seen' => $driver->updated_at?->toDateTimeString(),
                ];
            });

        return Inertia::render('Admin/Monitoring', [
            'activeSchedules' => $activeSchedules,
            'drivers' => $drivers,
        ]);
    }

    // API endpoint for real-time updates
    public function getLiveUpdates()
    {
        $activeSchedules = Schedule::with([
            'driver', 
            'scheduleRoute', 
            'stationLogs.station'
        ])
        ->whereIn('status', ['in_progress'])
        ->whereHas('driver')
        ->get()
        ->map(function ($schedule) {
            $stations = $schedule->scheduleRoute->station_routes ?? collect();
            
            return [
                'id' => $schedule->id,
                'driver_id' => $schedule->driver_id,
                'driver_name' => $schedule->driver->name ?? 'Unknown Driver',
                'route_name' => $schedule->scheduleRoute->route_name ?? 'Unknown Route',
                'status' => $schedule->status,
                'progress_percentage' => $schedule->progress_percentage,
                'current_station' => $schedule->currentStation?->station?->name ?? 'Not started',
                'stations' => $stations->map(function ($station, $index) use ($schedule) {
                    if (!$station) return null;

                    $log = $schedule->stationLogs->where('station_route_id', $station->id)->first();
                    return [
                        'id' => $station->id,
                        'name' => $station->name,
                        'latitude' => $station->latitude,
                        'longitude' => $station->longitude,
                        'status' => $log ? $log->status : 'pending',
                        'order' => $index,
                    ];
                })->filter(),
                'last_updated' => $schedule->updated_at?->toDateTimeString(),
            ];
        });

        return response()->json([
            'schedules' => $activeSchedules,
            'last_updated' => now()->toDateTimeString(),
        ]);
    }
}