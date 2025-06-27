<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Employee extends Model
{
    use HasFactory, SoftDeletes;

    protected $primaryKey = 'EMP_ID';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'department_id',
        'job_id',
        'hire_date',
        'salary',
        'NIC',
        'DOB',
        'StartDate',
        'EmployeeType_ID',
        'Role_ID',
        'ReportManager',
        'Status',
        'Address',
        'EmergencyContact',
        'EmergencyPhone',
        'nic',
        'status'
    ];

    protected $dates = ['DOB', 'StartDate', 'deleted_at'];

    protected $casts = [
        'DOB' => 'date',
        'StartDate' => 'date',
        'Status' => 'string',
        'hire_date' => 'date',
        'salary' => 'decimal:2',
    ];

    protected $enumCasts = [
        'Status' => [
            'active',
            'inactive',
            'on_leave',
            'terminated'
        ]
    ];

    // Relationships
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    public function employeeType(): BelongsTo
    {
        return $this->belongsTo(EmployeeType::class, 'EmployeeType_ID');
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(UserRole::class, 'Role_ID');
    }

    public function reportManager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'ReportManager');
    }

    public function subordinates(): HasMany
    {
        return $this->hasMany(Employee::class, 'ReportManager');
    }

    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class, 'EMP_ID');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'EMP_ID');
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'email', 'email');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(EmployeeContact::class, 'EMP_ID');
    }

    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class, 'EMP_ID');
    }

    public function history(): HasMany
    {
        return $this->hasMany(EmployeeHistory::class, 'EMP_ID');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('Status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('Status', 'inactive');
    }

    // Accessors & Mutators
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getAgeAttribute(): int
    {
        return $this->DOB->age;
    }

    public function getTenureAttribute(): int
    {
        return $this->StartDate->diffInYears(now());
    }
}

