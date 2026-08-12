import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
const emailTo = process.env.EMAIL_TO || "punithpatriot@gmail.com";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  try {
    if (!resend) {
      return NextResponse.json({ success: false, reason: "No API key configured" }, { status: 200 });
    }

    const body = await req.json().catch(() => ({}));
    const headers = req.headers;

    const ip = headers.get("cf-connecting-ip") || headers.get("x-forwarded-for") || "Unknown IP";
    const country = headers.get("cf-ipcountry") || "Unknown Country";
    const city = headers.get("cf-ipcity") || "";
    const userAgent = headers.get("user-agent") || "Unknown Device";
    const referrer = body.referrer || headers.get("referer") || "Direct / Bookmark";
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const locationStr = city ? `${city}, ${country}` : country;

    await resend.emails.send({
      from: `Auto Raja Tracker <${emailFrom}>`,
      to: emailTo,
      subject: `🚕 New Visitor on Auto Raja! [${locationStr}]`,
      html: `
        <div style="font-family: system-ui, sans-serif; background-color: #0e0d12; color: #ffffff; padding: 24px; border-radius: 12px; max-width: 520px; margin: 0 auto; border: 1px solid rgba(245,197,24,0.3);">
          <h2 style="color: #F5C518; margin-top: 0;">🚕 New Visitor Alert — Auto Raja</h2>
          <p style="color: #cccccc; font-size: 14px;">Someone just opened the Auto Raja website!</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; color: #dddddd;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #888888;">Time (IST)</td>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: 600; text-align: right;">${timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #888888;">Location</td>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: 600; text-align: right; color: #3DDC84;">${locationStr}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #888888;">IP Address</td>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">${ip}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #888888;">Referrer</td>
              <td style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right;">${referrer}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888888;">Device / User Agent</td>
              <td style="padding: 8px 0; text-align: right; word-break: break-all; font-size: 11px; color: #aaaaaa;">${userAgent}</td>
            </tr>
          </table>
          
          <div style="margin-top: 24px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.15); text-align: center; font-size: 11px; color: #666666;">
            Meter running. Volume full. · Auto Raja Tracker
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Track email error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
