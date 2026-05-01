<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Leave extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'leave_status_id',
        'approved_by',
        'start_date',
        'end_date',
        'reason',
        'rejection_reason',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    protected $appends = ['total_days'];

    public function getTotalDaysAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function leaveStatus()
    {
        return $this->belongsTo(LeaveStatus::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }

    public function scopePending($query)
    {
        return $query->whereHas('leaveStatus', fn($q) => $q->where('name', 'Pending'));
    }

    public function scopeApproved($query)
    {
        return $query->whereHas('leaveStatus', fn($q) => $q->where('name', 'Approved'));
    }

    public function scopeRejected($query)
    {
        return $query->whereHas('leaveStatus', fn($q) => $q->where('name', 'Rejected'));
    }
}
