<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\HelperController;
use App\Models\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class AutoDeleteImages extends Command
{
    protected $signature = 'pdf:autodelete-images';
    protected $description = 'Auto delete pdf images when deleted_at time is passed';

    public function handle()
    {
        $now = Carbon::now();
        $now = Carbon::now()->addHours(0)->addMinutes(3)->addSeconds(0)->addDays(0);

        $query = Pdf::withTrashed()
            ->whereNotNull('deleted_at')
            ->where('deleted_at', '<=', $now)
            ->whereRaw("is_deleted = '0'");

        // $this->info("SQL: " . HelperController::getExactSql($query));
        $records = $query->get();

        foreach ($records as $pdf) {

            $this->info("Deleting PDF ID: " . $pdf->id);
            $draftData = $pdf->draft_data;

            if (!empty($draftData['checklists'])) {

                foreach ($draftData['checklists'] as $index => $checklist) {

                    // 1. Delete images
                    if (!empty($checklist['images'])) {

                        foreach ($checklist['images'] as $imagePath) {

                            $path = str_replace('/storage/', '', $imagePath);

                            if (Storage::disk('public')->exists($path)) {
                                Storage::disk('public')->delete($path);
                                $this->info("Deleted image: " . $path);
                            }
                        }
                    }

                    // 2. Remove checklist row itself
                    unset($draftData['checklists'][$index]);
                }

                // reindex array (important)
                $draftData['checklists'] = array_values($draftData['checklists']);
            }

            // save updated draft_data (WITHOUT images + WITHOUT checklist rows)
            $pdf->update([
                'draft_data' => $draftData,
                'is_deleted' => '1',
            ]);
        }

        $this->info('Auto delete job completed at ' . $now);
    }
}