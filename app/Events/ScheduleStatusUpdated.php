<?php

namespace App\Events;

use App\Models\Schedule;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ScheduleStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $schedule;
    public $driverId;

    public function __construct(Schedule $schedule)
    {
        $this->schedule = $schedule->load(['scheduleRoute', 'stationLogs.station']);
        $this->driverId = $schedule->driver_id;
    }

    public function broadcastOn()
    {
        return new Channel('driver.' . $this->driverId);
    }

    public function broadcastAs()
    {
        return 'schedule.updated';
    }

    public function broadcastWith()
    {
        $stations = $this->schedule->scheduleRoute->station_routes ?? collect();

        return [
            'id' => $this->schedule->id,
            'date' => $this->schedule->date,
            'time' => $this->schedule->time,
            'status' => $this->schedule->status,
            'route_name' => $this->schedule->scheduleRoute->route_name,
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
                    'arrived_at' => $log?->arrived_at,
                    'completed_at' => $log?->completed_at,
                    'departed_at' => $log?->departed_at,
                ];
            })->filter()->values(),
            'progress_percentage' => $this->schedule->progress_percentage,
        ];
    }
}