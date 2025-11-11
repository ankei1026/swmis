<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\ScheduleRoute;
use App\Models\StationRoute;
use App\Models\Barangay;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ResidentController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get basic collection statistics
        $totalCollections = Schedule::count();
        $totalSuccess = Schedule::where('status', 'success')->count();
        $totalFailed = Schedule::where('status', 'failed')->count();
        $totalOngoing = Schedule::where('status', 'in_progress')->count();
        $totalPending = Schedule::where('status', 'pending')->count();

        // Get collections within the last 7 days for weekly performance
        $startDate = Carbon::now()->subDays(6)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $schedules = Schedule::whereBetween('date', [$startDate, $endDate])->get();

        // Calculate success counts by route and most successful route
        $successCountsByRoute = $this->getSuccessCountsByRoute();
        $mostSuccessfulRoute = $this->getMostSuccessfulRoute($successCountsByRoute);
        $routeStations = $this->getRouteStationsWithOrder(array_keys($successCountsByRoute));

        // Group by day and count success/failed for weekly performance
        $weeklyData = collect();
        foreach (range(0, 6) as $i) {
            $day = $startDate->copy()->addDays($i);
            $success = $schedules->where('date', $day->toDateString())->where('status', 'success')->count();
            $failed = $schedules->where('date', $day->toDateString())->where('status', 'failed')->count();

            $weeklyData->push([
                'label' => $day->format('D'),
                'success' => $success,
                'failed' => $failed,
            ]);
        }

        return Inertia::render('Resident/Dashboard', [
            // Basic collection stats
            'totalCollections' => $totalCollections,
            'totalSuccess' => $totalSuccess,
            'totalFailed' => $totalFailed,
            'totalOngoing' => $totalOngoing,
            'totalPending' => $totalPending,
            
            // Weekly performance data
            'weeklyPerformance' => $weeklyData,

            // Route information
            'successCountsByRoute' => $successCountsByRoute,
            'mostSuccessfulRoute' => $mostSuccessfulRoute,
            'routeStations' => $routeStations,

            // User information
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ]);
    }

    /**
     * Get success counts grouped by route
     */
    private function getSuccessCountsByRoute()
    {
        $successfulSchedules = Schedule::where('status', 'success')
            ->where('completed_at', '>=', Carbon::now()->subDays(7))
            ->with('scheduleRoute')
            ->get();

        $successCountsByRoute = [];

        foreach ($successfulSchedules as $schedule) {
            // Access through the relationship
            $routeName = $schedule->scheduleRoute->route_name ?? 'Unknown Route';

            if (!isset($successCountsByRoute[$routeName])) {
                $successCountsByRoute[$routeName] = 0;
            }
            $successCountsByRoute[$routeName]++;
        }

        return $successCountsByRoute;
    }

    /**
     * Get the most successful route from the counts
     */
    private function getMostSuccessfulRoute($successCountsByRoute)
    {
        if (empty($successCountsByRoute)) {
            return null;
        }

        $maxCount = max($successCountsByRoute);
        $mostSuccessfulRoutes = array_keys($successCountsByRoute, $maxCount);

        return $mostSuccessfulRoutes[0] ?? null;
    }

    /**
     * Get route stations with proper order
     */
    private function getRouteStationsWithOrder($routeNames)
    {
        if (empty($routeNames)) {
            return [];
        }

        $routeStations = [];

        $scheduleRoutes = ScheduleRoute::whereIn('route_name', $routeNames)
            ->select('id', 'route_name', 'station_order')
            ->get()
            ->keyBy('route_name');

        foreach ($routeNames as $routeName) {
            $scheduleRoute = $scheduleRoutes[$routeName] ?? null;

            if ($scheduleRoute && $scheduleRoute->station_order) {
                $stationIds = $scheduleRoute->station_order;

                if (is_string($stationIds)) {
                    $stationIds = json_decode($stationIds, true);
                }

                if (!empty($stationIds) && is_array($stationIds)) {
                    // Ensure station IDs are integers
                    $stationIds = array_map('intval', $stationIds);

                    $stations = StationRoute::whereIn('id', $stationIds)
                        ->select('id', 'name', 'latitude', 'longitude')
                        ->get();

                    $stationLookup = $stations->keyBy('id');

                    $orderedStations = collect();
                    foreach ($stationIds as $stationId) {
                        $station = $stationLookup[$stationId] ?? null;
                        if ($station && $station->latitude !== null && $station->longitude !== null) {
                            $orderedStations->push([
                                'id' => $station->id,
                                'name' => $station->name,
                                'lat' => (float)$station->latitude,
                                'lng' => (float)$station->longitude,
                            ]);
                        }
                    }

                    $routeStations[$routeName] = $orderedStations->toArray();
                }
            }
        }

        return $routeStations;
    }

    /**
     * Get upcoming schedules for the resident
     */
    private function getUpcomingSchedules()
    {
        return Schedule::where('date', '>=', Carbon::now()->startOfDay())
            ->whereIn('status', ['pending', 'in_progress'])
            ->with('scheduleRoute')
            ->orderBy('date', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'date' => $schedule->date,
                    'route_name' => $schedule->scheduleRoute->route_name ?? 'Unknown Route',
                    'status' => $schedule->status,
                    'estimated_time' => $schedule->estimated_time,
                ];
            });
    }

    /**
     * Get resident's recent collection history
     */
    private function getRecentCollections()
    {
        return Schedule::where('completed_at', '>=', Carbon::now()->subDays(30))
            ->whereIn('status', ['success', 'failed'])
            ->with('scheduleRoute')
            ->orderBy('completed_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'date' => $schedule->date,
                    'route_name' => $schedule->scheduleRoute->route_name ?? 'Unknown Route',
                    'status' => $schedule->status,
                    'completed_at' => $schedule->completed_at,
                ];
            });
    }
}