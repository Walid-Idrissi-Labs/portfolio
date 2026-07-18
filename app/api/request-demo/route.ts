import { NextResponse } from "next/server";
import { resend } from "../../lib/resend";

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { project, email, note } = body;

        if (typeof project !== "string" || !project || typeof email !== "string" || !email) {
            return NextResponse.json(
                { error: "Missing Fields" }, { status: 400 }
            );
        }

        if (!EMAIL_PATTERN.test(email)) {
            return NextResponse.json(
                { error: "Invalid Email" }, { status: 400 }
            );
        }

        const safeNote =
            typeof note === "string" && note.trim()
                ? `<p>${escapeHtml(note)}</p>`
                : "<p><i>No extra details provided.</i></p>";

        // Demo request to me; replyTo lets me answer the visitor directly.
        await resend.emails.send({
            from: "Portfolio Demo Request <onboarding@resend.dev>",
            to: process.env.PERSONNAL_MAIL_ADDRESS!,
            replyTo: email,
            subject: `Demo request — ${project}`,
            html: `<h1>Demo request for ${escapeHtml(project)}</h1><p>From: ${escapeHtml(email)}</p>${safeNote}`,
        });

        return NextResponse.json({ success: true });
    }

    catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Server Error" }, { status: 500 }
        );
    }
}
