<?php

use Illuminate\Support\Facades\Broadcast;

// Private notification channel — only the owner can subscribe
Broadcast::channel('notifications.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// HR-only operational feed — leave requests, audit log entries, password changes
Broadcast::channel('hr-feed', function ($user) {
    return in_array($user->role, ['super_admin', 'hr_manager']);
});

// Per-user feed — employee's own page sync (leave status updates, etc.)
Broadcast::channel('user-feed.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Default user model channel
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
