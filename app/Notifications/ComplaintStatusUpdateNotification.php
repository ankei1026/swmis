<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintStatusUpdateNotification extends Notification
{
    use Queueable;

    protected $complaint;

    /**
     * Create a new notification instance.
     */
    public function __construct($complaint)
    {
        $this->complaint = $complaint;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        $status = $this->complaint->status;
        $message = $status === 'resolve'
            ? "Your complaint has been resolved by the administration."
            : "Your complaint status has been updated to {$status}.";

        return [
            'complaint_id' => $this->complaint->id,
            'title' => 'Complaint Status Updated',
            'message' => $message,
            'type' => 'complaint_update',
            'url' => route('resident.complaints.index')
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
