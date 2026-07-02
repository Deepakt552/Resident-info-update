<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Resident Signup Form Submitted</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #e9ecef;
            border-radius: 5px;
        }
        .detail-row {
            padding: 10px 0;
            border-bottom: 1px solid #f1f3f5;
        }
        .detail-label {
            font-weight: bold;
            color: #495057;
        }
        .footer {
            margin-top: 20px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 5px;
            font-size: 12px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Resident Signup Form Submitted</h2>
            <p style="color: #6c757d;">A new resident signup form has been submitted.</p>
        </div>

        <div class="content">
            <div class="detail-row">
                <span class="detail-label">Property Name:</span>
                <span>{{ $propertyName ?? 'N/A' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Unit Number:</span>
                <span>{{ $unitNumber ?? 'N/A' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Signup UID:</span>
                <span>{{ $signupUid ?? 'N/A' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Tenant Names:</span>
                <span>{{ $tenantNames ?? 'N/A' }}</span>
            </div>
        </div>

        <div class="footer">
            <p>This email was automatically generated. Please find the attached PDF for complete details.</p>
            <p>© {{ date('Y') }} Navkar Services. All rights reserved.</p>
        </div>
    </div>
</body>
</html>