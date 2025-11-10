<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function createUser()
    {
        $barangays = Barangay::select('id', 'name')->get();

        return inertia('Admin/User/Create', [
            'barangays' => $barangays
        ]);
    }

    public function listUser()
    {
        $users = User::all();
        return inertia('Admin/User/List', ['users' => $users]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone_number' => 'required|string|max:13',
            'barangay' => 'required|string|max:255',
            'role' => 'required|string|in:admin,driver,resident',
            'status' => 'required|string|in:verified,not verified',
            'password' => 'required|string|min:8',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $validated['name'] = $validated['first_name'] . ' ' . $validated['last_name'];

        User::create($validated);

        return redirect()->route('admin.users.list')->with('success', 'User created successfully!');
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        $barangays = Barangay::select('id', 'name')->get();

        return inertia('Admin/User/Edit', [
            'user' => $user,
            'barangays' => $barangays
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'phone_number' => 'required|string|max:13',
            'barangay' => 'required|string|max:255',
            'role' => 'required|string|in:admin,driver,resident',
            'status' => 'required|string|in:verified,not verified',
        ]);

        $user->update($validated);

        return redirect()->route('admin.users.list')->with('success', 'User updated successfully!');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('admin.users.list')->with('success', 'User deleted successfully.');
    }
}