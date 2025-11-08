<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ResidentController extends Controller
{
    public function index (){
        return Inertia::render('Resident/Dashboard');
    }
}
