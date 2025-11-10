<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
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
        $totalFailed = Schedule::where('status', 'failed')->count();
        $totalOngoing = Schedule::where('status', 'ongoing')->count();
        $totalPending = Schedule::where('status', 'pending')->count();

        // Get collections within the last 7 days
        $startDate = Carbon::now()->subDays(6)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $schedules = Schedule::whereBetween('date', [$startDate, $endDate])->get();


        // Group by day and count success/failed
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
        return Inertia::render(
            'Admin/Dashboard',
            [
                'totalCollections' => $totalCollections,
                'totalSuccess' => $totalSuccess,
                'totalFailed' => $totalFailed,
                'totalOngoing' => $totalOngoing,
                'totalPending' => $totalPending,
                'weeklyPerformance' => $weeklyData,

                'totalUsers' => $totalUsers,
                'adminCount' => $adminCount,
                'driverCount' => $driverCount,
                'residentCount' => $residentCount,
            ]
        );
    }
}
