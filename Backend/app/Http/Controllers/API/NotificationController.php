<?php

namespace App\Http\Controllers\API;

use App\Events\NotificationSent;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    /** GET /notifications — list MY notifications (newest first) */
    public function index(Request $request)
    {
        $notifications = Notification::forUser($request->user()->id)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        return $this->success($notifications);
    }

    /** GET /notifications/unread-count */
    public function unreadCount(Request $request)
    {
        $count = Notification::forUser($request->user()->id)->unread()->count();
        return $this->success(['count' => $count]);
    }

    /** POST /notifications — HR/Admin sends a notification */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
            'type'    => 'nullable|in:info,success,warning,error',
            'user_id' => 'nullable|exists:users,id', // null = broadcast to all
        ]);

        $notification = Notification::create([
            'user_id' => $validated['user_id'] ?? null,
            'title'   => $validated['title'],
            'message' => $validated['message'],
            'type'    => $validated['type'] ?? 'info',
        ]);

        // Broadcast live via Reverb WebSocket
        broadcast(new NotificationSent($notification));

        return $this->created($notification, 'Notification sent');
    }

    /** PATCH /notifications/{id}/read — mark one as read */
    public function markRead(Request $request, int $id)
    {
        $notification = Notification::forUser($request->user()->id)->findOrFail($id);
        $notification->update(['read_at' => now()]);
        return $this->success(null, 'Marked as read');
    }

    /** PATCH /notifications/read-all — mark ALL as read */
    public function markAllRead(Request $request)
    {
        Notification::forUser($request->user()->id)
            ->unread()
            ->update(['read_at' => now()]);

        return $this->success(null, 'All marked as read');
    }

    /** DELETE /notifications/{id} */
    public function destroy(Request $request, int $id)
    {
        $notification = Notification::forUser($request->user()->id)->findOrFail($id);
        $notification->delete();
        return $this->success(null, 'Notification deleted');
    }
}
