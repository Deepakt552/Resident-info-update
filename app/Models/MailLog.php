<?php
// app/Models/MailLog.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MailLog extends Model
{ 
    protected $guarded = [];

    protected $casts = [
        'sent_at' => 'datetime',
        'status' => 'integer'
    ];


}