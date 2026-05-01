<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeLeavePlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_type_id',
        'leave_type_id',
        'leave_quota',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function employeeType()
    {
        return $this->belongsTo(EmployeeType::class);
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }
}
