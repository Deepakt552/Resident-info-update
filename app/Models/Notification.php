<?php
// app/Models/Notification.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $guarded = [];

    // Using join instead of relationship as requested
    public function getResidentSignupAttribute()
    {
        return ResidentSignup::where('id', $this->resident_signups_id)->first();
    }

    // Helper method to get formatted data
    public function getFormattedData()
    {
        $residentSignup = ResidentSignup::where('id', $this->resident_signups_id)
            ->with(['property', 'unit'])
            ->first();

        if (!$residentSignup) {
            return null;
        }

        return [
            'id' => $this->id,
            'resident_signups_id' => $this->resident_signups_id,
            'read' => (bool) $this->read,
            'read_date' => $this->read_date,
            'created_at' => $this->created_at,
            'formatted_time' => $this->created_at->diffForHumans(),
            'resident' => [
                'uid' => $residentSignup->uid ?? 'N/A',
                'unit_number' => $residentSignup->unit->unit_number ?? 'N/A',
                'property_name' => $residentSignup->property->property_name ?? 'N/A',
            ]
        ];
    }
}