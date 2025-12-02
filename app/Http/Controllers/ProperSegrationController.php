<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProperSegrationController extends Controller
{
    public function index() {
        return Inertia::render('Resident/ProperSegration');
    }
}
