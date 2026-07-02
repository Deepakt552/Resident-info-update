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
          Schema::create('settings', function (Blueprint $table) {

            $table->id();

            $table->tinyInteger('send_mail')
                ->default(0)
                ->comment('0 = Off, 1 = On');

            $table->json('send_user_emails')
                ->nullable()
                ->comment('cc mails');

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
