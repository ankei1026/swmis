<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class SessionController extends Controller
{
    public function index()
    {
        return Inertia::render('/');
    }

    public function store(Request $request): RedirectResponse
    {
        // ✅ Validate credentials
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // ✅ Attempt login
        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ]);
        }

        // ✅ Regenerate session for security
        $request->session()->regenerate();

        $user = Auth::user();

        // ✅ Redirect depending on role
        switch ($user->role) {
            case 'admin':
                return redirect()->intended('/admin/dashboard');

            case 'driver':
                return redirect()->intended('/driver/dashboard');

            default: // resident
                return redirect()->intended('/resident/dashboard');
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
