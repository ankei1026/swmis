<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Schedule;

class ScheduleUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $schedule;

    public function __construct(Schedule $schedule)
    {
        $this->schedule = $schedule->load([
            'driver',
            'scheduleRoute',
            'stationLogs' => function ($query) {
                $query->orderBy('station_order');
            }
        ]);
    }

    public function broadcastOn()
    {
        return new Channel('monitoring');
    }

    public function broadcastAs()
    {
        return 'schedule.updated';
    }
    
    public function broadcastWith()
    {
        // Use the getStationRoutesAttribute() method
        $stations = $this->schedule->station_routes;

        return [
            'id' => $this->schedule->id,
            'driver_id' => $this->schedule->driver_id,
            'driver_name' => $this->schedule->driver->name ?? 'Unknown Driver',
            'driver_avatar' => $this->schedule->driver->profile_photo_url ?? null,
            'route_name' => $this->schedule->scheduleRoute->route_name ?? 'Unknown Route',
            'status' => $this->schedule->status,
            'progress_percentage' => $this->schedule->progress_percentage ?? 0,
            'started_at' => $this->schedule->started_at?->toDateTimeString(),
            'completed_at' => $this->schedule->completed_at?->toDateTimeString(),
            'date' => $this->schedule->date,
            'time' => $this->schedule->time,
            'stations' => $stations->map(function ($station, $index) {
                if (!$station) return null;
                
                $log = $this->schedule->stationLogs->where('station_route_id', $station->id)->first();
                
                return [
                    'id' => $station->id,
                    'name' => $station->name,
                    'latitude' => $station->latitude,
                    'longitude' => $station->longitude,
                    'status' => $log ? $log->status : 'pending',
                    'order' => $index,
                    'arrived_at' => $log?->arrived_at?->toDateTimeString(),
                    'completed_at' => $log?->completed_at?->toDateTimeString(),
                    'departed_at' => $log?->departed_at?->toDateTimeString(),
                ];
            })->filter()->values(),
            'last_updated' => $this->schedule->updated_at?->toDateTimeString(),
        ];
    }
}