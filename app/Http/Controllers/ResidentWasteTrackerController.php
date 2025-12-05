<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\User;
use App\Models\ScheduleStationLog;
use App\Models\StationRoute;
use App\Events\StationUpdated;
use App\Events\ScheduleUpdated;

class ResidentWasteTrackerController extends Controller
{
    public function index()
    {
        // Get all active schedules with their drivers and progress
        $activeSchedules = Schedule::with([
            'driver',
            'scheduleRoute',
            'stationLogs.station',
            'stationLogs' => function ($query) {
                $query->orderBy('station_order');
            }
        ])
            ->whereIn('status', ['in_progress', 'completed', 'success'])
            ->whereHas('driver')
            ->orderBy('status')
            ->orderBy('started_at', 'desc')
            ->get()
            ->map(function ($schedule) {
                $stations = $schedule->scheduleRoute->station_routes ?? collect();

                // Get all station logs for this schedule
                $stationLogs = $schedule->stationLogs;

                return [
                    'id' => $schedule->id,
                    'driver_id' => $schedule->driver_id,
                    'driver_name' => $schedule->driver->name ?? 'Unknown Driver',
                    'driver_avatar' => $schedule->driver->profile_photo_url ?? null,
                    'route_name' => $schedule->scheduleRoute->route_name ?? 'Unknown Route',
                    'status' => $schedule->status === 'success' ? 'completed' : $schedule->status,
                    'started_at' => $schedule->started_at?->toDateTimeString(),
                    'completed_at' => $schedule->completed_at?->toDateTimeString(),
                    'progress_percentage' => $schedule->progress_percentage,
                    'current_station' => $schedule->currentStation?->station?->name ?? 'Not started',
                    'stations' => $stations->map(function ($station, $index) use ($schedule, $stationLogs) {
                        if (!$station) return null;

                        $log = $stationLogs->where('station_route_id', $station->id)->first();

                        // If schedule is completed (or success), force all stations to 'completed' status
                        $status = $log ? $log->status : 'pending';
                        if (in_array($schedule->status, ['completed', 'success'])) {
                            $status = 'completed';
                            // Ensure completion timestamp exists
                            if (empty($log?->completed_at) && !empty($log?->arrived_at)) {
                                $completed_at = $log?->arrived_at;
                            } elseif (empty($log?->completed_at)) {
                                $completed_at = $schedule->completed_at ?? now();
                            }
                        }

                        return [
                            'id' => $station->id,
                            'name' => $station->name,
                            'latitude' => $station->latitude,
                            'longitude' => $station->longitude,
                            'status' => $status,
                            'order' => $index,
                            'arrived_at' => $log?->arrived_at?->toDateTimeString(),
                            'completed_at' => $log?->completed_at?->toDateTimeString(),
                            'departed_at' => $log?->departed_at?->toDateTimeString(),
                        ];
                    })->filter(),
                    'last_updated' => $schedule->updated_at?->toDateTimeString(),
                ];
            });

        // Get all drivers with their current locations
        $drivers = User::where('role', 'driver')
            ->whereHas('schedules', function ($query) {
                $query->whereIn('status', ['in_progress']);
            })
            ->with(['schedules' => function ($query) {
                $query->whereIn('status', ['in_progress'])
                    ->with(['stationLogs' => function ($q) {
                        $q->whereIn('status', ['arrived', 'collecting'])
                            ->orderBy('station_order')
                            ->with('station');
                    }]);
            }])
            ->get()
            ->map(function ($driver) {
                $currentSchedule = $driver->schedules->first();
                $currentStationLog = $currentSchedule?->stationLogs->first();

                return [
                    'id' => $driver->id,
                    'name' => $driver->name,
                    'email' => $driver->email,
                    'avatar' => $driver->profile_photo_url,
                    'current_schedule_id' => $currentSchedule?->id,
                    'current_station' => $currentStationLog?->station,
                    'status' => $currentSchedule ? 'active' : 'inactive',
                    'last_seen' => $driver->updated_at?->toDateTimeString(),
                ];
            });

        return Inertia::render('Resident/Monitoring', [
            'activeSchedules' => $activeSchedules,
            'drivers' => $drivers,
        ]);
    }

