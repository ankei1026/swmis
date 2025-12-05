<?php

namespace App\Events;

use App\Models\Schedule;
use App\Models\StationRoute;
use App\Models\ScheduleStationLog;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class StationStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $scheduleId;
    public $stationId;
    public $stationLog;
    public $station;
    public $driverId;

    public function __construct($scheduleId, StationRoute $station, $driverId)
    {
        $this->scheduleId = $scheduleId;
        $this->station = $station;
        $this->stationId = $station->id;
        $this->driverId = $driverId;
        
        // Fetch the actual station log from ScheduleStationLog
        $this->stationLog = ScheduleStationLog::where('schedule_id', $scheduleId)
            ->where('station_route_id', $station->id)
            ->first();
    }

    public function broadcastOn()
    {
        return [
            new Channel('driver.' . $this->driverId),
            new Channel('monitoring')  // Add monitoring channel
        ];
    }

    public function broadcastAs()
    {
        return 'station.updated';
    }

    public function broadcastWith()
    {
        return [
            'schedule_id' => $this->scheduleId,
            'station' => [
                'id' => $this->station->id,
                'name' => $this->station->name,
                'latitude' => $this->station->latitude,
                'longitude' => $this->station->longitude,
                'status' => $this->stationLog ? $this->stationLog->status : 'pending',
                'arrived_at' => $this->stationLog?->arrived_at?->toDateTimeString(),
                'completed_at' => $this->stationLog?->completed_at?->toDateTimeString(),
                'departed_at' => $this->stationLog?->departed_at?->toDateTimeString(),
            ],
        ];
    }
}