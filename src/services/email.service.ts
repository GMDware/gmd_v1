import nodemailer from 'nodemailer';

export interface InquiryEmailData {
  id?: string;
  fullName: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  projectType?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  message: string;
  createdAt?: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Enterprise Email Notification Service for GMDware
 * Handles formatted inbound inquiry notifications to studio leadership (gmdware@gmail.com)
 */
export class EmailService {
  private static getTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '465', 10);
    const secure = process.env.SMTP_SECURE !== 'false' && port === 465;
    const user = process.env.SMTP_USER || process.env.GMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  /**
   * Generates a modern, responsive HTML email template for studio inquiries
   */
  private static generateInquiryHtml(data: InquiryEmailData, dashboardUrl: string): string {
    const formattedDate = new Date(data.createdAt || Date.now()).toLocaleString('en-US', {
      timeZone: 'Africa/Cairo',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const safeFullName = data.fullName || 'Prospective Client';
    const safeCompany = data.companyName || 'Not specified';
    const safePhone = data.phone || 'Not provided';
    const safeProjectType = data.projectType || 'General Engagement';
    const safeBudget = data.budgetRange || 'Open / To be discussed';
    const safeTimeline = data.timeline || 'Flexible';
    const safeMessage = data.message.replace(/\n/g, '<br />');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Client Inquiry — GMDware</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F8FAFC;
      padding: 40px 16px;
    }
    .container {
      max-width: 620px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #E2E8F0;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
    }
    .header {
      background: linear-gradient(135deg, #0A0E17 0%, #111827 100%);
      padding: 32px 32px 28px 32px;
      border-bottom: 2px solid #2563EB;
      text-align: left;
    }
    .header-badge {
      display: inline-block;
      background-color: rgba(37, 99, 235, 0.15);
      border: 1px solid rgba(37, 99, 235, 0.4);
      color: #60A5FA;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .header-title {
      margin: 0;
      color: #FFFFFF;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .header-sub {
      margin: 6px 0 0 0;
      color: #94A3B8;
      font-size: 13px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .content {
      padding: 32px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #2563EB;
      margin-top: 0;
      margin-bottom: 16px;
      border-bottom: 1px solid #F1F5F9;
      padding-bottom: 8px;
    }
    .grid-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .grid-table td {
      padding: 10px 12px;
      font-size: 14px;
      border-bottom: 1px solid #F1F5F9;
      vertical-align: top;
    }
    .grid-table .label {
      width: 32%;
      color: #64748B;
      font-weight: 600;
    }
    .grid-table .value {
      width: 68%;
      color: #0F172A;
      font-weight: 500;
    }
    .badge-highlight {
      display: inline-block;
      background-color: #EFF6FF;
      color: #1D4ED8;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 13px;
    }
    .badge-budget {
      display: inline-block;
      background-color: #ECFDF5;
      color: #047857;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
    }
    .message-box {
      background-color: #F8FAFC;
      border-left: 4px solid #2563EB;
      border-radius: 0 10px 10px 0;
      padding: 18px 20px;
      font-size: 14px;
      line-height: 1.65;
      color: #334155;
      margin-bottom: 28px;
    }
    .actions {
      text-align: center;
      padding: 20px 0 10px 0;
      border-top: 1px solid #E2E8F0;
    }
    .button-primary {
      display: inline-block;
      background-color: #0F172A;
      color: #FFFFFF !important;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 10px;
      margin: 4px 6px;
    }
    .button-secondary {
      display: inline-block;
      background-color: #EFF6FF;
      color: #1D4ED8 !important;
      border: 1px solid #BFDBFE;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 10px;
      margin: 4px 6px;
    }
    .footer {
      background-color: #F1F5F9;
      padding: 20px 32px;
      font-size: 12px;
      color: #64748B;
      border-top: 1px solid #E2E8F0;
      text-align: center;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="header-badge">NEW INBOUND INQUIRY</div>
        <h1 class="header-title">New Client Project Submission</h1>
        <div class="header-sub">GMDware Studio Dispatch • ${formattedDate}</div>
      </div>

      <!-- Main Content -->
      <div class="content">
        <!-- Client Details -->
        <div class="section-title">Client Information</div>
        <table class="grid-table">
          <tr>
            <td class="label">Full Name</td>
            <td class="value"><strong>${safeFullName}</strong></td>
          </tr>
          <tr>
            <td class="label">Direct Email</td>
            <td class="value">
              <a href="mailto:${data.email}?subject=Re: GMDware Architectural Consultation — ${safeFullName}" style="color: #2563EB; text-decoration: none; font-weight: 600;">
                ${data.email}
              </a>
            </td>
          </tr>
          <tr>
            <td class="label">Phone / WhatsApp</td>
            <td class="value">${safePhone}</td>
          </tr>
          <tr>
            <td class="label">Company / Organization</td>
            <td class="value">${safeCompany}</td>
          </tr>
        </table>

        <!-- Project Specifications -->
        <div class="section-title">Project Scope & Parameters</div>
        <table class="grid-table">
          <tr>
            <td class="label">Project Type</td>
            <td class="value"><span class="badge-highlight">${safeProjectType}</span></td>
          </tr>
          <tr>
            <td class="label">Budget Range</td>
            <td class="value"><span class="badge-budget">${safeBudget}</span></td>
          </tr>
          <tr>
            <td class="label">Target Timeline</td>
            <td class="value">${safeTimeline}</td>
          </tr>
          ${data.id ? `<tr><td class="label">Submission ID</td><td class="value" style="font-family: monospace; font-size: 12px; color: #64748B;">${data.id}</td></tr>` : ''}
        </table>

        <!-- Message Body -->
        <div class="section-title">Client Message & Requirements</div>
        <div class="message-box">
          ${safeMessage}
        </div>

        <!-- Action CTAs -->
        <div class="actions">
          <a href="mailto:${data.email}?subject=Re: GMDware Architectural Consultation — ${safeFullName}" class="button-primary">
            Reply via Email
          </a>
          <a href="${dashboardUrl}" class="button-secondary">
            Open Admin Dashboard
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        This is an automated operational notification dispatched from <strong>GMDware Digital Studio</strong>.<br />
        Saved directly to Postgres database and visible in your Admin Dashboard under <em>Inquiries</em>.<br />
        Target Studio Inbox: <strong>gmdware@gmail.com</strong>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Dispatches the email notification to gmdware@gmail.com
   * Non-blocking for the HTTP response.
   */
  static async sendInquiryNotification(data: InquiryEmailData): Promise<{ sent: boolean; error?: string }> {
    const targetRecipient = process.env.NOTIFICATION_EMAIL || 'gmdware@gmail.com';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const dashboardUrl = `${siteUrl}/admin/inquiries`;

    const htmlContent = this.generateInquiryHtml(data, dashboardUrl);

    const plainTextContent = `
[NEW GMDWARE INBOUND INQUIRY]

From: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Company: ${data.companyName || 'N/A'}

Project Type: ${data.projectType || 'General Engagement'}
Budget: ${data.budgetRange || 'Open / Discussion'}
Timeline: ${data.timeline || 'Flexible'}

Message:
${data.message}

---
Submission ID: ${data.id || 'N/A'}
Date: ${new Date().toISOString()}
View in Admin Dashboard: ${dashboardUrl}
Reply Direct: mailto:${data.email}
    `.trim();

    const transporter = this.getTransporter();

    if (!transporter) {
      console.log('─────────────────────────────────────────────────────────────');
      console.log(`[Email Service Notice] New Inquiry Received for ${targetRecipient}:`);
      console.log(`• Client: ${data.fullName} (${data.email})`);
      console.log(`• Project: ${data.projectType || 'General'} | Budget: ${data.budgetRange || 'Flexible'}`);
      console.log(`• Message: ${data.message.substring(0, 100)}...`);
      console.log(`• Saved to DB & Dashboard: Yes (ID: ${data.id || 'Generated'})`);
      console.log(`• Note: To deliver live SMTP emails directly into gmdware@gmail.com,`);
      console.log(`  configure SMTP_USER and SMTP_PASS (or GMAIL_APP_PASSWORD) in your .env file.`);
      console.log('─────────────────────────────────────────────────────────────');
      return { sent: false, error: 'SMTP credentials not configured in environment' };
    }

    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || `"GMDware Studio" <${process.env.SMTP_USER || 'notifications@gmdware.com'}>`,
        to: targetRecipient,
        replyTo: data.email,
        subject: `[New Inquiry] ${data.fullName} — ${data.projectType || 'Digital Project'} (${data.companyName || 'Direct'})`,
        text: plainTextContent,
        html: htmlContent,
      });

      console.log(`[Email Service] Successfully delivered inquiry notification to ${targetRecipient} (Message ID: ${info.messageId})`);
      return { sent: true };
    } catch (err: any) {
      console.error(`[Email Service Error] Failed to transmit email to ${targetRecipient}:`, err?.message || err);
      return { sent: false, error: err?.message || 'SMTP transmission error' };
    }
  }
}
