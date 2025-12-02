<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StationLog extends Model
{
    use HasFactory;

    protected $table = 'station_logs';

    protected $fillable = [
        'station_route_id',
        'schedule_id',
        'status',
        'notes',
        'arrived_at',
        'completed_at',
        'departed_at',
        'station_order',
    ];

    protected $casts = [
        'arrived_at' => 'datetime',
        'completed_at' => 'datetime',
        'departed_at' => 'datetime',
    ];

    public function station()
    {
        return $this->belongsTo(StationRoute::class, 'station_route_id');
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}