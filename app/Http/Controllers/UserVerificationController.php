<?php

namespace App\Http\Controllers;

use App\Models\UserVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserVerificationController extends Controller
{
    // Resident: View verification status page
    public function index()
    {
        $verifications = UserVerification::with('resident')
            ->where('resident_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Resident/UserVerification', [
            'verifications' => $verifications
        ]);
    }

    // Admin: View all verification submissions
    public function adminIndex()
    {
        $verifications = UserVerification::with(['resident' => function ($query) {
            $query->select('id', 'name', 'email');
        }])
            ->latest()
            ->get()
            ->map(function ($verification) {
                return [
                    'id' => $verification->id,
                    'resident_id' => $verification->resident_id,
                    'resident_name' => $verification->resident->name,
                    'resident_email' => $verification->resident->email,
                    'type' => $verification->type,
                    'status' => $verification->status,
                    'admin_feedback' => $verification->admin_feedback,
                    'created_at' => $verification->created_at->toISOString(),
                    'photo' => $verification->photo,
                ];
            });

        return Inertia::render('Admin/UserVerification', [
            'verifications' => $verifications
        ]);
    }

    // Resident: Store new verification submission
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:valid_id,birth_certificate,barangay_certificate',
            'photo' => 'required|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120',
        ]);

        // Check if user already has a pending submission for this document type
        $existingSubmission = UserVerification::where('resident_id', Auth::id())
            ->where('type', $request->type)
            ->where('status', 'pending')
            ->first();

        if ($existingSubmission) {
            return redirect()->back()->withErrors([
                'type' => 'You already have a pending submission for this document type. Please wait for admin review.'
            ]);
        }

        // Handle file upload
        if ($request->hasFile('photo')) {
            $filePath = $request->file('photo')->store('user-verifications', 'public');
        }

        try {
            UserVerification::create([
                'resident_id' => Auth::id(),
                'type' => $request->type,
                'photo' => $filePath,
                'status' => 'pending', // Always pending for resident submissions
                'admin_feedback' => null,
            ]);

            return redirect()->back()->with('success', 'Verification document submitted successfully! Admin will review it soon.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to submit verification document.');
        }
    }

    // Admin: Update verification status (approve/reject)
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,pending',
            'admin_feedback' => 'nullable|string|max:500',
        ]);

        $verification = UserVerification::findOrFail($id);

        try {
            $verification->update([
                'status' => $request->status,
                'admin_feedback' => $request->admin_feedback,
            ]);

            return redirect()->back()->with('success', 'Verification status updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update verification status.');
        }
    }

    // Admin: Delete verification submission
    public function destroy($id)
    {
        $verification = UserVerification::findOrFail($id);

        try {
            // Delete the associated file
            if ($verification->photo && Storage::disk('public')->exists($verification->photo)) {
                Storage::disk('public')->delete($verification->photo);
            }

            $verification->delete();

            return redirect()->back()->with('success', 'Verification submission deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete verification submission.');
        }
    }

    // Resident: View specific verification (optional)
    public function show($id)
    {
        $verification = UserVerification::with('resident')
            ->where('resident_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('Resident/UserVerificationShow', [
            'verification' => $verification
        ]);
    }

    // Admin: View specific verification (optional)
    public function adminShow($id)
    {
        $verification = UserVerification::with('resident')->findOrFail($id);

        return Inertia::render('Admin/UserVerificationShow', [
            'verification' => $verification
        ]);
    }
}
