<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at->diffForHumans(),
                ];
            });

        return response()->json($notifications);
    }

    public function markAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        
        return response()->json(['message' => 'Notifications marked as read']);
    }

    public function getUnreadCount(Request $request)
    {
        $count = $request->user()->unreadNotifications()->count();
        
        return response()->json(['count' => $count]);
    }
}