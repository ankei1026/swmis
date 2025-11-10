<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class UsersInfoController extends Controller
{
    public function index()
    {
        // Get total users count
        $totalUsers = User::count();
        
        // Get admin count (assuming you have a 'role' column)
        $adminCount = User::where('role', 'admin')->count();
        
        // Get driver count
        $driverCount = User::where('role', 'driver')->count();
        
        // Get resident count
        $residentCount = User::where('role', 'resident')->count();

        return Inertia::render('Components/UsersInfoDashboard', [
            'usersInfo' => [
                'totalUsers' => $totalUsers,
                'adminCount' => $adminCount,
                'driverCount' => $driverCount,
                'residentCount' => $residentCount,
            ]
        ]);
    }

}