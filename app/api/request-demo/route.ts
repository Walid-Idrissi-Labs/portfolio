import { NextResponse } from "next/server";
import { EMAIL_LIMIT, EMAIL_PATTERN, MESSAGE_LIMIT } from "../../lib/form-rules";
import { projects } from "../../lib/projects";
import { rateLimited } from "../../lib/rate-limit";
import { getResend } from "../../lib/resend";

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

export async function POST(req: Request) {
    try {
        if (rateLimited(req)) {
            return NextResponse.json(
                { error: "Too Many Requests" }, { status: 429 }
            );
        }

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

        // The form can't send these, but nothing forces a caller to use the form.
        if (
            !projects.some((known) => known.name === project) ||
            email.length > EMAIL_LIMIT ||
            (typeof note === "string" && note.length > MESSAGE_LIMIT)
        ) {
            return NextResponse.json(
                { error: "Invalid Fields" }, { status: 400 }
            );
        }

        const safeNote =
            typeof note === "string" && note.trim()
                ? `<p>${escapeHtml(note)}</p>`
                : "<p><i>No extra details provided.</i></p>";

        // Demo request to me; replyTo lets me answer the visitor directly.
        const { error } = await getResend().emails.send({
            from: "Portfolio Demo Request <onboarding@resend.dev>",
            to: process.env.PERSONNAL_MAIL_ADDRESS!,
            replyTo: email,
            subject: `Demo request — ${project}`,
            html: `<h1>Demo request for ${escapeHtml(project)}</h1><p>From: ${escapeHtml(email)}</p>${safeNote}`,
        });
        // Resend returns a failed send instead of throwing it.
        if (error) throw error;

        return NextResponse.json({ success: true });
    }

    catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Server Error" }, { status: 500 }
        );
    }
}
