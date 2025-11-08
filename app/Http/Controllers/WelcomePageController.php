<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomePageController extends Controller
{

    public function index()
    {
        $barangays = Barangay::select('id', 'name')->get();

        return Inertia::render('Welcome', [
            'barangays' => $barangays,
        ]);
    }
}
