<?php

namespace App\Events;

use App\Models\Order; // 💡 Pastikan model di-import
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order; // 💡 Sediakan variabel publik agar bisa dibaca React

    public function __construct($order = null)
    {
        $this->order = $order;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('dapur-channel'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'OrderCreated';
    }
}