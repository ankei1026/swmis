<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'time',
        'schedule_route_id',
        'driver_id',
        'status',
        'type',
        'started_at',
        'completed_at'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function scheduleRoute()
    {
        return $this->belongsTo(ScheduleRoute::class, 'schedule_route_id');
    }

    public function stationLogs()
    {
        return $this->hasMany(ScheduleStationLog::class)->orderBy('station_order');
    }

    // Access stations through scheduleRoute
    public function getStationRoutesAttribute()
    {
        if (!$this->scheduleRoute) {
            return collect();
        }

        $stationOrder = $this->scheduleRoute->station_order ?? [];
        if (empty($stationOrder) || !is_array($stationOrder)) {
            return collect();
        }

        $stations = \App\Models\StationRoute::whereIn('id', $stationOrder)->get();

        // Order them according to station_order
        return collect($stationOrder)->map(function ($id) use ($stations) {
            return $stations->where('id', $id)->first();
        })->filter();
    }

    // Get current station (the one being worked on or next in line)
    public function getCurrentStationAttribute()
    {
        // First try to find a station that's currently active
        $activeStation = $this->stationLogs()
            ->whereIn('status', ['arrived', 'collecting'])
            ->orderBy('station_order')
            ->first();

        if ($activeStation) {
            return $activeStation;
        }

        // If no active station, find the first pending station
        $pendingStation = $this->stationLogs()
            ->where('status', 'pending')
            ->orderBy('station_order')
            ->first();

        if ($pendingStation) {
            return $pendingStation;
        }

        // If all are completed/departed, return the last one
        return $this->stationLogs()
            ->whereIn('status', ['completed', 'departed'])
            ->orderBy('station_order', 'desc')
            ->first();
    }


    // Calculate progress percentage
    public function getProgressPercentageAttribute()
    {
        // Always return 100% if schedule is completed or success
        if (in_array($this->status, ['completed', 'success'])) {
            return 100;
        }

        $totalStations = $this->stationRoutes->count();
        if ($totalStations === 0) {
            return 0;
        }

        $completedStations = $this->stationLogs()
            ->where('status', 'completed')
            ->count();

        // If all stations are completed but schedule status isn't "completed" or "success"
        if ($completedStations === $totalStations && !in_array($this->status, ['completed', 'success'])) {
            return 100;
        }

        return round(($completedStations / $totalStations) * 100);
    }

    // Helper method to get all stations with their status
    public function getStationsWithStatusAttribute()
    {
        $stationRoutes = $this->stationRoutes;
        $stationLogs = $this->stationLogs;

        return $stationRoutes->map(function ($stationRoute, $index) use ($stationLogs) {
            $log = $stationLogs->where('station_route_id', $stationRoute->id)->first();

            return [
                'station' => $stationRoute,
                'log' => $log,
                'status' => $log ? $log->status : 'pending',
                'order' => $index,
            ];
        });
    }
}
