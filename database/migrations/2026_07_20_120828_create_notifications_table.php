<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            $table->string('resident_signups_id');

            $table->tinyInteger('read')
                ->default(0)
                ->comment('0 = Not Read, 1 = Read');

            $table->timestamp('read_date')
                ->nullable()
                ->comment('Stores the date and time when the notification was read');

            $table->timestamps();
            $table->index(['resident_signups_id', 'read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};