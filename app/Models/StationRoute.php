<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StationRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'latitude',
        'longitude',
    ];

    // Relationship to schedule routes that include this station
    public function scheduleRoutes()
    {
        return ScheduleRoute::whereJsonContains('station_route_order', $this->id)->get();
    }
}