<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleStationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'station_route_id',
        'station_order',
        'status',
        'arrived_at',
        'departed_at',
        'completed_at',
        'notes',
    ];

    protected $casts = [
        'arrived_at' => 'datetime',
        'completed_at' => 'datetime',
        'departed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    public function station()
    {
        return $this->belongsTo(StationRoute::class, 'station_route_id');
    }
}
