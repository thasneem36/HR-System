<?php

namespace App\Http\Controllers\API;

use App\Events\HrFeedEvent;
use App\Events\UserFeedEvent;
use App\Http\Controllers\Controller;
use App\Mail\DocumentExpiryMail;
use App\Models\AuditLog;
use App\Models\Employee;
use App\Models\EmployeeDocument;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    use ApiResponse;

    /** List documents for a given employee. */
    public function index(Request $request, Employee $employee)
    {
        $user = $request->user();

        // Employees may only view their own documents
        if ($user->role === 'employee' && $user->employee_id !== $employee->id) {
            return $this->error('Forbidden', 403);
        }

        $query = $employee->documents()->with('uploadedBy');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('expiry_status')) {
            match ($request->expiry_status) {
                'expired'         => $query->expired(),
                'expiring_soon'   => $query->expiringWithin(30),
                default           => null,
            };
        }

        return $this->success($query->orderByDesc('created_at')->get());
    }

    /** Upload a new document for an employee. */
    public function store(Request $request, Employee $employee)
    {
        $user = $request->user();

        // Employees may only upload to their own record
        if ($user->role === 'employee' && $user->employee_id !== $employee->id) {
            return $this->error('Forbidden', 403);
        }

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'category'    => 'required|in:contract,id_document,certificate,medical,other',
            'file'        => 'required|file|max:10240|mimes:pdf,jpg,jpeg,png,doc,docx,xls,xlsx',
            'expiry_date' => 'nullable|date|after_or_equal:today',
            'notes'       => 'nullable|string|max:1000',
        ]);

        $file      = $request->file('file');
        $path      = $file->store("documents/employee-{$employee->id}", 'private');

        $document = EmployeeDocument::create([
            'employee_id'  => $employee->id,
            'uploaded_by'  => $user->id,
            'title'        => $validated['title'],
            'category'     => $validated['category'],
            'file_name'    => $file->getClientOriginalName(),
            'file_path'    => $path,
            'file_size'    => $file->getSize(),
            'mime_type'    => $file->getMimeType(),
            'expiry_date'  => $validated['expiry_date'] ?? null,
            'notes'        => $validated['notes'] ?? null,
        ]);

        AuditLog::record(
            $user->id, 'document.uploaded',
            "Uploaded document '{$document->title}' for {$employee->full_name}",
            'EmployeeDocument', $document->id
        );

        try {
            broadcast(new HrFeedEvent('document.updated', [
                'action'      => 'uploaded',
                'employee_id' => $employee->id,
                'title'       => $document->title,
            ]));
            $empUser = User::where('employee_id', $employee->id)->first();
            if ($empUser) {
                broadcast(new UserFeedEvent($empUser->id, 'document.updated', [
                    'action' => 'uploaded',
                    'title'  => $document->title,
                ]));
            }
        } catch (\Throwable) {}

        return $this->created(
            $document->load('uploadedBy'),
            'Document uploaded successfully'
        );
    }

    /** Stream / download a document file. */
    public function download(Request $request, EmployeeDocument $document)
    {
        $user = $request->user();

        // Employees may only download their own documents
        if ($user->role === 'employee' && $user->employee_id !== $document->employee_id) {
            return $this->error('Forbidden', 403);
        }

        if (!Storage::disk('private')->exists($document->file_path)) {
            return $this->error('File not found on storage', 404);
        }

        return Storage::disk('private')->download(
            $document->file_path,
            $document->file_name,
            ['Content-Type' => $document->mime_type]
        );
    }

    /** Update document metadata (title, category, expiry_date, notes). */
    public function update(Request $request, EmployeeDocument $document)
    {
        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'category'    => 'sometimes|in:contract,id_document,certificate,medical,other',
            'expiry_date' => 'nullable|date',
            'notes'       => 'nullable|string|max:1000',
        ]);

        $document->update($validated);

        return $this->success($document->load('uploadedBy'), 'Document updated');
    }

    /** Delete a document and its file. */
    public function destroy(Request $request, EmployeeDocument $document)
    {
        $user = $request->user();

        // Employees cannot delete their own documents (HR must do it)
        if ($user->role === 'employee') {
            return $this->error('Forbidden', 403);
        }

        Storage::disk('private')->delete($document->file_path);

        AuditLog::record(
            $user->id, 'document.deleted',
            "Deleted document '{$document->title}' for employee ID {$document->employee_id}",
            'EmployeeDocument', $document->id
        );

        $document->delete();
        return $this->success(null, 'Document deleted');
    }

    /**
     * Send expiry-alert emails for documents expiring within the next N days.
     * Called manually by HR or via a scheduled command.
     */
    public function sendExpiryAlerts(Request $request)
    {
        $days = (int) $request->get('days', 30);

        $expiring = EmployeeDocument::expiringWithin($days)
            ->with(['employee.user'])
            ->get()
            ->groupBy('employee_id');

        $sent = 0;

        foreach ($expiring as $employeeId => $docs) {
            $employee = $docs->first()->employee;
            if (!$employee?->email) continue;

            $payload = $docs->map(fn($d) => [
                'title'       => $d->title,
                'category'    => $d->category,
                'expiry_date' => $d->expiry_date->format('d M Y'),
                'days_left'   => $d->days_until_expiry,
            ])->toArray();

            try {
                Mail::to($employee->email)
                    ->send(new DocumentExpiryMail($employee->full_name, $payload));
                $sent++;
            } catch (\Throwable) {}
        }

        return $this->success(['emails_sent' => $sent], "Expiry alerts sent to {$sent} employee(s)");
    }
}
