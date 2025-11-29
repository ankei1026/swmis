<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Notifications\ComplaintStatusUpdateNotification;

class ComplaintsController extends Controller
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
                'barangay' => $c->barangay,
                'description'    => $c->description,
                'photo'      => $c->photo ? asset('storage/' . $c->photo) : null,
                'timestamps'       => $c->created_at->format('m-d-Y'),
                'status'     => $c->status,
            ]);

        return Inertia::render('Admin/Complaint/List', [
            'complaints' => $complaints
        ]);
    }

    public function edit($id)
    {
        $complaint = Complaint::with('resident:id,name')->findOrFail($id);

        return Inertia::render('Admin/Complaint/Edit', [
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

        $complaint = Complaint::with('resident')->findOrFail($id);
        $oldStatus = $complaint->status;
        $complaint->update([
            'status' => $request->status,
        ]);

        // Notify the resident if status changed
        if ($oldStatus !== $request->status) {
            $complaint->resident->notify(new ComplaintStatusUpdateNotification($complaint));
        }

        return redirect()->route('admin.complaints')->with('success', 'Complaint updated');
    }
}