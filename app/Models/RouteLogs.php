<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RouteLogs extends Model
{
    protected $fillable = [
        'current_station_index',
        'schedule_id',
        'station_route_id',
        'started_at',
        'completed_at',
        'action',
        'notes',
        'log_time'
    ];

    protected $casts = [
        'log_time' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Relationship to Schedule
    public function schedule()
    {
        return $this->belongsTo(Schedule::class, 'schedule_id');
    }

    // Relationship to StationRoute
    public function stationRoute()
    {
        return $this->belongsTo(StationRoute::class, 'station_route_id');
    }

    // Scope for recent logs
    public function scopeRecent($query, $minutes = 30)
    {
        return $query->where('log_time', '>=', now()->subMinutes($minutes));
    }

    // Scope for specific actions
    public function scopeAction($query, $action)
    {
        return $query->where('action', $action);
    }
}