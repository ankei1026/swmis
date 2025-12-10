<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\Schedule;
use App\Models\ScheduleRoute;
use App\Models\StationRoute;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $adminCount = User::where('role', 'admin')->count();
        $driverCount = User::where('role', 'driver')->count();
        $residentCount = User::where('role', 'resident')->count();

        $totalCollections = Schedule::count();
        $totalSuccess = Schedule::where('status', 'success')->count();
        // Combined count for statuses 'success' and 'completed'
        $totalNewSuccess = Schedule::whereIn('status', ['success', 'completed'])->count();
        $totalFailed = Schedule::where('status', 'failed')->count();
        $totalOngoing = Schedule::where('status', 'ongoing')->count();
        $totalPending = Schedule::where('status', 'pending')->count();

        // Get collections within the last 7 days
        $startDate = Carbon::now()->subDays(6)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $schedules = Schedule::whereBetween('date', [$startDate, $endDate])->get();

        // Calculate success counts by route and most successful route
        $successCountsByRoute = $this->getSuccessCountsByRoute();
        $mostSuccessfulRoute = $this->getMostSuccessfulRoute($successCountsByRoute);
        $routeStations = $this->getRouteStationsWithOrder(array_keys($successCountsByRoute));

        // Get additional counts for the dashboard cards
        $totalBarangay = Barangay::count();
        $totalStationRoute = StationRoute::count();
        $totalScheduleRoute = ScheduleRoute::count();

        // Group by day and count success/failed
        $weeklyData = collect();
        foreach (range(0, 6) as $i) {
            $day = $startDate->copy()->addDays($i);
            // Count both 'success' and 'completed' as successful runs
            $success = $schedules->where('date', $day->toDateString())->whereIn('status', ['success', 'completed'])->count();
            $failed = $schedules->where('date', $day->toDateString())->where('status', 'failed')->count();

            $weeklyData->push([
                'label' => $day->format('D'),
                'success' => $success,
                'failed' => $failed,
            ]);
        }

        return Inertia::render('Admin/Dashboard', [
            'totalCollections' => $totalCollections,
            'totalSuccess' => $totalNewSuccess,
            'totalFailed' => $totalFailed,
            'totalOngoing' => $totalOngoing,
            'totalPending' => $totalPending,
            'weeklyPerformance' => $weeklyData,

            'totalUsers' => $totalUsers,
            'adminCount' => $adminCount,
            'driverCount' => $driverCount,
            'residentCount' => $residentCount,

            'successCountsByRoute' => $successCountsByRoute,
            'mostSuccessfulRoute' => $mostSuccessfulRoute,
            'routeStations' => $routeStations,

            // Add the missing data for dashboard cards
            'totalBarangay' => $totalBarangay,
            'totalStationRoute' => $totalStationRoute,
            'totalScheduleCount' => $totalScheduleRoute,
            // New combined success + completed count
            'totalNewSuccess' => $totalNewSuccess,
        ]);
    }

    /**
     * Get success counts grouped by route
     */
    private function getSuccessCountsByRoute()
    {
        // Consider both 'success' and the new 'completed' status as successful
        $successfulSchedules = Schedule::whereIn('status', ['success', 'completed'])
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
     * Get route locations directly from station_route table
     */
    private function getRouteLocations($routeNames)
    {
        if (empty($routeNames)) {
            return [];
        }

        $routeLocations = [];

        // Get all routes with their coordinates
        $routes = StationRoute::whereIn('name', $routeNames)
            ->select('name', 'latitude', 'longitude')
            ->get()
            ->keyBy('name');

        foreach ($routeNames as $routeName) {
            $route = $routes[$routeName] ?? null;

            if ($route && $route->latitude && $route->longitude) {
                // Use the route's own coordinates
                $routeLocations[$routeName] = [
                    'lat' => $route->latitude,
                    'lng' => $route->longitude,
                ];
            } else {
                // Fallback to default location
                $routeLocations[$routeName] = $this->getDefaultRouteLocation($routeName);
            }
        }

        return $routeLocations;
    }

    /**
     * Get default route location
     */
    private function getDefaultRouteLocation($routeName)
    {
        $defaultLocations = [
            "Team 1" => ['lat' => 8.2105, 'lng' => 126.3536],
            "Tabon" => ['lat' => 8.2006, 'lng' => 126.3528],
            "Castillo Village" => ['lat' => 8.2102, 'lng' => 126.3554],
            "Bosco" => ['lat' => 8.2058, 'lng' => 126.3601],
            "Unknown Route" => ['lat' => 8.2105, 'lng' => 126.3536],
        ];

        return $defaultLocations[$routeName] ?? $defaultLocations['Unknown Route'];
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
}
