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

        /* Tenant Section */
        .tenant-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .tenant-title {
            background: #0f4c81;
            color: #ffffff;
            padding: 10px 15px;
            border-radius: 6px 6px 0 0;
            font-size: 13px;
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
            padding: 8px 12px;
            font-size: 11px;
            font-weight: 700;
            color: #2d3748;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            border: 1px solid #d8dde5;
            width: 25%;
        }

        .tenant-table .value-cell {
            background: #ffffff;
            padding: 8px 12px;
            height: 35px;
            border: 1px solid #d8dde5;
            color: #2d3748;
        }

        .tenant-table .value-cell-empty {
            background: #ffffff;
            padding: 8px 12px;
            height: 35px;
            border: 1px solid #d8dde5;
            color: #a0aec0;
            text-align: center;
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
            font-size: 12px;
        }

        /* Signature placeholder */
        .signature-placeholder {
            border-bottom: 2px solid #2d3748;
            min-height: 30px;
            margin-top: 5px;
            padding: 5px 0;
        }

        /* Signature image styling */
        .signature-image {
            max-height: 50px;
            max-width: 200px;
            border: none;
            display: inline-block;
        }

        .signature-container {
            padding: 2px 0;
        }

        .signature-label {
            font-size: 10px;
            color: #4a5568;
            font-weight: 600;
        }
    </style>
</head>

<body>
    <!-- HEADER -->
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
            <div class="header-title">Resident Sign-Up Sheet</div>
            <div class="header-subtitle">Tenant Directory &amp; Resident Information Form</div>
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

    <!-- TENANT SECTIONS -->
    @php
        // Get only tenants that exist (not empty)
        $existingTenants = array_filter($tenants ?? [], function ($tenant) {
            return !empty($tenant['full_name']) || !empty($tenant['email']);
        });

        // If no tenants exist, show a message
        if (empty($existingTenants)) {
            $existingTenants = [null];
        }
    @endphp

    @foreach($existingTenants as $index => $tenant)
        @php
            $tenantNumber = str_pad($index + 1, 2, '0', STR_PAD_LEFT);
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

        <div class="tenant-section page-break-inside-avoid">
            <div class="tenant-title">Tenant Information #{{ $tenantNumber }}</div>

            <table class="tenant-table">
                <!-- Row 1: Full Name + Email -->
                <tr>
                    <td class="label-cell">Full Name</td>
                    <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                        {{ $tenant['full_name'] ?? 'N/A' }}
                    </td>
                    <td class="label-cell">Email Address</td>
                    <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                        {{ $tenant['email'] ?? 'N/A' }}
                    </td>
                </tr>

                <!-- Row 2: Phone + Emergency Contact Name -->
                <tr>
                    <td class="label-cell">Phone Number</td>
                    <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                        {{ $tenant['phone'] ?? 'N/A' }}
                    </td>
                    <td class="label-cell">Emergency Contact Name</td>
                    <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                        {{ $tenant['emergency_contact_name'] ?? 'N/A' }}
                    </td>
                </tr>

                <!-- Row 3: Emergency Phone + Date -->
                <tr>
                    <td class="label-cell">Emergency Contact Phone</td>
                    <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                        {{ $tenant['emergency_contact_phone'] ?? 'N/A' }}
                    </td>
                    <td class="label-cell">Date</td>
                    <td class="{{ $hasData ? 'value-cell' : 'value-cell-empty' }}">
                        {{ $tenant['date'] ?? 'N/A' }}
                    </td>
                </tr>

                <tr>
                    <td class="label-cell" style="width: 15%;">Signature</td>
                    <td colspan="3" class="value-cell" style="height: 60px; padding: 5px 12px;">
                        <!-- Signature Row mein add karein -->
                        @if($hasSignature && $signatureSrc)
                            <div class="signature-container">
                                <div style="margin-bottom: 2px;">
                                    <img src="{{ $signatureSrc }}" alt="Signature" class="signature-image">
                                </div>
                                <div style="border-bottom: 2px solid #2d3748; min-height: 20px; padding: 2px 0;">
                                    <span class="signature-label"> Signed</span>
                                </div>
                            </div>
                        @else
                            <!-- Debug info -->
                            @if(config('app.debug'))
                                <div style="font-size:8px;color:#999;">
                                    No signature - hasData: {{ $hasData ? 'yes' : 'no' }},
                                    hasSig: {{ $hasSignature ? 'yes' : 'no' }}
                                </div>
                            @endif
                            <div style="border-bottom: 2px solid #2d3748; min-height: 30px; padding: 5px 0;">
                                <span class="na-text">___________________</span>
                            </div>
                        @endif
                    </td>
                </tr>
            </table>
        </div>

        @if(!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach

    <!-- FOOTER -->
    <div class="footer">
        <div class="footer-title">Resident Sign-Up Sheet</div>
        <div>Generated on {{ now()->format('M d, Y') }}</div>
        <div class="pagination">Page 1 of {{ count($existingTenants) }}</div>
    </div>
</body>

</html>