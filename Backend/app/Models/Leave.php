<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Leave extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'Leave_ID';
    protected $fillable = [
        'EMP_ID',
        'ELP_ID',
        'ApprovedBy',
        'start_date',
        'end_date',
        'Leave_Status',
        'Reason',
        'Cover_up',
        'AttachmentForLeave'
    ];

    protected $dates = [
        'start_date',
        'end_date',
        'deleted_at'
    ];

    // Relationships
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'EMP_ID');
    }

    public function leavePlan()
    {
        return $this->belongsTo(EmployeeLeavePlan::class, 'ELP_ID');
    }

    public function approver()
    {
        return $this->belongsTo(Employee::class, 'ApprovedBy');
    }

    public function status()
    {
        return $this->belongsTo(LeaveStatus::class, 'Leave_Status');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('Leave_Status', 1); // Assuming 1 is pending
    }

    public function scopeApproved($query)
    {
        return $query->where('Leave_Status', 2); // Assuming 2 is approved
    }

    public function scopeRejected($query)
    {
        return $query->where('Leave_Status', 3); // Assuming 3 is rejected
    }

    public function scopeCurrent($query)
    {
        return $query->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }

    // Accessors & Mutators
    public function getDurationAttribute()
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }

    public function getStatusTextAttribute()
    {
        return $this->status->StatusName ?? 'Unknown';
    }

    public function getIsApprovedAttribute()
    {
        return $this->Leave_Status === 2;
    }

    public function getIsPendingAttribute()
    {
        return $this->Leave_Status === 1;
    }

    public function getIsRejectedAttribute()
    {
        return $this->Leave_Status === 3;
    }
}
