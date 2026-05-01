<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeDocument extends Model
{
    protected $fillable = [
        'employee_id',
        'uploaded_by',
        'title',
        'category',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'expiry_date',
        'notes',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'file_size'   => 'integer',
    ];

    protected $appends = ['file_size_human', 'is_expired', 'days_until_expiry'];

    /* ── Relationships ──────────────────────────────────────────────────── */

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /* ── Accessors ──────────────────────────────────────────────────────── */

    public function getFileSizeHumanAttribute(): string
    {
        $bytes = $this->file_size;
        if ($bytes < 1024)        return $bytes . ' B';
        if ($bytes < 1048576)     return round($bytes / 1024, 1) . ' KB';
        return round($bytes / 1048576, 1) . ' MB';
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    public function getDaysUntilExpiryAttribute(): ?int
    {
        if (!$this->expiry_date) return null;
        return max(0, (int) now()->startOfDay()->diffInDays($this->expiry_date, false));
    }

    /* ── Scopes ─────────────────────────────────────────────────────────── */

    public function scopeExpiringWithin($query, int $days = 30)
    {
        return $query->whereNotNull('expiry_date')
            ->where('expiry_date', '>=', today())
            ->where('expiry_date', '<=', today()->addDays($days));
    }

    public function scopeExpired($query)
    {
        return $query->whereNotNull('expiry_date')
            ->where('expiry_date', '<', today());
    }
}
