<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\ResidentSignup;
use App\Models\MailLog;
use App\Models\Setting;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Basic Stats
        $totalUsers = User::count();
        $totalAdmins = User::where('role', 'admin')->count();
        $totalResidents = User::where('role', 'user')->count();
        $totalProperties = Property::count();
        $totalResidentSignups = ResidentSignup::count();

        // Mail Stats
        $mailSuccess = MailLog::where('status', 1)->count();
        $mailFailed = MailLog::where('status', 0)->count();
        $totalMails = $mailSuccess + $mailFailed;
        $successRate = $totalMails > 0 ? round(($mailSuccess / $totalMails) * 100, 2) : 0;

        // Recent Resident Signups (latest 10) - Using JOIN
        $recentSignups = ResidentSignup::join('properties', 'resident_signups.property_id', '=', 'properties.id')
            ->select(
                'resident_signups.id',
                'resident_signups.signup_uid',
                'resident_signups.unitno',
                'resident_signups.tenants',
                'resident_signups.created_at',
                'resident_signups.pdf_path',
                'properties.name as property_name'
            )
            ->orderBy('resident_signups.created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($signup) {
                return [
                    'id' => $signup->id,
                    'signup_uid' => $signup->signup_uid,
                    'property_name' => $signup->property_name ?? 'N/A',
                    'unit_no' => $signup->unitno,
                    'tenants' => $signup->tenants,
                    'created_at' => $signup->created_at->format('Y-m-d H:i:s'),
                    'pdf_path' => $signup->pdf_path,
                ];
            });

        // Latest Mail Logs (latest 10) - Using JOIN
        $latestMailLogs = MailLog::join('users', 'mail_logs.user_id', '=', 'users.id')
            ->leftJoin('properties', 'mail_logs.property_id', '=', 'properties.id')
            ->select(
                'mail_logs.id',
                'mail_logs.document',
                'mail_logs.action',
                'mail_logs.status',
                'mail_logs.sent_at',
                'mail_logs.error_message',
                'mail_logs.created_at',
                'users.name as user_name',
                'properties.name as property_name'
            )
            ->orderBy('mail_logs.created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'document' => $log->document,
                    'action' => $log->action,
                    'user_name' => $log->user_name ?? 'N/A',
                    'property_name' => $log->property_name ?? 'N/A',
                    'status' => $log->status,
                    'sent_at' => $log->sent_at ? Carbon::parse($log->sent_at)->format('Y-m-d H:i:s') : null,
                    'error_message' => $log->error_message,
                ];
            });

        // Monthly Resident Signup Data (last 12 months)
        $monthlySignups = ResidentSignup::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get()
            ->map(function ($item) {
                $date = Carbon::createFromDate($item->year, $item->month, 1);
                return [
                    'month' => $date->format('M Y'),
                    'count' => $item->count,
                ];
            });

        // Monthly Mail Data (last 12 months)
        $monthlyMails = MailLog::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as total'),
            DB::raw('SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as success'),
            DB::raw('SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END) as failed')
        )
            ->where('created_at', '>=', Carbon::now()->subMonths(12))
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get()
            ->map(function ($item) {
                $date = Carbon::createFromDate($item->year, $item->month, 1);
                return [
                    'month' => $date->format('M Y'),
                    'total' => $item->total,
                    'success' => $item->success,
                    'failed' => $item->failed,
                ];
            });

        // Property Wise Signup Count - Using JOIN and GROUP BY
        $propertySignups = Property::join('resident_signups', 'properties.id', '=', 'resident_signups.property_id')
            ->select(
                'properties.id',
                'properties.name as property_name',
                DB::raw('COUNT(resident_signups.id) as resident_signups_count')
            )
            ->groupBy('properties.id', 'properties.name')
            ->having('resident_signups_count', '>', 0)
            ->orderBy('resident_signups_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($property) {
                return [
                    'property_name' => $property->property_name,
                    'count' => $property->resident_signups_count,
                ];
            });

        // Settings
        $settings = Setting::first();
        $mailEnabled = $settings?->send_mail ?? false;
        $ccEmails = $settings?->send_user_emails ?? [];

        // Recent Activity
        $recentActivities = collect();

        // Resident Signups
        $signupActivities = ResidentSignup::latest()
            ->limit(1)
            ->get()
            ->map(function ($signup) {
                return [
                    'title' => 'New resident signup',
                    'description' => 'Unit #' . $signup->unitno,
                    'time' => $signup->created_at->diffForHumans(),
                    'icon' => 'users',
                    'color' => 'blue',
                ];
            });

        // Mail Logs
        $mailActivities = MailLog::latest()
            ->limit(1)
            ->get()
            ->map(function ($mail) {
                return [
                    'title' => $mail->status
                        ? 'Email sent successfully'
                        : 'Email failed to send',
                    'description' => $mail->document,
                    'time' => $mail->created_at->diffForHumans(),
                    'icon' => 'mail',
                    'color' => $mail->status ? 'green' : 'red',
                ];
            });

        // Latest Settings Update
        $settingActivities = Setting::latest('updated_at')
            ->limit(1)
            ->get()
            ->map(function ($setting) {
                return [
                    'title' => 'System settings updated',
                    'description' => 'Mail configuration changed',
                    'time' => $setting->updated_at->diffForHumans(),
                    'icon' => 'settings',
                    'color' => 'purple',
                ];
            });

        $recentActivities = $signupActivities
            ->merge($mailActivities)
            ->merge($settingActivities)
            ->sortByDesc(function ($item) {
                return Carbon::parse(now()->sub($item['time']));
            })
            ->take(10)
            ->values();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalAdmins' => $totalAdmins,
                'totalResidents' => $totalResidents,
                'totalProperties' => $totalProperties,
                'totalResidentSignups' => $totalResidentSignups,
                'mailSuccess' => $mailSuccess,
                'mailFailed' => $mailFailed,
                'successRate' => $successRate,
            ],
            'recentSignups' => $recentSignups,
            'latestMailLogs' => $latestMailLogs,
            'monthlySignups' => $monthlySignups,
            'monthlyMails' => $monthlyMails,
            'propertySignups' => $propertySignups,
            'settings' => [
                'mailEnabled' => $mailEnabled,
                'ccEmails' => $ccEmails,
                'recentActivities' => $recentActivities,
            ],
            'currentDate' => Carbon::now()->format('l, F j, Y'),
        ]);
    }
}