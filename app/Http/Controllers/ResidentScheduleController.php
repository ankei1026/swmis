<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ResidentScheduleController extends Controller
{
    public function index(){
        return Inertia::render('Resident/Schedule');
    }
}
