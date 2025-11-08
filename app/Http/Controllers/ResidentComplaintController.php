<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Complaint;
use Illuminate\Support\Facades\Auth;

class ResidentComplaintController extends Controller
{
    public function index()
    {
        $barangays = Barangay::select('id', 'name')->get();
        return Inertia::render('Resident/Complaint', [
            'barangays' => $barangays,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:garbage,road,sewage,public_safety',
            'barangay' => 'required|string',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        $path = $request->file('photo')
            ? $request->file('photo')->store('complaints', 'public')
            : null;

        Complaint::create([
            'resident_id' => Auth::id(),
            'type' => $validated['type'],
            'barangay' => $validated['barangay'],
            'photo' => $path,
            'description' => $validated['description'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Complaint submitted successfully!');
    }
}
