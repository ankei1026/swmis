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
    ];

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function scheduleRoute()
    {
        return $this->belongsTo(ScheduleRoute::class, 'schedule_route_id');
    }

    // Fix this relationship - it should get stations through the scheduleRoute
    public function stationRoutes()
    {
        return $this->hasManyThrough(
            StationRoute::class,
            ScheduleRoute::class,
            'id', // Foreign key on ScheduleRoute table
            'id', // Foreign key on StationRoute table  
            'schedule_route_id', // Local key on schedules table
            'id' // Local key on schedule_routes table
        );
    }

    // Or better: access station routes through scheduleRoute
    public function getStationRoutesAttribute()
    {
        return $this->scheduleRoute->station_routes ?? collect();
    }
}