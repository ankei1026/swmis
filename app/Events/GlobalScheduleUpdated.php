<?php

namespace App\Events;

use App\Models\Schedule;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GlobalScheduleUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $schedule;

    public function __construct(Schedule $schedule)
    {
        $this->schedule = $schedule->load([
            'driver',
            'scheduleRoute',
            'stationLogs.station'
        ]);
    }

    public function broadcastOn()
    {
        // Broadcast to both channels
        return [
            new Channel('driver.' . $this->schedule->driver_id),
            new Channel('monitoring')
        ];
    }

    public function broadcastAs()
    {
        return 'schedule.updated';
    }
    
    public function broadcastWith()
    {
        // Same data format you use in ScheduleStatusUpdated
        $stations = $this->schedule->scheduleRoute->station_routes ?? collect();

        return [
            'id' => $this->schedule->id,
            'driver_id' => $this->schedule->driver_id,
            'driver_name' => $this->schedule->driver->name ?? 'Unknown Driver',
            'driver_avatar' => $this->schedule->driver->profile_photo_url ?? null,
            'date' => $this->schedule->date,
            'time' => $this->schedule->time,
            'route_name' => $this->schedule->scheduleRoute->route_name ?? 'Unknown Route',
            'status' => $this->schedule->status,
            'started_at' => $this->schedule->started_at?->toDateTimeString(),
            'completed_at' => $this->schedule->completed_at?->toDateTimeString(),
            'progress_percentage' => $this->schedule->progress_percentage ?? 0,
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