<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'date', 'description', 'is_recurring'];

    protected $casts = [
        'date'         => 'date',
        'is_recurring' => 'boolean',
    ];

    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', today())->orderBy('date');
    }
}
