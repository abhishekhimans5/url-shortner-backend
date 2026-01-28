

export const emailService = (templateData) => {

    const subject = templateData?.subject || 'OTP Verification';

    const template = 
        `<!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
            :root {
            --primary: #2563eb;
            --bg: #f8fafc;
            --text: #1e293b;
            }
            body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            }
            .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f8fafc;
            padding-bottom: 40px;
            }
            .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header {
            background-color: #2563eb;
            padding: 30px;
            text-align: center;
            color: #ffffff;
            }
            .content {
            padding: 40px 30px;
            text-align: center;
            }
            .otp-code {
            display: inline-block;
            padding: 15px 30px;
            margin: 30px 0;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: 10px;
            color: #2563eb;
            background-color: #eff6ff;
            border-radius: 8px;
            border: 1px dashed #2563eb;
            }
            .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            background-color: #f1f5f9;
            }
            p {
            line-height: 1.6;
            color: #334155;
            margin: 10px 0;
            }
        </style>
        </head>
        <body>
        <div class="wrapper">
            <div class="container">
            <div class="header">
                <h1 style="margin:0; font-size: 24px;">ShortIt</h1>
            </div>
            <div class="content">
                <h2 style="margin-top:0;">Verify Your Account</h2>
                <p>Use the following One-Time Password (OTP) to complete your verification. This code is valid for <strong>10 minutes</strong>.</p>
                
                <div class="otp-code">123456</div>
                
                <p style="font-size: 14px; color: #64748b;">If you didn't request this, please ignore this email or contact support if you have concerns.</p>
            </div>
            <div class="footer">
                &copy; 2025 ShortIt URL Shortener. All rights reserved.<br>
                Noida, Uttar Pradesh, India.
            </div>
            </div>
        </div>
        </body>
        </html>`

}