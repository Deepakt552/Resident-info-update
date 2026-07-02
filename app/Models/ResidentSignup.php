<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResidentSignup extends Model
{
    protected $guarded = [];

    protected $casts = [
        'tenants' => 'array',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class, 'property_id');
    }
}