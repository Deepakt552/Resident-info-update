<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Property;
use App\Models\Pdf;
use App\Models\ChecklistItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller 
{
    public function index()
    {
        // Basic Stats
        $totalUsers = User::count();
        $totalProperties = Property::count();
        $totalInspections = Pdf::count();
        $totalChecklistItems = ChecklistItem::count();

        // Inspection Status Stats
        $statusStats = [
            'pending' => Pdf::withTrashed()->where('status', 'pending')->count(),
            'approved' => Pdf::withTrashed()->where('status', 'approved')->count(),
            'rejected' => Pdf::withTrashed()->where('status', 'rejected')->count(),
            'completed' => Pdf::withTrashed()->where('status', 'approved')->count(),
        ];

        // Completion Rate
        $completedCount = $statusStats['completed'];
        $completionRate = $totalInspections > 0 
            ? round(($completedCount / $totalInspections) * 100, 1) 
            : 0;

        // Inspection Type Stats
        $typeStats = [
            'moveIn' => Pdf::where('checklist_value', '0')->count(),
            'moveOut' => Pdf::where('checklist_value', '1')->count(),
            'unitInspection' => Pdf::where('checklist_value', '2')->count(),
        ];

        // Monthly Analytics (Last 12 months)
        $monthlyInspections = Pdf::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', now()->subMonths(12))
        ->groupBy('month')
        ->orderBy('month', 'asc')
        ->get()
        ->map(function ($item) {
            return [
                'month' => date('M Y', strtotime($item->month . '-01')),
                'count' => $item->count,
            ];
        });

        // Fill missing months
        $months = collect();
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthKey = $date->format('M Y');
            $existingMonth = $monthlyInspections->firstWhere('month', $monthKey);
            
            $months->push([
                'month' => $monthKey,
                'count' => $existingMonth ? $existingMonth['count'] : 0,
            ]);
        }

        // Recent Activities
        $recentActivities = Pdf::with(['tenant', 'property'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($pdf) {
                return [
                    'id' => $pdf->id,
                    'tenant_name' => $pdf->tenant->name ?? 'N/A',
                    'property_name' => $pdf->property->name ?? 'N/A',
                    'status' => $pdf->status,
                    'inspection_type' => $this->getInspectionType($pdf->checklist_value),
                    'created_at' => $pdf->created_at->diffForHumans(),
                    'created_at_raw' => $pdf->created_at,
                ];
            });

        // Top Properties
        $topProperties = Property::withCount('pdfs')
            ->having('pdfs_count', '>', 0)
            ->orderBy('pdfs_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($property) {
                $totalInspections = $property->pdfs_count;
                $completedInspections = $property->pdfs()
                    ->where('status', 'completed')
                    ->count();
                
                return [
                    'id' => $property->id,
                    'name' => $property->name,
                    'address' => $property->address,
                    'total_inspections' => $totalInspections,
                    'completion_rate' => $totalInspections > 0 
                        ? round(($completedInspections / $totalInspections) * 100, 1)
                        : 0,
                ];
            });

        // Quick Insights
        $mostCommonType = collect($typeStats)->sortDesc()->keys()->first();
        $mostCommonTypeLabel = $this->getInspectionType(
            $mostCommonType === 'moveIn' ? '0' : ($mostCommonType === 'moveOut' ? '1' : '2')
        );

        $bestProperty = $topProperties->first();
        $approvalRatio = $totalInspections > 0 
            ? round(($statusStats['approved'] / $totalInspections) * 100, 1)
            : 0;
        
        $completionRatio = $completionRate;

        $insights = [
            'most_common_inspection_type' => $mostCommonTypeLabel,
            'best_performing_property' => $bestProperty ? $bestProperty['name'] : 'N/A',
            'approval_ratio' => $approvalRatio,
            'completion_ratio' => $completionRatio,
        ];

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalProperties' => $totalProperties,
                'totalInspections' => $totalInspections,
                'totalChecklistItems' => $totalChecklistItems,
                'completionRate' => $completionRate,
            ],
            'statusStats' => $statusStats,
            'typeStats' => $typeStats,
            'monthlyInspections' => $months,
            'recentActivities' => $recentActivities,
            'topProperties' => $topProperties,
            'insights' => $insights,
        ]);
    }

    private function getInspectionType($value)
    {
        return match($value) {
            '0' => 'Move In',
            '1' => 'Move Out',
            '2' => 'Unit Inspection',
            default => 'Unknown',
        };
    }
}