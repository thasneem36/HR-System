<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Notification $notification;

    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    /**
     * Broadcast on:
     *  - private channel for a specific user  → notifications.{userId}
     *  - public  channel for ALL users        → notifications
     */
    public function broadcastOn(): array
    {
        if ($this->notification->user_id) {
            return [new PrivateChannel('notifications.' . $this->notification->user_id)];
        }

        return [new Channel('notifications')];
    }

    public function broadcastAs(): string
    {
        return 'notification.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'id'         => $this->notification->id,
            'title'      => $this->notification->title,
            'message'    => $this->notification->message,
            'type'       => $this->notification->type,
            'data'       => $this->notification->data,
            'created_at' => $this->notification->created_at->toISOString(),
        ];
    }
}
