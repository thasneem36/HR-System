<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'Attendance_ID';

    protected $fillable = [
        'EMP_ID',
        'Attend_Date',
        'Process_Time',
        'check_in',
        'check_out',
        'Holiday_ID'
    ];

    protected $dates = [
        'Attend_Date',
        'Process_Time',
        'check_in',
        'check_out',
        'deleted_at'
    ];

    // Relationships
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'EMP_ID');
    }

    public function holiday(): BelongsTo
    {
        return $this->belongsTo(Holiday::class, 'Holiday_ID');
    }

    // Scopes
    public function scopeToday($query)
    {
        return $query->whereDate('Attend_Date', now());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('Attend_Date', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereBetween('Attend_Date', [now()->startOfMonth(), now()->endOfMonth()]);
    }

    // Accessors & Mutators
    public function getWorkingHoursAttribute(): float
    {
        if ($this->check_in && $this->check_out) {
            return $this->check_out->diffInHours($this->check_in);
        }
        return 0;
    }

    public function getStatusAttribute(): string
    {
        if ($this->holiday) {
            return 'holiday';
        }
        if ($this->check_in && $this->check_out) {
            return 'present';
        }
        if ($this->check_in) {
            return 'half-day';
        }
        return 'absent';
    }

    public function getIsLateAttribute(): bool
    {
        if (!$this->check_in) {
            return false;
        }

        // Assuming work starts at 9:00 AM
        $startTime = $this->Attend_Date->setTimeFromTimeString('09:00:00');
        return $this->check_in->isAfter($startTime);
    }

    public function getIsEarlyLeaveAttribute(): bool
    {
        if (!$this->check_out) {
            return false;
        }

        // Assuming work ends at 5:00 PM
        $endTime = $this->Attend_Date->setTimeFromTimeString('17:00:00');
        return $this->check_out->isBefore($endTime);
    }
}
