import { NextRequest, NextResponse } from 'next/server'
import {cookies} from "next/headers";
import {hash} from "@/app/(backend)/util";

export async function middleware(request: NextRequest) {
    /*if (!request.nextUrl.pathname.includes("oauth/") || request.nextUrl.pathname.includes("error")) {
        return;
    }

    console.log("MID-... DLEWARE");
    const uid = request.cookies.get('user-id')?.value;
    const session = request.cookies.get('session')?.value;

    if (!uid || !session || hash(uid) !== session) {
        console.log("ff1");
        return NextResponse.redirect('http://localhost:3000/oauth/error?e=1');
    }

    const user = await User.query("id").eq(uid).exec();

    if (user.length === 0) {
        console.log("ff2");
        return NextResponse.redirect('http://localhost:3000/oauth/error?e=1');
    }

    const code = request.nextUrl.searchParams.get('code');

    if (!code) {
        console.log("ff3");
        return NextResponse.redirect('http://localhost:3000/oauth/error?e=0');
    }

    const response = await fetch('https://discord.com/api/v10/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(process.env.DISCORD_ID + ':' + process.env.DISCORD_SECRET)}`
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: "http://localhost:3000/oauth/discord",
        })
    });

    console.log(`Basic ${btoa(process.env.DISCORD_ID + ':' + process.env.DISCORD_SECRET)}`);

    if (!response.ok) {
        console.log("ff4");
        console.log(await response.text());
        return NextResponse.redirect('http://localhost:3000/oauth/error?e=0');
    }

    const token = await response.json();

    user[0].discord = token.refresh_token;
    await user[0].save();

    const r = NextResponse.redirect('http://localhost:3000');
    r.cookies.set("discord", token.access_token);
    return r;*/
    return NextResponse.redirect("http://localhost:3000/");
}

export const config = {
    matcher: '/oauth/(.*)',
};
