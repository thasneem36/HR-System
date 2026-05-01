<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action',
        'description',
        'entity_type',
        'entity_id',
        'ip_address',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Convenience helper used throughout controllers.
     * AuditLog::record($userId, 'payroll.approved', 'Description text', 'Payroll', 42);
     */
    public static function record(
        ?int   $userId,
        string $action,
        string $description,
        string $entityType = null,
        int    $entityId   = null
    ): self {
        return static::create([
            'user_id'     => $userId,
            'action'      => $action,
            'description' => $description,
            'entity_type' => $entityType,
            'entity_id'   => $entityId,
            'ip_address'  => request()?->ip(),
        ]);
    }
}
