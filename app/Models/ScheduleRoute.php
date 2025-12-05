<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_name',
        'station_order',
        'driver_id',
    ];

    protected $casts = [
        'station_order' => 'array',
    ];

    // Relationship to drivers
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    // FIXED: Remove the pivot table relationship since you use JSON
    // public function stationRoutes()
    // {
    //     return $this->belongsToMany(StationRoute::class, 'route_station', 'schedule_route_id', 'station_route_id')
    //         ->withTimestamps();
    // }
    
    // Keep this method instead
    public function getStationRoutesAttribute()
    {
        $stationRouteIds = $this->station_order ?? [];
        if (empty($stationRouteIds) || !is_array($stationRouteIds)) {
            return collect(); // Always return a collection, never null
        }

        $stations = StationRoute::whereIn('id', $stationRouteIds)->get();

        // Order them according to station_order
        return collect($stationRouteIds)->map(function ($id) use ($stations) {
            return $stations->where('id', $id)->first();
        })->filter();
    }
    
    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'schedule_route_id');
    }

    // Accessor for station names
    public function getStationNamesAttribute()
    {
        $stationRoutes = $this->station_routes;
        if ($stationRoutes->isEmpty()) {
            return 'No stations assigned';
        }

        return $stationRoutes->pluck('name')->join(', ');
    }

    // Accessor for driver name
    public function getDriverNameAttribute()
    {
        return $this->driver ? $this->driver->name : 'Unassigned';
    }

    // Helper method to add a station to the route order
    public function addStationToOrder($stationRouteId)
    {
        $currentOrder = $this->station_order ?? [];
        $currentOrder[] = $stationRouteId;
        $this->station_order = $currentOrder;
        return $this;
    }
}