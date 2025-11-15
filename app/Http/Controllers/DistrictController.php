<?php

namespace App\Http\Controllers;

use App\Models\District;
use Illuminate\Http\Request;

class DistrictController extends Controller
{
    public function createDistrict()
    {
        $districts = District::select('id', 'name')->get();

        return inertia('Admin/District/Create', [
            'districts' => $districts
        ]);
    }

    public function listDistrict()
    {
        $districts = District::all();
        return inertia('Admin/District/List', [
            'districts' => $districts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        District::create($validated);

        return redirect()->route('admin.district.list')->with('success', 'District created successfully!');
    }

    public function edit($id)
    {
        $district = District::findOrFail($id);

        return inertia('Admin/District/Edit', [
            'district' => $district,
        ]);
    }

    public function update(Request $request, $id)
    {
        $district = District::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $district->update($validated);

        return redirect()->route('admin.district.list')->with('success', 'District updated successfully!');
    }

    public function destroy($id)
    {
        $district = District::findOrFail($id);
        $district->delete();

        return redirect()->route('admin.district.list')->with('success', 'District deleted successfully.');
    }
}
