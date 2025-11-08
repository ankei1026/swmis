<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MonitoringController extends Controller
{
    public function index (){
        return Inertia::render('Admin/Monitoring');
    }

}
