<?php

namespace App\Observers;

use App\Http\Controllers\SMSController;
use App\Models\Schedule;
use App\Services\SmsService;
use App\Models\User;

class ScheduleObserver
{
    protected $smsService;

    public function __construct(SMSController $smsService)
    {
        $this->smsService = $smsService;
    }

    public function created(Schedule $schedule)
    {
    // Send SMS to residents when a new schedule is created
        $this->sendScheduleNotification($schedule);
    }

    public function updated(Schedule $schedule)
    {
        // Optional: Send SMS when schedule is updated
        if ($schedule->wasChanged(['date', 'time', 'status'])) {
            $this->sendScheduleUpdateNotification($schedule);
        }
    }

    protected function sendScheduleNotification(Schedule $schedule)
    {
        // Get all residents
        $residents = User::where('role', 'resident')
                        ->whereNotNull('phone_number')
                        ->get();

        if ($residents->isEmpty()) {
            return;
        }

        // Prepare the message
        $message = $this->formatScheduleMessage($schedule);

        // Send SMS to each resident
        foreach ($residents as $resident) {
            $this->smsService->sendSms($resident->phone_number, $message);
        }
    }

    protected function sendScheduleUpdateNotification(Schedule $schedule)
    {
        // Similar logic for updates
        $residents = User::where('role', 'resident')
                        ->whereNotNull('phone_number')
                        ->where('status', 'active')
                        ->get();

        $message = $this->formatScheduleUpdateMessage($schedule);

        foreach ($residents as $resident) {
            $this->smsService->sendSms($resident->phone_number, $message);
        }
    }

    protected function formatScheduleMessage(Schedule $schedule)
    {
        return "New Schedule Created!\n" .
               "Date: " . $schedule->date . "\n" .
               "Time: " . $schedule->time . "\n" .
               "Route: " . ($schedule->scheduleRoute->name ?? 'N/A') . "\n" .
               "Driver: " . ($schedule->driver->name ?? 'N/A') . "\n" .
               "Thank you!";
    }

    protected function formatScheduleUpdateMessage(Schedule $schedule)
    {
        return "Schedule Updated!\n" .
               "Date: " . $schedule->date . "\n" .
               "Time: " . $schedule->time . "\n" .
               "Status: " . $schedule->status . "\n" .
               "Please check for updates.";
    }
}