<?php

namespace App\Http\Controllers;

use App\Models\StationRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StationRouteController extends Controller
{
    public function createStationRoute()
    {
        return inertia('Driver/StationRoutes/Create');
    }

    public function listStationRoute()
    {   
        $stationroutes = StationRoute::all();


        return Inertia::render('Driver/StationRoutes/List', [
            'stationroutes' => $stationroutes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',

        ]);

        StationRoute::create($validated);

        return redirect()->route('driver.stationroute.list')->with('success', 'Station Route created successfully!');
    }

    public function edit($id){
        $stationroute = StationRoute::findOrFail($id);
        return Inertia::render('Driver/StationRoutes/Edit', ['stationroute' => $stationroute]);
    }

    public function update(Request $request, $id){
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',

        ]);

        $stationroute = StationRoute::findOrFail($id);
        $stationroute->update($validated);

        return redirect()->route('driver.stationroute.list')->with('success', 'Station Route updated successfully!');
    }

    public function destroy($id){
        $stationroute = StationRoute::findOrFail($id);
        $stationroute->delete();

        return redirect()->route('driver.stationroute.list')->with('success', 'Station Route deleted successfully!');
    }
}
