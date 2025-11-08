<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ResidentWasteTrackerController extends Controller
{
    public function index(){
        return Inertia::render('Resident/Monitoring');
    }
}
