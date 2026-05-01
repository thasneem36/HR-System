<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payroll extends Model
{
    protected $fillable = [
        'employee_id',
        'month',
        'year',
        'basic_salary',
        'allowances',
        'deductions',
        'gross_salary',
        'net_salary',
        'status',
        'notes',
        'approved_by',
        'paid_at',
    ];

    protected $casts = [
        'allowances'   => 'array',
        'deductions'   => 'array',
        'basic_salary' => 'decimal:2',
        'gross_salary' => 'decimal:2',
        'net_salary'   => 'decimal:2',
        'month'        => 'integer',
        'year'         => 'integer',
        'paid_at'      => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Recalculate and store gross_salary and net_salary from current fields.
     * Call this before saving whenever basic_salary / allowances / deductions change.
     */
    public function recalculate(): void
    {
        $allowanceTotal = collect($this->allowances ?? [])->sum('amount');
        $deductionTotal = collect($this->deductions ?? [])->sum('amount');

        $this->gross_salary = (float) $this->basic_salary + $allowanceTotal;
        $this->net_salary   = $this->gross_salary - $deductionTotal;
    }

    // ── Month name helper ────────────────────────────────────────────────────
    // Not in $appends — call ->month_name only when you need it (audit log messages),
    // not on every row in a paginated list.

    public function getMonthNameAttribute(): string
    {
        static $names = [
            1 => 'January', 2 => 'February', 3 => 'March',    4 => 'April',
            5 => 'May',      6 => 'June',     7 => 'July',     8 => 'August',
            9 => 'September',10 => 'October', 11 => 'November',12 => 'December',
        ];
        return $names[$this->month] ?? 'Unknown';
    }
}
