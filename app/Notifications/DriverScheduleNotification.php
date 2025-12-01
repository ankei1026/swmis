<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class DriverScheduleNotification extends Notification
{
    use Queueable;

    protected $schedule;
    /**
     * Create a new notification instance.
     */
    public function __construct($schedule)
    {
        $this->schedule = $schedule;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toDatabase($notifiable)
    {
        $formattedDate = Carbon::parse($this->schedule->date)->format('M j, Y');
        $formattedTime = Carbon::parse($this->schedule->time)->format('h:i A');

        return [
            'schedule_id' => $this->schedule->id,
            'title' => 'Schedule Assigned',
            'message' => "A new schedule has been assigned to you on {$formattedDate} at {$formattedTime} for the {$this->schedule->route} route.",
            'type' => 'schedule_assigned',
            'url' => route('driver.collection-tracker')
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
