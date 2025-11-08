<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarangayController extends Controller
{
    public function createBarangay()
    {
        return Inertia::render('Driver/Barangay/Create');
    }

    public function listBarangay()
    {
        $barangays = Barangay::all();

        return Inertia::render('Driver/Barangay/List', [
            'barangays' => $barangays,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',

        ]);

        Barangay::create($validated);

        return redirect()->route('driver.barangay.list')->with('success', 'Barangay created successfully!');
    }

    public function edit($id)
    {
        $barangay = Barangay::findOrFail($id);
        return Inertia::render('Driver/Barangay/Edit', ['barangay' => $barangay]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',

        ]);

        $barangay = Barangay::findOrFail($id);
        $barangay->update($validated);

        return redirect()->route('driver.barangay.list')->with('success', 'Barangay updated successfully!');
    }

    public function destroy($id)
    {
        $barangay = Barangay::findOrFail($id);
        $barangay->delete();

        return redirect()->route('driver.barangay.list')->with('success', 'Barangay deleted successfully!');
    }
}
