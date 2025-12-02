<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\ScheduleStationLog;
use App\Models\StationRoute;
use Illuminate\Support\Facades\Auth;
use App\Events\StationStatusUpdated;
use App\Events\ScheduleStatusUpdated;

class WasteTrackerDriverController extends Controller
{
    public function index()
    {
        $driverId = Auth::id();

        $schedules = Schedule::with(['scheduleRoute', 'stationLogs.station'])
            ->where('driver_id', $driverId)
            ->whereIn('status', ['pending', 'in_progress', 'completed'])
            ->orderBy('date')
            ->orderBy('time')
            ->get()
            ->map(function ($schedule) {
                // Get stations through the scheduleRoute's station_routes accessor
                $stations = $schedule->scheduleRoute->station_routes ?? collect();

                return [
                    'id' => $schedule->id,
                    'date' => $schedule->date,
                    'time' => $schedule->time,
                    'status' => $schedule->status,
                    'route_name' => $schedule->scheduleRoute->route_name,
                    'stations' => $stations->map(function ($station, $index) use ($schedule) {
                        if (!$station) return null;

                        $log = $schedule->stationLogs->where('station_route_id', $station->id)->first();
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
                    })->filter(),
                    'current_station' => $schedule->currentStation?->station,
                    'progress_percentage' => $schedule->progress_percentage,
                    'started_at' => $schedule->started_at,
                    'completed_at' => $schedule->completed_at,
                ];
            });

        return Inertia::render('Driver/CollectionTracker', [
            'schedules' => $schedules,
        ]);
    }

    public function startSchedule(Request $request, Schedule $schedule)
    {
        // Check if schedule already has logs
        $existingLogs = ScheduleStationLog::where('schedule_id', $schedule->id)->count();

        if ($existingLogs === 0) {
            // Initialize station logs from schedule route's station_order
            $stationOrder = $schedule->scheduleRoute->station_order ?? [];

            foreach ($stationOrder as $index => $stationId) {
                ScheduleStationLog::create([
                    'schedule_id' => $schedule->id,
                    'station_route_id' => $stationId,
                    'station_order' => $index,
                    'status' => $index === 0 ? 'arrived' : 'pending',
                    'arrived_at' => $index === 0 ? now() : null,
                ]);
            }
        }

        $schedule->update([
            'status' => 'in_progress',
            'started_at' => now(),
        ]);

        // Broadcast schedule started to listeners
        event(new ScheduleStatusUpdated($schedule));

        return redirect()->route('driver.collection-tracker');
    }

