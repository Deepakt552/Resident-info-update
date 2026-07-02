<?php
// app/Http/Controllers/MailSettingController.php

namespace App\Http\Controllers;

use App\Models\MailLog;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class MailSettingController extends Controller
{
    public function index()
    {
        $setting = Setting::first();

        if (!$setting) {
            $setting = Setting::create([
                'send_mail' => 0,
                'send_user_emails' => []
            ]);
        }

        $users = User::select('id', 'name', 'email')->get();

        $mailLogs = MailLog::join('properties', 'mail_logs.property_id', '=', 'properties.id')
            ->select(
                'mail_logs.*',
                'properties.*'
            )
            ->orderBy('mail_logs.created_at', 'desc')
            ->paginate(15);
        // dd($mailLogs);
        return Inertia::render('Settings/MailSettings', [
            'setting' => $setting,
            'users' => $users,
            'mailLogs' => $mailLogs
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'send_mail' => 'required|boolean',
            'send_user_emails' => 'nullable|array',
            'send_user_emails.*' => 'email'
        ]);

        $setting = Setting::first();

        if (!$setting) {
            $setting = Setting::create([
                'send_mail' => 0,
                'send_user_emails' => []
            ]);
        }

        $setting->update([
            'send_mail' => $validated['send_mail'],
            'send_user_emails' => $validated['send_user_emails'] ?? []
        ]);

        return redirect()->back()->with('success', 'Mail settings updated successfully!');
    }
}