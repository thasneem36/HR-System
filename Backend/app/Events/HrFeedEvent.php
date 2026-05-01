<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Lightweight broadcast to the private hr-feed channel.
 * Only HR managers and super admins can subscribe (see channels.php).
 * Used for live page sync: leave requests, audit log entries, password changes.
 */
class HrFeedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly string $eventName,
        public readonly array  $payload = []
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('hr-feed')];
    }

    public function broadcastAs(): string
    {
        return $this->eventName;
    }

    public function broadcastWith(): array
    {
        return $this->payload;
    }
}
