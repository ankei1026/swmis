<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ResidentProfileController extends Controller
{
    public function index(){
        return Inertia::render('Resident/Profile');
    }

    public function adminProfile(){
        return Inertia::render('Admin/Profile');
    }   

    public function driverProfile(){
        return Inertia::render('Driver/Profile');
    }  
}