    public function updateStationStatus(Request $request, Schedule $schedule, StationRoute $station)
    {
        $validStatuses = ['arrived', 'collecting', 'completed', 'departed', 'failed'];

        $request->validate([
            'status' => 'required|in:' . implode(',', $validStatuses),
            'notes' => 'nullable|string',
        ]);

        $log = ScheduleStationLog::where('schedule_id', $schedule->id)
            ->where('station_route_id', $station->id)
            ->firstOrFail();

        $previousStatus = $log->status;
        $log->update([
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        // Update timestamps based on status
        switch ($request->status) {
            case 'arrived':
                if (!$log->arrived_at) {
                    $log->update(['arrived_at' => now()]);
                }
                break;
            case 'completed':
                if (!$log->completed_at) {
                    $log->update(['completed_at' => now()]);
                }
                break;
            case 'departed':
                if (!$log->departed_at) {
                    $log->update(['departed_at' => now()]);

                    // Auto-set next station to arrived if exists
                    $nextLog = ScheduleStationLog::where('schedule_id', $schedule->id)
                        ->where('station_order', $log->station_order + 1)
                        ->first();

                    if ($nextLog && $nextLog->status === 'pending') {
                        $nextLog->update([
                            'status' => 'arrived',
                            'arrived_at' => now(),
                        ]);
                    }
                }
                break;
        }

        // Check if all stations are completed
        $this->checkScheduleCompletion($schedule);

        // Broadcast station update and schedule update for real-time viewers
        event(new StationStatusUpdated($schedule->id, $station, $schedule->driver_id));
        event(new ScheduleStatusUpdated($schedule));

        return redirect()->route('driver.collection-tracker');
    }

    // In your ScheduleController or similar
    public function completeSchedule(Schedule $schedule)
    {
        // Validate that the schedule can be completed
        if ($schedule->status !== 'in_progress') {
            return back()->with('error', 'Schedule is not in progress.');
        }

        // Update the schedule status to 'success' instead of 'completed'
        $schedule->update([
            'status' => 'success', // Changed from 'completed' to 'success'
            'completed_at' => now(),
        ]);

        // Broadcast schedule completion
        event(new ScheduleStatusUpdated($schedule));

        return back()->with('success', 'Schedule completed successfully.');
    }

    public function abortSchedule(Request $request, Schedule $schedule)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        // Mark all pending stations as failed
        ScheduleStationLog::where('schedule_id', $schedule->id)
            ->whereNotIn('status', ['completed', 'failed'])
            ->update([
                'status' => 'failed',
                'completed_at' => now(),
            ]);

        $schedule->update([
            'status' => 'failed',
            'completed_at' => now(),
            'notes' => $request->notes ?? "Schedule aborted: " . $request->reason,
        ]);

        // Broadcast schedule abort
        event(new ScheduleStatusUpdated($schedule));

        return redirect()->route('driver.collection-tracker')->with('success', 'Schedule aborted successfully');
    }

    public function failSchedule(Request $request, Schedule $schedule)
    {
        $request->validate([
            'notes' => 'required|string',
        ]);

        $schedule->update([
            'status' => 'failed',
            'completed_at' => now(),
            'notes' => $request->notes,
        ]);

        // Broadcast schedule failure
        event(new ScheduleStatusUpdated($schedule));

        return redirect()->route('driver.collection-tracker');
    }

    private function checkScheduleCompletion(Schedule $schedule)
    {
        // Count stations that are NOT completed or failed
        $incompleteStations = ScheduleStationLog::where('schedule_id', $schedule->id)
            ->whereNotIn('status', ['completed', 'failed'])
            ->count();

        // If all stations are completed or failed, mark the schedule as completed
        if ($incompleteStations === 0) {
            $completedStations = ScheduleStationLog::where('schedule_id', $schedule->id)
                ->where('status', 'completed')
                ->count();

            $totalStations = ScheduleStationLog::where('schedule_id', $schedule->id)->count();

            // If all stations are completed (not just all are completed/failed), mark as completed
            if ($completedStations === $totalStations) {
                $schedule->update([
                    'status' => 'success',
                    'completed_at' => now(),
                ]);

                // Broadcast schedule completion
                event(new ScheduleStatusUpdated($schedule));
            } else {
                // If some stations failed, mark as failed
                $schedule->update([
                    'status' => 'failed',
                    'completed_at' => now(),
                ]);

                // Broadcast schedule failure
                event(new ScheduleStatusUpdated($schedule));
            }
        }
    }

    // Get schedule details for API
    public function getSchedule(Schedule $schedule)
    {
        $schedule->load(['scheduleRoute', 'stationLogs.station']);

        $stations = $schedule->scheduleRoute->station_routes ?? collect();

        $formattedSchedule = [
            'id' => $schedule->id,
            'date' => $schedule->date,
            'time' => $schedule->time,
            'status' => $schedule->status,
            'route_name' => $schedule->scheduleRoute->route_name,
            'stations' => $stations->map(function ($station, $index) use ($schedule) {
                if (!$station) return null;

                $log = $schedule->stationLogs->where('station_route_id', $station->id)->first();
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
            })->filter(),
            'current_station' => $schedule->currentStation?->station,
            'progress_percentage' => $schedule->progress_percentage,
        ];

        return response()->json($formattedSchedule);
    }
}
