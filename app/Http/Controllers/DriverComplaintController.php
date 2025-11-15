<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DriverComplaintController extends Controller
{
    public function index()
    {
        $complaints = Complaint::with('resident:id,name')
            ->select('id', 'resident_id', 'photo', 'description', 'barangay', 'type', 'status', 'created_at')
            ->orderByDesc('id')
            ->get()
            ->map(fn($c) => [
                'id'         => $c->id,
                'name'   => $c->resident->name,
                'type'       => $c->type,
                'description'    => $c->description,
                'barangay' => $c->barangay,
                'photo'      => $c->photo ? asset('storage/' . $c->photo) : null,
                'timestamps'       => $c->created_at->format('m-d-Y'),
                'status'     => $c->status,
            ]);

        return Inertia::render('Driver/Complaint/List', [
            'complaints' => $complaints
        ]);
    }

    public function edit($id)
    {
        $complaint = Complaint::with('resident:id,name')->findOrFail($id);

        return Inertia::render('Driver/Complaint/Edit', [
            'complaint' => [
                'id' => $complaint->id,
                'resident' => $complaint->resident->name,
                'type' => $complaint->type,
                'barangay' => $complaint->barangay,
                'description' => $complaint->description,
                'status' => $complaint->status,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,resolve'
        ]);

        $complaint = Complaint::findOrFail($id);
        $complaint->update([
            'status' => $request->status,
        ]);

        return redirect()->route('driver.complaints')->with('success', 'Complaint updated');
    }
}
