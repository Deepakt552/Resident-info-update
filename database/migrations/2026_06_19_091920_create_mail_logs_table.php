<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mail_logs', function (Blueprint $table) {
            $table->id();

            $table->string('document');

            $table->string('action')->comment('like mail sent , pdf created etc');

            // User / Tenant
            $table->foreignId('user_id')
                ->nullable()
                ->constrained();

            // Property
            $table->foreignId('property_id')
                ->nullable()
                ->constrained();
                
            $table->tinyInteger('status')
                ->default(1)
                ->comment('0 = Failed, 1 = Success');

            $table->timestamp('sent_at')->nullable();

            $table->text('error_message')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mail_logs');
    }
};
