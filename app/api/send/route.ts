import {NextResponse} from "next/server";
import {resend} from "../../lib/resend";

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

export async function POST(req : Request){
    try 
    {
        //parse the incoming form data
        const body = await req.json();
        const {name , email , message} = body;

        if (!email || !message || !name) {
            return NextResponse.json(
                {error : "Missing Fields"},{status : 400}
            )
        };

        


        //confirmation email to me; escape user input so it can't inject HTML
        await resend.emails.send({
            from : 'Portfolio Contact Form <onboarding@resend.dev>',
            to : process.env.PERSONNAL_MAIL_ADDRESS!,
            subject : `Portfolio Contact from ${name}`,
            html : `<h1>New message from ${escapeHtml(name)} (${escapeHtml(email)})</h1><p>${escapeHtml(message)}</p>`
        });

        

        return NextResponse.json({success : true});
    }

    catch (err){
        console.error(err);
        return NextResponse.json(
            {error : "Server Error"}, {status : 500}
        )
    }
    
} 