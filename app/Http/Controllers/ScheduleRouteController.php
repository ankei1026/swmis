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

        // Add computed attributes to each schedule route
        $scheduleroutes->each(function ($scheduleRoute) {
            // Load station routes for the map and names
            $scheduleRoute->station_routes = $scheduleRoute->stationRoutes();
            $scheduleRoute->station_names = $scheduleRoute->station_names;
            $scheduleRoute->driver_name = $scheduleRoute->driver_name;
        });

        return Inertia::render('Admin/ScheduleRoutes/List', [
            'scheduleroutes' => $scheduleroutes,
        ]);
    }

    public function editSchedulingRoute($id)
    {
        $scheduleRoute = ScheduleRoute::with(['driver:id,name'])->findOrFail($id);
        $stationroutes = StationRoute::all(['id', 'name', 'latitude', 'longitude']);
        $drivers = User::where('role', 'driver')->get(['id', 'name', 'email']);

        // Load station routes for the map
        $scheduleRoute->station_routes = $scheduleRoute->stationRoutes();

        return Inertia::render('Admin/ScheduleRoutes/Edit', [
            'scheduleRoute' => $scheduleRoute,
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

        // Use 'station_order' directly since that's what your model expects
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