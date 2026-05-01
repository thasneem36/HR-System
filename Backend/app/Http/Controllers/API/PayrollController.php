<?php

namespace App\Http\Controllers\API;

use App\Events\HrFeedEvent;
use App\Events\NotificationSent;
use App\Events\UserFeedEvent;
use App\Http\Controllers\Controller;
use App\Mail\PayslipReadyMail;
use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\Notification;
use App\Models\Payroll;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class PayrollController extends Controller
{
    use ApiResponse;

    /* ── List payrolls ─────────────────────────────────────────────────────── */
    public function index(Request $request)
    {
        $query = Payroll::with(['employee.department', 'employee.job', 'approvedBy'])
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->orderBy('employee_id');

        if ($request->filled('month'))       $query->where('month', $request->month);
        if ($request->filled('year'))        $query->where('year',  $request->year);
        if ($request->filled('employee_id')) $query->where('employee_id', $request->employee_id);
        if ($request->filled('status'))      $query->where('status', $request->status);

        $payrolls = $query->paginate($request->get('per_page', 30));
        return $this->success($payrolls);
    }

    /* ── Employee views own payslips ────────────────────────────────────────── */
    public function myPayslips(Request $request)
    {
        $empId = $request->user()->employee_id;
        if (!$empId) return $this->error('No employee record linked to your account', 404);

        $payrolls = Payroll::with(['employee', 'approvedBy'])
            ->where('employee_id', $empId)
            ->whereIn('status', ['approved', 'paid'])
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        return $this->success($payrolls);
    }

    /* ── Single payroll ─────────────────────────────────────────────────────── */
    public function show(Request $request, Payroll $payroll)
    {
        // SEC-09: use injected $request instead of the request() global helper
        $authUser = $request->user();

        // Employees can only view their own approved/paid payslips
        if ($authUser->role === 'employee') {
            if ($authUser->employee_id !== $payroll->employee_id) {
                return $this->error('Forbidden', 403);
            }
            if (!in_array($payroll->status, ['approved', 'paid'])) {
                return $this->error('Payslip not yet available', 403);
            }
        }

        return $this->success($payroll->load(['employee.department', 'employee.job', 'approvedBy']));
    }

    /* ── Create one payroll ─────────────────────────────────────────────────── */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id'  => 'required|exists:employees,id',
            'month'        => 'required|integer|min:1|max:12',
            'year'         => 'required|integer|min:2020|max:2100',
            'basic_salary' => 'required|numeric|min:0',
            'allowances'   => 'nullable|array',
            'allowances.*.name'   => 'required|string|max:100',
            'allowances.*.amount' => 'required|numeric|min:0',
            'deductions'   => 'nullable|array',
            'deductions.*.name'   => 'required|string|max:100',
            'deductions.*.amount' => 'required|numeric|min:0',
            'notes'        => 'nullable|string|max:1000',
        ]);

        // Prevent duplicate
        $exists = Payroll::where('employee_id', $validated['employee_id'])
            ->where('month', $validated['month'])
            ->where('year',  $validated['year'])
            ->exists();

        if ($exists) {
            return $this->error('Payroll already exists for this employee and period', 422);
        }

        $payroll = new Payroll($validated);
        $payroll->recalculate();
        $payroll->save();

        try {
            broadcast(new HrFeedEvent('payroll.updated', ['payroll_id' => $payroll->id, 'status' => 'draft']));
        } catch (\Throwable) {}

        return $this->created(
            $payroll->load(['employee.department', 'employee.job']),
            'Payroll created'
        );
    }

    /* ── Update payroll ─────────────────────────────────────────────────────── */
    public function update(Request $request, Payroll $payroll)
    {
        if ($payroll->status === 'paid') {
            return $this->error('Paid payrolls cannot be edited', 422);
        }

        $validated = $request->validate([
            'basic_salary' => 'sometimes|numeric|min:0',
            'allowances'   => 'nullable|array',
            'allowances.*.name'   => 'required|string|max:100',
            'allowances.*.amount' => 'required|numeric|min:0',
            'deductions'   => 'nullable|array',
            'deductions.*.name'   => 'required|string|max:100',
            'deductions.*.amount' => 'required|numeric|min:0',
            'notes'        => 'nullable|string|max:1000',
            'status'       => 'sometimes|in:draft,approved,paid',
        ]);

        $payroll->fill($validated);
        $payroll->recalculate();
        $payroll->save();

        return $this->success(
            $payroll->load(['employee.department', 'employee.job', 'approvedBy']),
            'Payroll updated'
        );
    }

    /* ── Approve ────────────────────────────────────────────────────────────── */
    public function approve(Request $request, Payroll $payroll)
    {
        if ($payroll->status !== 'draft') {
            return $this->error('Only draft payrolls can be approved', 422);
        }

        $payroll->update([
            'status'      => 'approved',
            'approved_by' => $request->user()->id,
        ]);

        AuditLog::record(
            $request->user()->id, 'payroll.approved',
            "Approved payroll for {$payroll->employee->full_name} — {$payroll->month_name} {$payroll->year}",
            'Payroll', $payroll->id
        );

        // Notify the employee instantly via WebSocket + email
        try {
            $employeeUser = User::where('employee_id', $payroll->employee_id)->first();
            if ($employeeUser) {
                $notif = Notification::create([
                    'user_id' => $employeeUser->id,
                    'title'   => '💰 Payslip Ready',
                    'message' => "Your payslip for {$payroll->month_name} {$payroll->year} is ready. Net salary: LKR " . number_format($payroll->net_salary, 2),
                    'type'    => 'success',
                ]);
                broadcast(new NotificationSent($notif));
                broadcast(new UserFeedEvent($employeeUser->id, 'payroll.approved', [
                    'payroll_id' => $payroll->id,
                    'month'      => $payroll->month,
                    'year'       => $payroll->year,
                    'net_salary' => $payroll->net_salary,
                ]));
            }
            // Notify HR feed so HR payroll list updates live for other HR users
            broadcast(new HrFeedEvent('payroll.updated', ['payroll_id' => $payroll->id, 'status' => 'approved']));
        } catch (\Throwable) {}

        try {
            Mail::to($payroll->employee->email)
                ->send(new PayslipReadyMail($payroll));
        } catch (\Throwable) {}

        return $this->success(
            $payroll->load(['employee', 'approvedBy']),
            'Payroll approved'
        );
    }

    /* ── Mark as Paid ───────────────────────────────────────────────────────── */
    public function markPaid(Request $request, Payroll $payroll)
    {
        if ($payroll->status !== 'approved') {
            return $this->error('Only approved payrolls can be marked as paid', 422);
        }

        $payroll->update([
            'status'  => 'paid',
            'paid_at' => now(),
        ]);

        AuditLog::record(
            $request->user()->id, 'payroll.paid',
            "Marked payroll as paid for {$payroll->employee->full_name} — {$payroll->month_name} {$payroll->year} (LKR {$payroll->net_salary})",
            'Payroll', $payroll->id
        );

        try {
            $employeeUser = User::where('employee_id', $payroll->employee_id)->first();
            if ($employeeUser) {
                $notif = Notification::create([
                    'user_id' => $employeeUser->id,
                    'title'   => '✅ Salary Paid',
                    'message' => "Your salary for {$payroll->month_name} {$payroll->year} has been paid. LKR " . number_format($payroll->net_salary, 2),
                    'type'    => 'success',
                ]);
                broadcast(new NotificationSent($notif));
                broadcast(new UserFeedEvent($employeeUser->id, 'payroll.paid', ['payroll_id' => $payroll->id]));
            }
            broadcast(new HrFeedEvent('payroll.updated', ['payroll_id' => $payroll->id, 'status' => 'paid']));
        } catch (\Throwable) {}

        return $this->success(
            $payroll->load(['employee', 'approvedBy']),
            'Payroll marked as paid'
        );
    }

    /* ── Delete draft ───────────────────────────────────────────────────────── */
    public function destroy(Payroll $payroll)
    {
        if ($payroll->status !== 'draft') {
            return $this->error('Only draft payrolls can be deleted', 422);
        }

        $payroll->delete();
        return $this->success(null, 'Payroll deleted');
    }

    /* ── Bulk generate for a month ──────────────────────────────────────────── */
    public function generate(Request $request)
    {
        $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year'  => 'required|integer|min:2020|max:2100',
        ]);

        $month = (int) $request->month;
        $year  = (int) $request->year;

        $employees = Employee::where('status', 'active')
            ->whereNotNull('salary')
            ->where('salary', '>', 0)
            ->get();

        $created  = 0;
        $skipped  = 0;

        foreach ($employees as $emp) {
            $exists = Payroll::where('employee_id', $emp->id)
                ->where('month', $month)
                ->where('year', $year)
                ->exists();

            if ($exists) { $skipped++; continue; }

            $payroll = new Payroll([
                'employee_id'  => $emp->id,
                'month'        => $month,
                'year'         => $year,
                'basic_salary' => $emp->salary,
                'allowances'   => [],
                'deductions'   => [],
                'notes'        => null,
            ]);
            $payroll->recalculate();
            $payroll->save();
            $created++;
        }

        AuditLog::record(
            $request->user()->id, 'payroll.generated',
            "Bulk generated payroll for {$month}/{$year}: {$created} created, {$skipped} skipped"
        );

        return $this->success(
            compact('created', 'skipped'),
            "Generated {$created} payrolls, skipped {$skipped} (already exist)"
        );
    }

    /* ── Summary stats for a month ──────────────────────────────────────────── */
    public function summary(Request $request)
    {
        $month = (int) $request->get('month', now()->month);
        $year  = (int) $request->get('year',  now()->year);

        $payrolls = Payroll::where('month', $month)->where('year', $year)->get();

        return $this->success([
            'month'          => $month,
            'year'           => $year,
            'total'          => $payrolls->count(),
            'draft'          => $payrolls->where('status', 'draft')->count(),
            'approved'       => $payrolls->where('status', 'approved')->count(),
            'paid'           => $payrolls->where('status', 'paid')->count(),
            'total_gross'    => $payrolls->sum('gross_salary'),
            'total_net'      => $payrolls->sum('net_salary'),
            'total_payable'  => $payrolls->whereIn('status', ['approved', 'paid'])->sum('net_salary'),
        ]);
    }
}
