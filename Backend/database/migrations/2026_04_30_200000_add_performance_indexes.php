<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Add an index only if it doesn't already exist. */
    private function addIndex(string $table, array|string $columns, string $name): void
    {
        $exists = collect(Schema::getIndexes($table))
            ->contains(fn($idx) => $idx['name'] === $name);

        if ($exists) return;

        Schema::table($table, function (Blueprint $t) use ($columns, $name) {
            is_array($columns)
                ? $t->index($columns, $name)
                : $t->index($columns, $name);
        });
    }

    public function up(): void
    {
        // ── attendances ──────────────────────────────────────────────────────
        $this->addIndex('attendances', ['employee_id', 'date'], 'att_emp_date');
        $this->addIndex('attendances', 'date',                  'att_date');
        $this->addIndex('attendances', 'status',                'att_status');

        // ── leaves ───────────────────────────────────────────────────────────
        $this->addIndex('leaves', ['start_date', 'end_date'], 'leave_dates');
        $this->addIndex('leaves', 'employee_id',              'leave_emp');
        $this->addIndex('leaves', 'leave_status_id',          'leave_status');
        $this->addIndex('leaves', 'deleted_at',               'leave_deleted');

        // ── employees ────────────────────────────────────────────────────────
        $this->addIndex('employees', 'status',        'emp_status');
        $this->addIndex('employees', 'department_id', 'emp_dept');
        $this->addIndex('employees', 'deleted_at',    'emp_deleted');

        // ── leave_balances ────────────────────────────────────────────────────
        $this->addIndex('leave_balances', ['employee_id', 'leave_type_id', 'year'], 'lb_emp_type_year');
        $this->addIndex('leave_balances', 'year', 'lb_year');

        // ── audit_logs ────────────────────────────────────────────────────────
        $this->addIndex('audit_logs', 'created_at', 'audit_created');

        // notifications: (user_id, read_at) index already exists from original migration
    }

    public function down(): void
    {
        $drops = [
            'attendances'    => ['att_emp_date', 'att_date', 'att_status'],
            'leaves'         => ['leave_dates', 'leave_emp', 'leave_status', 'leave_deleted'],
            'employees'      => ['emp_status', 'emp_dept', 'emp_deleted'],
            'leave_balances' => ['lb_emp_type_year', 'lb_year'],
            'audit_logs'     => ['audit_created'],
        ];

        foreach ($drops as $table => $indexes) {
            $existing = collect(Schema::getIndexes($table))->pluck('name');
            Schema::table($table, function (Blueprint $t) use ($indexes, $existing) {
                foreach ($indexes as $name) {
                    if ($existing->contains($name)) $t->dropIndex($name);
                }
            });
        }
    }
};
