<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Inspection Report - {{ $property['name'] ?? 'N/A' }}</title>

    <style>
        @page {
            margin: 20mm;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            color: #222;
            margin: 0;
            padding: 0;
        }

        /* =======================================
           PAGE 1
        ======================================= */

        .page-break {
            page-break-after: always;
        }

        .report-header {
            text-align: center;
            border-bottom: 3px solid #2c3e66;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }

        .report-title {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e66;
            margin: 0;
        }

        .report-subtitle {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }

        .info-card {
            background: #f8f9fc;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
        }

        .info-row {
            padding: 10px 0;
            border-bottom: 1px solid #ececec;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            font-weight: bold;
            width: 180px;
            display: inline-block;
        }

        .comment-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e66;
            margin-bottom: 10px;
        }

        .comment-box {
            background: #fff8e8;
            border-left: 5px solid #d89d15;
            padding: 15px;
            line-height: 1.6;
        }

        /* =======================================
           CHECKLIST PAGE
        ======================================= */

        .checklist-page {
            page-break-after: always;
        }

        .section-title {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e66;
            border-bottom: 3px solid #2c3e66;
            padding-bottom: 10px;
            margin-bottom: 25px;
        }

        .checklist-item {
            font-size: 15px;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
        }

        /* =======================================
           IMAGE PAGE
        ======================================= */

        .image-page {
            page-break-after: always;
            position: relative;
            padding-top: 10px;
        }

        .image-wrapper {
            position: relative;
            /* display: inline-block; */
            width: 100%;
        }

        .inspection-image {
            position: absolute;
            display: block;
            width: 100%;
            height: auto;
            margin-top: 8px;
        }

        .image-time {
            position: absolute;
            /* bottom: 10px; */
            right: 10px;
            color: #f0f0f0;
            font-size: 12px;
            font-weight: bold;
            background-color: rgba(0, 0, 0, 0.8);
            padding: 5px;
            z-index: 10;
        }

        .image-label {
            position: absolute;
            left: -15px;
            top: 5px;
            color: #f0f0f0;
            font-size: 12px;
            font-weight: bold;
            background-color: rgba(0, 0, 0, 0.8);
            padding: 5px;
        }

        .image-label-heightWidth {
            position: absolute;
            left: -15px;
            top: 35px;
            color: #f0f0f0;
            font-size: 12px;
            font-weight: bold;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 5px;
        }

        .no-image {
            text-align: center;
            padding: 150px 20px;
            color: #999;
        }
    </style>
</head>

<body>

    {{-- =========================================================
    PAGE 1 : PROPERTY INFORMATION
    ========================================================= --}}
    <div class="page-break">

        <div class="report-header">
            <h1 class="report-title">Property Inspection Report</h1>
        </div>

        <div class="info-card">

            <div class="info-row">
                <span class="info-label">Property Name:</span>
                {{ $property['name'] ?? 'N/A' }}
            </div>

            <div class="info-row">
                <span class="info-label">Property Address:</span>
                {{ $property['address'] ?? 'N/A' }}
            </div>

            <div class="info-row">
                <span class="info-label">Inspection Type:</span>
                {{ $inspection_type_text ?? 'N/A' }}
            </div>

            <div class="info-row">
                <span class="info-label">Submitted Date:</span>
                {{ isset($submitted_at) ? \Carbon\Carbon::parse($submitted_at)->format('F d, Y') : 'N/A' }}
            </div>

            <div class="info-row">
                <span class="info-label">Inspected By:</span>
                {{ $tenant['name'] ?? 'N/A' }}
            </div>
            <div class="info-row">
                <span class="info-label">Inspection Status:</span>
                {{ $status ?? 'N/A' }}
            </div>

        </div>

        @isset($general_comment)
            @if(trim($general_comment) !== '')
                <div class="comment-title">
                    Overall Comment
                </div>

                <div class="comment-box">
                    {{ $general_comment }}
                </div>
            @endif
        @endisset

    </div>

    {{-- =========================================================
    IMAGE PAGES
    ========================================================= --}}
    @forelse($all_images as $image)
        @php
            [$width, $height] = getimagesize($image['path']);
            $pageWidth = 595;
            $pageHeight = 842;
            $imageHeight = $height;
            $bottom = 0;
            if ($pageHeight < $height) {
                $remaining = $height - $pageHeight;
                $height = $height - $remaining;
                if ($height == $pageHeight || $height > $pageHeight + 20) {
                    $height = 10;
                }
            }
            $bottom = $height + 50;
        @endphp

        <div class="image-page">
            <div class="image-wrapper">
                <img src="{{ $image['path'] }}" class="inspection-image"
                    alt="{{ $image['checklist_item_name'] ?? 'Inspection Image' }}">
                <!-- <div class="image-label-heightWidth">
                    {{ $width }} × {{ $imageHeight }} Time Bootm Height {{ $height }}
                </div> -->
                <div class="image-label">
                    {{ $image['checklist_item_name'] ?? 'Inspection Image' }}
                </div>
                <div class="image-time" style="bottom: {{ $height + 60 }}px;">
                    <!-- {{ preg_replace('/^.*[\/\\\\]/', '', $image['path']) }} -->
                    @php
                        $filename = preg_replace('/^.*[\/\\\\]/', '', $image['path']);

                        preg_match(
                            '/^(\d{2})-(\d{2})-(\d{4})_(\d{2})-(\d{2})-(\d{2})_(AM|PM)/i',
                            $filename,
                            $matches
                        );

                        if ($matches) {
                            $timestamp = "{$matches[1]}-{$matches[2]}-{$matches[3]} {$matches[4]}:{$matches[5]}:{$matches[6]} {$matches[7]}";
                        } else {
                            $timestamp = '';
                        }
                    @endphp

                    {{ $timestamp }}
                </div>
            </div>
        </div>
    @empty

        <div class="image-page">
            <div class="no-image">
                <h2>No Images Available</h2>
                <p>No inspection photos were uploaded.</p>
            </div>
        </div>

    @endforelse

</body>

</html>