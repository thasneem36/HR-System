<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'nic',
        'date_of_birth',
        'hire_date',
        'department_id',
        'job_id',
        'employee_type_id',
        'role_id',
        'report_manager_id',
        'salary',
        'status',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'hire_date'     => 'date',
        'salary'        => 'decimal:2',
    ];

    protected $appends = ['full_name'];

    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function employeeType()
    {
        return $this->belongsTo(EmployeeType::class);
    }

    public function role()
    {
        return $this->belongsTo(UserRole::class, 'role_id');
    }

    public function reportManager()
    {
        return $this->belongsTo(Employee::class, 'report_manager_id');
    }

    public function subordinates()
    {
        return $this->hasMany(Employee::class, 'report_manager_id');
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }

    public function contacts()
    {
        return $this->hasMany(EmployeeContact::class);
    }

    public function histories()
    {
        return $this->hasMany(EmployeeHistory::class);
    }

    public function leaves()
    {
        return $this->hasMany(Leave::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveBalances()
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