    // API endpoint for real-time updates
    public function getLiveUpdates()
    {
        try {
            \Log::info('Fetching live updates - Starting');

            $activeSchedules = Schedule::with([
                'driver',
                'scheduleRoute',
                'stationLogs.station'
            ])
                ->whereIn('status', ['in_progress', 'completed', 'success'])
                ->whereHas('driver')
                ->orderBy('status')
                ->orderBy('updated_at', 'desc')
                ->get();

            \Log::info('Schedules fetched: ' . $activeSchedules->count());

            $formattedSchedules = $activeSchedules->map(function ($schedule) {
                \Log::info('Processing schedule ID: ' . $schedule->id);

                $routeName = 'Unknown Route';
                $driverName = 'Unknown Driver';
                $stationsData = []; // Initialize as empty array

                if ($schedule->driver) {
                    $driverName = $schedule->driver->name ?? 'Unknown Driver';
                }

                if ($schedule->scheduleRoute) {
                    $routeName = $schedule->scheduleRoute->route_name ?? 'Unknown Route';

                    // Get station_order - handle both JSON string and array
                    $stationOrder = $schedule->scheduleRoute->station_order;

                    // If it's a JSON string, decode it
                    if (is_string($stationOrder)) {
                        $stationOrder = json_decode($stationOrder, true);
                    }

                    // Ensure it's an array
                    $stationOrder = is_array($stationOrder) ? $stationOrder : [];

                    \Log::info('Schedule ' . $schedule->id . ' station_order: ', $stationOrder);

                    if (!empty($stationOrder)) {
                        // Fetch stations in the order they appear in the JSON array
                        $stations = \App\Models\StationRoute::whereIn('id', $stationOrder)->get();

                        // Create a map of station_id => station for quick lookup
                        $stationMap = [];
                        foreach ($stations as $station) {
                            $stationMap[$station->id] = $station;
                        }

                        // Build stationsData in the correct order
                        foreach ($stationOrder as $index => $stationId) {
                            if (isset($stationMap[$stationId])) {
                                $station = $stationMap[$stationId];

                                // Find the corresponding log for this station
                                $log = null;
                                if ($schedule->stationLogs) {
                                    $log = $schedule->stationLogs->where('station_route_id', $stationId)->first();
                                }

                                $status = $log ? $log->status : 'pending';

                                // Force completed status if schedule is completed
                                if ($schedule->status === 'completed' || $schedule->status === 'success') {
                                    $status = 'completed';
                                }

                                $stationsData[] = [
                                    'id' => $station->id,
                                    'name' => $station->name ?? 'Unknown Station',
                                    'latitude' => (float) ($station->latitude ?? 0),
                                    'longitude' => (float) ($station->longitude ?? 0),
                                    'status' => $status,
                                    'order' => $index, // Use the index from station_order array
                                    'arrived_at' => $log?->arrived_at?->toDateTimeString(),
                                    'completed_at' => $log?->completed_at?->toDateTimeString(),
                                    'departed_at' => $log?->departed_at?->toDateTimeString(),
                                ];
                            } else {
                                \Log::warning('Station ID ' . $stationId . ' not found for schedule ' . $schedule->id);
                            }
                        }
                    }
                }

                // Get current station name
                $currentStationName = 'Not started';
                if ($schedule->currentStation) {
                    $currentStation = $schedule->currentStation;
                    if ($currentStation->station) {
                        $currentStationName = $currentStation->station->name;
                    }
                }

                return [
                    'id' => $schedule->id,
                    'driver_id' => $schedule->driver_id,
                    'driver_name' => $driverName,
                    'driver_avatar' => $schedule->driver->profile_photo_url ?? null,
                    'route_name' => $routeName,
                    'status' => $schedule->status === 'success' ? 'completed' : $schedule->status,
                    'progress_percentage' => $schedule->progress_percentage ?? 0,
                    'current_station' => $currentStationName,
                    'stations' => $stationsData,
                    'last_updated' => $schedule->updated_at?->toDateTimeString() ?? now()->toDateTimeString(),
                    'started_at' => $schedule->started_at?->toDateTimeString(),
                    'completed_at' => $schedule->completed_at?->toDateTimeString(),
                ];
            });

            \Log::info('Live updates processed successfully');

            return response()->json([
                'schedules' => $formattedSchedules,
                'last_updated' => now()->toDateTimeString(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in getLiveUpdates: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Server error occurred',
                'message' => $e->getMessage(),
                'schedules' => [],
                'last_updated' => now()->toDateTimeString(),
            ]);
        }
    }

    // Add this method to update individual station status
    public function updateStationStatus(Request $request, ScheduleStationLog $log)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,arrived,collecting,completed,departed,failed',
            'arrived_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'departed_at' => 'nullable|date',
        ]);

        $log->update($validated);

        // Broadcast station update event
        broadcast(new StationUpdated($log->fresh()));

        // Also broadcast schedule update to refresh the whole schedule
        $schedule = $log->schedule;
        if ($schedule) {
            broadcast(new ScheduleUpdated($schedule->fresh()));
        }

        return response()->json([
            'message' => 'Station status updated successfully',
            'log' => $log->load('station')
        ]);
    }
}