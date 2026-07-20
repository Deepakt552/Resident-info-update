<?php
// app/Http/Controllers/NotificationController.php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\ResidentSignup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Get latest notifications with eager loading
     */
    public function index(Request $request)
    {
        try {
            $notifications = Notification::orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            // Get resident signup data using join
            $formattedNotifications = $this->formatNotifications($notifications);

            return response()->json([
                'success' => true,
                'data' => $formattedNotifications,
                'has_more' => Notification::count() > 10,
            ]);
        } catch (\Exception $e) {
            Log::error('Notification index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notifications'
            ], 500);
        }
    }

    /**
     * Load more notifications with pagination
     */
    public function loadMore(Request $request)
    {
        try {
            $offset = $request->get('offset', 0);
            $limit = 10;

            $notifications = Notification::orderBy('created_at', 'desc')
                ->skip($offset)
                ->take($limit)
                ->get();

            $formattedNotifications = $this->formatNotifications($notifications);

            $total = Notification::count();
            $hasMore = ($offset + $limit) < $total;

            return response()->json([
                'success' => true,
                'data' => $formattedNotifications,
                'has_more' => $hasMore,
                'total' => $total,
            ]);
        } catch (\Exception $e) {
            Log::error('Notification load more error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load more notifications'
            ], 500);
        }
    }

    /**
     * Get unread notification count
     */
    public function count()
    {
        try {
            $count = Notification::where('read', 0)->count();

            return response()->json([
                'success' => true,
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            Log::error('Notification count error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notification count'
            ], 500);
        }
    }

    /**
     * Mark a single notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        try {
            $notification = Notification::find($id);

            if (!$notification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification not found'
                ], 404);
            }

            $notification->update([
                'read' => 1,
                'read_date' => now(),
            ]);

            $unreadCount = Notification::where('read', 0)->count();

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read',
                'unread_count' => $unreadCount,
            ]);
        } catch (\Exception $e) {
            Log::error('Mark as read error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read'
            ], 500);
        }
    }

    /**
     * Mark all unread notifications as read
     */
    public function clearAll(Request $request)
    {
        try {
            DB::transaction(function () {
                // Notification::where('read', 0)
                //     ->update([
                //         'read' => 1,
                //         'read_date' => now(),
                //     ]);
                Notification::query()->delete(); // Delete all notifications
            });

            return response()->json([
                'success' => true,
                'message' => 'All notifications cleared',
                'unread_count' => 0,
            ]);
        } catch (\Exception $e) {
            Log::error('Clear all error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear notifications'
            ], 500);
        }
    }

    /**
     * Format notifications with resident signup data
     * Using join to get data without relationship
     */
    private function formatNotifications($notifications)
    {
        if ($notifications->isEmpty()) {
            return [];
        }

        // Get all resident signup IDs
        $residentSignupIds = $notifications->pluck('resident_signups_id')->unique();

        // Fetch all resident signups with their related data using join
        $residentData = ResidentSignup::whereIn('resident_signups.id', $residentSignupIds)
            ->join('properties', 'resident_signups.property_id', '=', 'properties.id')
            ->select(
                'resident_signups.id as resident_id',
                'resident_signups.signup_uid',
                'properties.name', 
            )
            ->get()
            ->keyBy('resident_id');

        return $notifications->map(function ($notification) use ($residentData) {
            $resident = $residentData->get($notification->resident_signups_id);

            return [
                'id' => $notification->id,
                'resident_signups_id' => $notification->resident_signups_id,
                'read' => (bool) $notification->read,
                'read_date' => $notification->read_date,
                'created_at' => $notification->created_at->toISOString(),
                'formatted_time' => $notification->created_at->diffForHumans(),
                'resident' => $resident ? [
                    'uid' => $resident->signup_uid ?? 'N/A',
                    'property_name' => $resident->property_name ?? 'N/A',
                ] : [
                    'uid' => 'N/A',
                    'property_name' => 'N/A',
                ]
            ];
        });
    }
}