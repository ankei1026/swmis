<?php

namespace App\Http\Controllers;

use App\Models\ScheduleRoute;
use App\Models\StationRoute;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScheduleRouteController extends Controller
{
    public function createSchedulingRoute()
    {
        $stationroutes = StationRoute::all(['id', 'name', 'latitude', 'longitude']);
        $drivers = User::where('role', 'driver')->get(['id', 'name', 'email']);

        return Inertia::render('Admin/ScheduleRoutes/Create', [
            'stationroutes' => $stationroutes,
            'drivers' => $drivers,
        ]);
    }

    public function listSchedulingRoute()
    {
        // Eager load driver
        $scheduleroutes = ScheduleRoute::with(['driver:id,name'])->get();

        // Transform each schedule route with the computed attributes
        $transformedRoutes = $scheduleroutes->map(function ($scheduleRoute) {
            // Access the station_routes attribute (computed property from the model)
            $stationRoutes = $scheduleRoute->station_routes; // This calls getStationRoutesAttribute()
            
            return [
                'id' => $scheduleRoute->id,
                'route_name' => $scheduleRoute->route_name,
                'station_order' => $scheduleRoute->station_order,
                'driver_id' => $scheduleRoute->driver_id,
                'created_at' => $scheduleRoute->created_at,
                'updated_at' => $scheduleRoute->updated_at,
                // Include the driver relationship data
                'driver' => $scheduleRoute->driver,
                // Add computed attributes
                'station_routes' => $stationRoutes,
                'station_names' => $scheduleRoute->station_names, // This calls getStationNamesAttribute()
                'driver_name' => $scheduleRoute->driver_name,    // This calls getDriverNameAttribute()
            ];
        });

        return Inertia::render('Admin/ScheduleRoutes/List', [
            'scheduleroutes' => $transformedRoutes,
        ]);
    }

    public function editSchedulingRoute($id)
    {
        $scheduleRoute = ScheduleRoute::with(['driver:id,name'])->findOrFail($id);
        $stationroutes = StationRoute::all(['id', 'name', 'latitude', 'longitude']);
        $drivers = User::where('role', 'driver')->get(['id', 'name', 'email']);

        // Transform the schedule route with computed attributes
        $transformedRoute = [
            'id' => $scheduleRoute->id,
            'route_name' => $scheduleRoute->route_name,
            'station_order' => $scheduleRoute->station_order,
            'driver_id' => $scheduleRoute->driver_id,
            'created_at' => $scheduleRoute->created_at,
            'updated_at' => $scheduleRoute->updated_at,
            // Include the driver relationship data
            'driver' => $scheduleRoute->driver,
            // Add computed attributes
            'station_routes' => $scheduleRoute->station_routes, // This calls getStationRoutesAttribute()
            'station_names' => $scheduleRoute->station_names,   // This calls getStationNamesAttribute()
            'driver_name' => $scheduleRoute->driver_name,      // This calls getDriverNameAttribute()
        ];

        return Inertia::render('Admin/ScheduleRoutes/Edit', [
            'scheduleRoute' => $transformedRoute,
            'stationroutes' => $stationroutes,
            'drivers' => $drivers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'route_name' => 'required|string|max:255',
            'station_order' => 'required|array|min:2',
            'station_order.*' => 'exists:station_routes,id',
            'driver_id' => 'required|exists:users,id',
        ]);

        ScheduleRoute::create($validated);

        return redirect()->route('admin.scheduleroute.list')->with('success', 'Route created successfully!');
    }

    public function update(Request $request, $id)
    {
        $scheduleRoute = ScheduleRoute::findOrFail($id);

        $validated = $request->validate([
            'route_name' => 'required|string|max:255',
            'station_order' => 'required|array|min:2',
            'station_order.*' => 'exists:station_routes,id',
            'driver_id' => 'required|exists:users,id',
        ]);

        $scheduleRoute->update($validated);

        return redirect()->route('admin.scheduleroute.list')->with('success', 'Route updated successfully!');
    }

    public function destroy($id)
    {
        $scheduleRoute = ScheduleRoute::findOrFail($id);
        $scheduleRoute->delete();

        return redirect()->route('admin.scheduleroute.list')->with('success', 'Route deleted successfully!');
    }
}