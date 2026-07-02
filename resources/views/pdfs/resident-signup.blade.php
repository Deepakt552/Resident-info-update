{{-- resources/views/pdfs/resident-signup.blade.php --}}
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Resident Sign-Up Sheet</title>
    <style>
        /* Reset & Base */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .notice-page {
            padding: 30px;
            font-size: 13px;
            line-height: 1.7;
        }

        .notice-header {
            font-size: 20px;
            font-weight: 700;
            text-align: center;
            color: #0f4c81;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .notice-subheader {
            text-align: center;
            font-weight: 600;
            margin-bottom: 25px;
            color: #2d3748;
        }

        .notice-body p {
            margin-bottom: 12px;
            text-align: justify;
        }

        .sign-off {
            margin-top: 25px;
            font-weight: 600;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            background: #ffffff;
            color: #2d3748;
            font-size: 12px;
            line-height: 1.6;
            padding: 20px 30px;
        }

        /* Page break handling */
        .page-break {
            page-break-after: always;
        }

        .page-break-inside-avoid {
            page-break-inside: avoid;
        }

        /* Header */
        .header {
            background: #ffffff;
            border-bottom: 3px solid #0f4c81;
            padding: 20px 0 15px 0;
            margin-bottom: 20px;
            display: table;
            width: 100%;
        }

        .header-left {
            display: table-cell;
            vertical-align: middle;
            width: 20%;
            text-align: left;
        }

        .header-center {
            display: table-cell;
            vertical-align: middle;
            width: 60%;
            text-align: center;
        }

        .header-right {
            display: table-cell;
            vertical-align: middle;
            width: 20%;
            text-align: right;
            font-size: 11px;
            color: #2d3748;
        }

        .header-title {
            font-size: 22px;
            font-weight: 700;
            color: #0f4c81;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .header-subtitle {
            font-size: 14px;
            color: #1c5f99;
            font-weight: 400;
            margin-top: 2px;
        }

        .header-date {
            font-weight: 600;
        }

        /* Logo placeholder */
        .logo-placeholder {
            font-size: 14px;
            font-weight: 700;
            color: #0f4c81;
        }

        .logo-placeholder img {
            max-height: 60px;
            max-width: 120px;
        }

        /* Office Use Section */
        .office-section {
            background: #0f4c81;
            color: #ffffff;
            padding: 8px 15px;
            border-radius: 4px 4px 0 0;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .office-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .office-table td {
            padding: 10px 15px;
            border: 1px solid #d8dde5;
            background: #f7f8fa;
        }

        .office-table .label {
            font-weight: 600;
            color: #2d3748;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            background: #eef7f0;
            width: 15%;
        }

        .office-table .value {
            background: #f7f8fa;
            color: #2d3748;
            font-weight: 400;
        }

        /* Intro Message */
        .intro-box {
            background: #f7f8fa;
            border-radius: 8px;
            padding: 15px 20px;
            margin-bottom: 25px;
            border: 1px solid #d8dde5;
        }

        .intro-box p {
            margin: 0;
            font-size: 13px;
            color: #2d3748;
        }

        .intro-box .greeting {
            font-weight: 600;
            font-size: 14px;
        }

        /* Tenant Grid */
        .tenant-grid {
            display: table;
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .tenant-grid .tenant-col {
            display: table-cell;
            padding: 0 5px;
            vertical-align: top;
        }

        /* Full width (single tenant) */
        .tenant-grid.full-width .tenant-col {
            width: 100%;
            padding: 0;
        }

        /* Two columns (2 tenants) */
        .tenant-grid.two-columns .tenant-col {
            width: 50%;
        }

        .tenant-section {
            margin-bottom: 0;
            page-break-inside: avoid;
        }

        .tenant-title {
            background: #0f4c81;
            color: #ffffff;
            padding: 8px 12px;
            border-radius: 6px 6px 0 0;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .tenant-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 0 0 6px 6px;
            overflow: hidden;
        }

        .tenant-table .label-cell {
            background: #eef7f0;
            padding: 6px 10px;
            font-size: 10px;
            font-weight: 700;
            color: #2d3748;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border: 1px solid #d8dde5;
            width: 30%;
        }

        .tenant-table .value-cell {
            background: #ffffff;
            padding: 6px 10px;
            height: 30px;
            border: 1px solid #d8dde5;
            color: #2d3748;
            font-size: 11px;
        }

        .tenant-table .value-cell-empty {
            background: #ffffff;
            padding: 6px 10px;
            height: 30px;
            border: 1px solid #d8dde5;
            color: #a0aec0;
            text-align: center;
            font-size: 11px;
        }

        /* Footer */
        .footer {
            text-align: center;
            color: #a0aec0;
            font-size: 10px;
            padding-top: 15px;
            border-top: 1px solid #d8dde5;
            margin-top: 20px;
        }

        .footer .footer-title {
            font-weight: 600;
        }

        .footer .pagination {
            margin-top: 3px;
        }

        /* Utilities */
        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .text-left {
            text-align: left;
        }

        .font-bold {
            font-weight: 700;
        }

        .text-gray {
            color: #a0aec0;
        }

        .mt-10 {
            margin-top: 10px;
        }

        .mb-10 {
            margin-bottom: 10px;
        }

        /* N/A styling */
        .na-text {
            color: #a0aec0;
            font-style: italic;
            font-size: 11px;
        }

        /* Signature placeholder */
        .signature-placeholder {
            border-bottom: 2px solid #2d3748;
            min-height: 25px;
            margin-top: 3px;
            padding: 3px 0;
        }

        /* Signature image styling */
        .signature-image {
            max-height: 40px;
            max-width: 150px;
            border: none;
            display: inline-block;
        }

        .signature-container {
            padding: 2px 0;
        }

        .signature-label {
            font-size: 9px;
            color: #4a5568;
            font-weight: 600;
        }

        /* Full width tenant - bigger fonts */
        .tenant-grid.full-width .tenant-title {
            font-size: 14px;
            padding: 10px 15px;
        }

        .tenant-grid.full-width .tenant-table .label-cell {
            font-size: 12px;
            padding: 8px 12px;
            width: 25%;
        }

        .tenant-grid.full-width .tenant-table .value-cell {
            font-size: 13px;
            padding: 8px 12px;
            height: 35px;
        }

        .tenant-grid.full-width .tenant-table .value-cell-empty {
            font-size: 13px;
            padding: 8px 12px;
            height: 35px;
        }

        .tenant-grid.full-width .signature-image {
            max-height: 60px;
            max-width: 250px;
        }

        @page {
            margin: 15px 20px;
        }

        /* Responsive for print */
        @media print {
            .page-break {
                page-break-after: always;
            }

            .tenant-grid.two-columns .tenant-col {
                display: table-cell;
                width: 50%;
            }

            .tenant-grid.full-width .tenant-col {
                display: table-cell;
                width: 100%;
            }
        }
    </style>
</head>

<body>
    <!-- PAGE 1: NOTICE -->
    <div class="notice-page page-break">
        <!-- PAGE HEADER - will show on all pages -->
        <div class="header">
            <div class="header-left">
                <div class="logo-placeholder">
                    @if(isset($logo) && $logo)
                        <img src="{{ $logo }}" alt="Company Logo">
                    @else
                        <span>🏢 PROPERTY</span>
                    @endif
                </div>
            </div>
            <div class="header-center">
                <div class="header-title"> NOTICE TO RESIDENT <br>RESIDENT INFORMATION UPDATE</div>
            </div>
            <div class="header-right">
                <div class="header-date">{{ now()->format('F d, Y') }}</div>
            </div>
        </div>

        <div class="notice-body">
            <p>Dear Resident(s),</p>

            <p>
                This notice is to inform you that Management is committed to maintaining accurate resident records and
                ensuring efficient communication with all occupants of the community. As part of this effort, we are
                requesting that all adult tenants listed on the Lease Agreement complete the enclosed Resident Sign-Up
                Sheet.
            </p>

            <p>
                The information collected will be used to update Management's records and maintain current contact
                information for residents. Accurate resident information is essential to ensure that communications are
                directed to the appropriate individuals and that Management is able to effectively administer and
                operate the property.
            </p>

            <p>
                Please be advised that effective August 1, 2026, Management intends to utilize email as a primary method
                of communication with residents, where permitted by applicable law. To facilitate this transition, each
                adult tenant listed on the Lease Agreement is requested to provide a valid and regularly monitored email
                address on the enclosed form.
            </p>

            <p>
                Please carefully complete all requested information contained in the Resident Sign-Up Sheet, including
                contact and emergency contact information, and return the completed form to the Management Office within
                three (3) days of receipt of this letter.
            </p>

            <p>
                Residents are responsible for ensuring that the information provided remains current and accurate. Any
                future changes to contact information should be promptly reported to Management in writing.
            </p>

            <p>
                Your cooperation in this matter is appreciated and will assist Management in maintaining accurate
                records and effective communication with residents.
            </p>

            <p class="sign-off">
                Sincerely,<br>
                The Management
            </p>
        </div>
    </div>
    <!-- PAGE HEADER - will show on all pages -->
    <div class="header">
        <div class="header-left">
            <div class="logo-placeholder">
                @if(isset($logo) && $logo)
                    <img src="{{ $logo }}" alt="Company Logo">
                @else
                    <span> PROPERTY</span>
                @endif
            </div>
        </div>
        <div class="header-center">
            <div class="header-title">Resident Sign-Up Sheet</div>
        </div>
        <div class="header-right">
            <div class="header-date">{{ now()->format('F d, Y') }}</div>
        </div>
    </div>

    <!-- INTRO MESSAGE -->
    <div class="intro-box">
        <p><span class="greeting">Dear Resident,</span></p>
        <p>We are updating our tenant directory and tenant files. Please complete the information below and submit it at
            your earliest convenience.</p>
    </div>

    <!-- OFFICE USE SECTION -->
    <div class="office-section">Office Use</div>
    <table class="office-table">
        <tr>
            <td class="label">Unit #</td>
            <td class="value">{{ $unitno ?? 'N/A' }}</td>
            <td class="label">Property Name</td>
            <td class="value">{{ $propertyName ?? 'N/A' }}</td>
            <td class="label">Property Address</td>
            <td class="value">{{ $propertyAddress ?? 'N/A' }}</td>
        </tr>
    </table>

    <!-- TENANT SECTIONS - Dynamic: 1 full or 2 per page -->
    @php
        // Get only tenants that exist (not empty)
        $existingTenants = array_filter($tenants ?? [], function ($tenant) {
            return !empty($tenant['full_name']) || !empty($tenant['email']);
        });

        // If no tenants exist, show a message
        if (empty($existingTenants)) {
            $existingTenants = [null];
        }

        // Reindex array
        $existingTenants = array_values($existingTenants);
        $totalTenants = count($existingTenants);

        // Calculate pages: 2 per page except last page may have 1
        $tenantsPerPage = 2;
        $totalPages = ceil($totalTenants / $tenantsPerPage);

        // For each page, determine if it's full width (single tenant) or two columns
        $pageConfigs = [];
        $remaining = $totalTenants;
        $start = 0;

        while ($remaining > 0) {
            if ($remaining == 1) {
                // Last page with single tenant - FULL WIDTH
                $pageConfigs[] = [
                    'start' => $start,
                    'count' => 1,
                    'type' => 'full'
                ];
                $remaining = 0;
            } else {
                // Take 2 tenants - TWO COLUMNS
                $take = min(2, $remaining);
                $pageConfigs[] = [
                    'start' => $start,
                    'count' => $take,
                    'type' => ($take == 1) ? 'full' : 'two'
                ];
                $start += $take;
                $remaining -= $take;
            }
        }
    @endphp

    @foreach($pageConfigs as $pageIndex => $config)
        @php
            $startIndex = $config['start'];
            $count = $config['count'];
            $type = $config['type']; // 'full' or 'two'
            $tenantsOnPage = array_slice($existingTenants, $startIndex, $count);
            $gridClass = ($type == 'full') ? 'full-width' : 'two-columns';
        @endphp

        <!-- TENANT GRID -->
        <div class="tenant-grid {{ $gridClass }}">
            @foreach($tenantsOnPage as $index => $tenant)
                @php
                    $globalIndex = $startIndex + $index;
                    $tenantNumber = str_pad($globalIndex + 1, 2, '0', STR_PAD_LEFT);
                    $hasData = !empty($tenant) && (!empty($tenant['full_name']) || !empty($tenant['email']));

                    // Check for signature data - support both formats
                    $hasSignature = false;
                    $signatureSrc = null;

                    if ($hasData) {
                        // Check if signature_data exists (base64 from controller)
                        if (!empty($tenant['signature_data'])) {
                            $hasSignature = true;
                            $signatureSrc = $tenant['signature_data'];
                        }
                        // Check if signature path exists (stored path)
                        elseif (!empty($tenant['signature'])) {
                            $signaturePath = str_replace('storage/', '', $tenant['signature']);
                            $fullPath = storage_path('app/public/' . $signaturePath);
                            if (file_exists($fullPath)) {
                                try {
                                    $imageData = base64_encode(file_get_contents($fullPath));
                                    $signatureSrc = 'data:image/png;base64,' . $imageData;
                                    $hasSignature = true;
                                } catch (Exception $e) {
                                    // Failed to read signature
                                }
                            }
                        }
                    }
                @endphp

                <div class="tenant-col">
                    <div class="tenant-section">
                        <div class="tenant-title">Tenant #{{ $tenantNumber }}</div>

                        <table class="tenant-table">
                            <!-- Full Name -->
                            <tr>
                                <td class="label-cell">Full Name</td>
                                <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                                    {{ $tenant['full_name'] ?? 'N/A' }}
                                </td>
                            </tr>
                            <!-- Email -->
                            <tr>
                                <td class="label-cell">Email</td>
                                <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                                    {{ $tenant['email'] ?? 'N/A' }}
                                </td>
                            </tr>
                            <!-- Phone -->
                            <tr>
                                <td class="label-cell">Phone</td>
                                <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                                    {{ $tenant['phone'] ?? 'N/A' }}
                                </td>
                            </tr>
                            <!-- Emergency Contact -->
                            <tr>
                                <td class="label-cell">Emergency Contact</td>
                                <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                                    {{ $tenant['emergency_contact_name'] ?? 'N/A' }}
                                </td>
                            </tr>
                            <!-- Emergency Phone -->
                            <tr>
                                <td class="label-cell">Emergency Phone</td>
                                <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                                    {{ $tenant['emergency_contact_phone'] ?? 'N/A' }}
                                </td>
                            </tr>
                            <!-- Date -->
                            <!-- <tr>
                                                <td class="label-cell">Date</td>
                                                <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                                                    {{ $tenant['date'] ?? 'N/A' }}
                                                </td>
                                            </tr> -->
                            <!-- Signature -->
                            <tr>
                                <td class="label-cell">Signature</td>
                                <td class="value-cell" style="height: 50px; padding: 3px 10px;">
                                    @if($hasSignature && $signatureSrc)
                                        <div class="signature-container">
                                            <div style="margin-bottom: 2px;">
                                                <img src="{{ $signatureSrc }}" alt="Signature" class="signature-image">
                                            </div>
                                            <div style="border-bottom: 2px solid #2d3748; min-height: 15px; padding: 2px 0;">
                                                <span class="signature-label"> </span>
                                            </div>
                                        </div>
                                    @else
                                        <div style="border-bottom: 2px solid #2d3748; min-height: 25px; padding: 3px 0;">
                                            <span class="na-text">___________________</span>
                                        </div>
                                    @endif
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            @endforeach

            {{-- If there's only 1 tenant on a page with 2-column layout, show empty placeholder --}}
            @if($type == 'two' && $count == 1)
                <div class="tenant-col">
                    <div class="tenant-section">
                        <div class="tenant-title" style="background: #e2e8f0; color: #4a5568;">Empty</div>
                        <table class="tenant-table">
                            <tr>
                                <td class="label-cell">Full Name</td>
                                <td class="value-cell-empty">—</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Email</td>
                                <td class="value-cell-empty">—</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Phone</td>
                                <td class="value-cell-empty">—</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Emergency Contact</td>
                                <td class="value-cell-empty">—</td>
                            </tr>
                            <tr>
                                <td class="label-cell">Emergency Phone</td>
                                <td class="value-cell-empty">—</td>
                            </tr>
                            <!-- <tr><td class="label-cell">Date</td><td class="value-cell-empty">—</td></tr> -->
                            <tr>
                                <td class="label-cell">Signature</td>
                                <td class="value-cell" style="height: 50px; padding: 3px 10px;">
                                    <div style="border-bottom: 2px solid #d8dde5; min-height: 25px; padding: 3px 0;">
                                        <span class="na-text">___________________</span>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            @endif
        </div>

        <!-- @if(!$loop->last)
            <div class="page-break"></div>
            <div class="header">
                <div class="header-left">
                    <div class="logo-placeholder">
                        @if(isset($logo) && $logo)
                            <img src="{{ $logo }}" alt="Company Logo">
                        @else
                            <span> PROPERTY</span>
                        @endif
                    </div>
                </div>
                <div class="header-center">
                    <div class="header-title">Resident Sign-Up Sheet</div>
                    <div class="header-subtitle">Tenant Directory &amp; Resident Information Form</div>
                </div>
                <div class="header-right">
                    <div class="header-date">{{ now()->format('F d, Y') }}</div>
                </div>
            </div>

            <div style="margin-bottom: 20px;"></div>
        @endif -->
    @endforeach

</body>

</html>