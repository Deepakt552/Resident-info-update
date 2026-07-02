<?php
// database/seeders/SettingSeeder.php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        if (!Setting::exists()) {
            Setting::create([
                'send_mail' => 1,
                'send_user_emails' => []
            ]);
        }
    }
}