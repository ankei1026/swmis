<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\ScheduleStationLog;

class StationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $log;

    public function __construct(ScheduleStationLog $log)
    {
        $this->log = $log->load('station');
    }

    public function broadcastOn()
    {
        return new Channel('monitoring');
    }

    public function broadcastAs()
    {
        return 'station.updated';
    }
}