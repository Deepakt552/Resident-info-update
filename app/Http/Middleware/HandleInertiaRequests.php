<?php

namespace App\Http\Middleware;

use App\Models\InspectionChecklist;
use App\Models\Pdf;
use App\Models\PdfHistory;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => fn() =>
                    $request->user()
                    ? $request->user()
                    : null,
            ],

            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info'),
            ],
            'hasChecklistRecords' => function () use ($request) {

                // HelperController::ddSql(InspectionChecklist::withTrashed()->where('tenant_id', $request->user()->id)->exists());
                // dd(InspectionChecklist::withTrashed()->where('tenant_id', $request->user()->id)->exists());
                // if ($request->user() ) {
                //     return Pdf::where('tenant_id', $request->user()->id)->
                //         withTrashed()->whereIn('status', ['pending', 'approved'])
                //         ->exists();
                // }
                return false;
            },
        ]);
    }
}
