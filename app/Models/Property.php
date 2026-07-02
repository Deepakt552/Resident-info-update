<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;
   
    protected $guarded = [];

    
    public function residentSignups(): HasMany
    {
        return $this->hasMany(ResidentSignup::class, 'property_id');
    }
}