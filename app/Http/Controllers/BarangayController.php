<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\District;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangayController extends Controller
{
    public function createBarangay()
    {
        $districts = District::all();
        return inertia(
            'Admin/Barangay/Create',
            [
                'districts' => $districts
            ]
        );
    }

    public function listBarangay()
    {
        // Eager load the district relationship
        $barangays = Barangay::with('district')->get();
        $districts = District::all();

        return Inertia::render('Admin/Barangay/List', [
            'barangays' => $barangays,
            'districts' => $districts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'district_id' => 'required|exists:districts,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        Barangay::create($validated);

        return redirect()->route('admin.barangay.list')->with('success', 'Purok created successfully.');
    }


    public function edit($id) // Change parameter to accept ID
    {
        // Eager load district for edit page and find by ID
        $barangay = Barangay::with('district')->findOrFail($id);
        $districts = District::all();

        return inertia('Admin/Barangay/Edit', [ // Make sure this path matches your file structure
            'barangay' => $barangay,
            'districts' => $districts
        ]);
    }

    public function update(Request $request, Barangay $barangay)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'district_id' => 'required|exists:districts,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $barangay->update($validated);

        return redirect()->route('admin.barangay.list')->with('success', 'Purok updated successfully.');
    }

    public function destroy($id)
    {
        $barangay = Barangay::findOrFail($id);
        $barangay->delete();

        return redirect()->route('admin.barangay.list')->with('success', 'Purok deleted successfully!');
    }
}
