<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\ScheduleRoute;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SchedulingController extends Controller
{
    public function createScheduling()
    {
        // Get all schedule routes with their drivers
        $scheduleRoutes = ScheduleRoute::with('driver')->get()->map(function ($route) {
            // Use the accessor instead of relationship - handle null case
            $stationRoutes = collect($route->station_routes ?? [])->map(function ($stationRoute) {
                return [
                    'id' => $stationRoute->id,
                    'name' => $stationRoute->name,
                    'latitude' => $stationRoute->latitude,
                    'longitude' => $stationRoute->longitude,
                ];
            });

            return [
                'id' => $route->id,
                'route_name' => $route->route_name,
                'driver_id' => $route->driver_id,
                'driver_name' => $route->driver ? $route->driver->name : 'Unassigned',
                'station_names' => $route->station_names,
                'station_routes' => $stationRoutes,
            ];
        });

        return Inertia::render('Admin/Schedule/Create', [
            'scheduleRoutes' => $scheduleRoutes,
        ]);
    }

    public function listScheduling()
    {
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
                    'created_at' => $schedule->created_at,
                    'station_routes' => $stationRoutes->map(function ($station) {
                        return [
                            'id' => $station->id,
                            'name' => $station->name,
                            'latitude' => $station->latitude,
                            'longitude' => $station->longitude,
                        ];
                    })
                ];
            });

        return Inertia::render('Admin/Schedule/List', [
            'schedules' => $schedules
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'time' => 'required|date_format:H:i:s',
            'schedule_route_id' => 'required|exists:schedule_routes,id',
            'status' => 'required|in:Success,Failed,Pending',
            'type' => 'required|in:Biodegradable (Malata),Non-Biodegradable (Di-Malata)',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                // Get the schedule route to access the driver_id
                $scheduleRoute = ScheduleRoute::findOrFail($validated['schedule_route_id']);

                Schedule::create([
                    'date' => $validated['date'],
                    'time' => $validated['time'],
                    'schedule_route_id' => $validated['schedule_route_id'],
                    'driver_id' => $scheduleRoute->driver_id, // Use the driver from the route
                    'status' => $validated['status'],
                    'type' => $validated['type'],
                ]);
            });

            return redirect()->route('admin.scheduling.create')
                ->with('success', 'Schedule created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create schedule: ' . $e->getMessage());
        }
    }

    // Add the missing edit method
    public function edit(Schedule $schedule)
    {
        // Load the schedule with relationships
        $schedule->load(['scheduleRoute', 'driver']);

        // Get all schedule routes for the dropdown
        $scheduleRoutes = ScheduleRoute::with('driver')->get()->map(function ($route) {
            $stationRoutes = collect($route->station_routes ?? [])->map(function ($stationRoute) {
                return [
                    'id' => $stationRoute->id,
                    'name' => $stationRoute->name,
                    'latitude' => $stationRoute->latitude,
                    'longitude' => $stationRoute->longitude,
                ];
            });

            return [
                'id' => $route->id,
                'route_name' => $route->route_name,
                'driver_id' => $route->driver_id,
                'driver_name' => $route->driver ? $route->driver->name : 'Unassigned',
                'station_names' => $route->station_names,
                'station_routes' => $stationRoutes,
            ];
        });

        // Format the schedule data for the form
        $scheduleData = [
            'id' => $schedule->id,
            'date' => $schedule->date,
            'time' => $schedule->time,
            'schedule_route_id' => $schedule->schedule_route_id,
            'status' => $schedule->status,
            'type' => $schedule->type,
            'route_name' => $schedule->scheduleRoute->route_name ?? 'No Route',
            'driver_name' => $schedule->driver->name ?? 'No Driver',
            'station_routes' => $schedule->scheduleRoute ? 
                collect($schedule->scheduleRoute->station_routes)->map(function ($station) {
                    return [
                        'id' => $station->id,
                        'name' => $station->name,
                        'latitude' => $station->latitude,
                        'longitude' => $station->longitude,
                    ];
                }) : collect()
        ];

        return Inertia::render('Admin/Schedule/Edit', [
            'schedule' => $scheduleData,
            'scheduleRoutes' => $scheduleRoutes,
        ]);
    }

    // You might also want an update method
    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'time' => 'required|date_format:H:i:s',
            'schedule_route_id' => 'required|exists:schedule_routes,id',
            'status' => 'required|in:Success,Failed,Pending,In_progess',
            'type' => 'required|in:Biodegradable (Malata),Non-Biodegradable (Di-Malata)',
        ]);

        try {
            DB::transaction(function () use ($validated, $schedule) {
                // Get the schedule route to access the driver_id
                $scheduleRoute = ScheduleRoute::findOrFail($validated['schedule_route_id']);

                $schedule->update([
                    'date' => $validated['date'],
                    'time' => $validated['time'],
                    'schedule_route_id' => $validated['schedule_route_id'],
                    'driver_id' => $scheduleRoute->driver_id,
                    'status' => $validated['status'],
                    'type' => $validated['type'],
                ]);
            });

            return redirect()->route('admin.scheduling.list')
                ->with('success', 'Schedule updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update schedule: ' . $e->getMessage());
        }
    }

    public function destroy(Schedule $schedule)
    {
        try {
            $schedule->delete();
            return redirect()->route('admin.scheduling.list')
                ->with('success', 'Schedule deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete schedule: ' . $e->getMessage());
        }
    }
}