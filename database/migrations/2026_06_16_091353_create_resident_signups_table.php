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
        Schema::create('resident_signups', function (Blueprint $table) {
            $table->id();

            // Property reference
            $table->unsignedBigInteger('property_id');

            // Optional unique signup id
            $table->string('signup_uid')->unique();
            $table->string('unitno');

            // Tenant data stored as JSON (4 tenants)
            $table->json('tenants');

            $table->timestamps();
            $table->string('pdf_path')->nullable();

            // If you have properties table
            $table->foreign('property_id')
                  ->references('id')
                  ->on('properties')
                  ->onDelete('cascade');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resident_signups');
    }
};
