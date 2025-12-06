<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Complaint;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ResidentComplaintNotification;

class ResidentComplaintController extends Controller
{
    public function index()
    {
        $barangays = Barangay::select('id', 'name')->get();

        $complaints = Complaint::where('resident_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Resident/Complaint', [
            'barangays' => $barangays,
            'complaints' => $complaints,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'barangay' => 'required|string',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        $path = $request->file('photo')
            ? $request->file('photo')->store('complaints', 'public')
            : null;

        $complaint = Complaint::create([
            'resident_id' => Auth::id(),
            'type' => $validated['type'],
            'barangay' => $validated['barangay'],
            'photo' => $path,
            'description' => $validated['description'] ?? null,
            'status' => 'pending',
        ]);

        // Load the resident relationship for the notification
        $complaint->load('resident');

        // Notify all admin users
        $adminUsers = User::where('role', 'admin')->get();
        foreach ($adminUsers as $admin) {
            $admin->notify(new ResidentComplaintNotification($complaint));
        }

        return back()->with('success', 'Complaint submitted successfully!');
    }
}
