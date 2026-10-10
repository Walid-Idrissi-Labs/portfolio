import {NextResponse} from "next/server";
import {EMAIL_LIMIT, EMAIL_PATTERN, MESSAGE_LIMIT, NAME_LIMIT} from "../../lib/form-rules";
import {rateLimited} from "../../lib/rate-limit";
import {getResend} from "../../lib/resend";

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

export async function POST(req : Request){
    try 
    {
        if (rateLimited(req)) {
            return NextResponse.json(
                {error : "Too Many Requests"},{status : 429}
            )
        };

        //parse the incoming form data
        const body = await req.json();
        const {name , email , message} = body;

        //the form checks these too, but nothing forces a caller to use the form
        if (
            typeof name !== "string" || typeof email !== "string" || typeof message !== "string" ||
            !name.trim() || !message.trim() ||
            name.length > NAME_LIMIT || email.length > EMAIL_LIMIT || message.length > MESSAGE_LIMIT ||
            !EMAIL_PATTERN.test(email)
        ) {
            return NextResponse.json(
                {error : "Invalid Fields"},{status : 400}
            )
        };

        


        //confirmation email to me; escape user input so it can't inject HTML
        const {error} = await getResend().emails.send({
            from : 'Portfolio Contact Form <onboarding@resend.dev>',
            to : process.env.PERSONNAL_MAIL_ADDRESS!,
            subject : `Portfolio Contact from ${name}`,
            html : `<h1>New message from ${escapeHtml(name)} (${escapeHtml(email)})</h1><p>${escapeHtml(message)}</p>`
        });
        //resend returns a failed send instead of throwing it
        if (error) throw error;

        

        return NextResponse.json({success : true});
    }

    catch (err){
        console.error(err);
        return NextResponse.json(
            {error : "Server Error"}, {status : 500}
        )
    }
    
} 