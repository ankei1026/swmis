<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResidentComplaintNotification extends Notification
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
        return [
            'complaint_id' => $this->complaint->id,
            'title' => 'New Resident Complaint',
            'message' => "A new complaint has been submitted by {$this->complaint->resident->name}. Please review it at your earliest convenience.",
            'type' => 'new_complaint',
            'url' => route('complaints.edit', $this->complaint->id)

        ];
    }

    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
