"use server";

import OpenAI from "openai";
import Teams, {UserInfo} from "@/app/(backend)/microsoft/teams";
import {Message, MessageType, User} from "@/app/(backend)/backend";
import {cookies} from "next/headers";
import {ClientMessage, createUserMessage} from "@/app/message";
import {generateKnowledge} from "@/app/(backend)/graph/graph";
import prompt from "@/app/(backend)/ai/prompt";
import {FriendData} from "@/app/page";
import {generateRandomCode, hash, timeSinceTimestamp} from "@/app/(backend)/util";
import {VERIFY_SUCCEED} from "@/app/(talk)/prompts";
import cypher from "@/app/(backend)/graph/cypher";
import SES from "@/app/(backend)/aws/SES";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

const SYSTEM = `\
You are Hannah, a helpful dating assistant that responds in an extremely friendly, humorous, and sarcastic tone. Having an attitude is OK, and responses are be opinionated. Use of emojis and brief lines are also encouraged highly.
You are speaking with {name}.
Attempt to ask questions that will draw {name} and let you learn as much about them as possible. Keep the topic focused on DATING OR SCHOOL!!!
`

const TEMPLATE = `\
{name} is a {grade} grader at {school}.
{name}: {msg}
###
Time since last message: {time}.
You will reply in a way that is personalized to them and use ANY INFORMATION YOU HAVE! Your goal is to get them to tell you as much gossip about themselves or their school as possible. If another person is mentioned, ask questions about them. You will keep asking questions that will draw {name} out, but DO NOT go too deep into one topic. Move on to new topics QUICKLY, and DO NOT ask about more than one topic per message! Use the desired tone. DO NOT START EVERY MESSAGE IN THE SAME WAY.
`

const EMAIL_TEMPLATE = `\
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hannah Email Verification</title>
    <style>
        body {
            font-family: "Playfair Display", "Amazon Ember Display", sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .logo {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 30px;
            color: #fb7185;
        }

        .verification-code {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
            color: #333;
        }

        .instructions {
            font-size: 18px;
            color: #555;
            margin-bottom: 40px;
        }
    </style>
</head>

<body>
<div class="container">
    <div class="logo">Hannah</div>
    <div class="verification-code">
        Your Verification Code: <br>
        <span style="color: #f43f5e;">{vcode}</span>
    </div>
    <div class="instructions">Please enter the verification code above to complete your registration.</div>
</div>
</body>

</html>\
`

const GRADES = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

const CHECK_REASON_PROMPT = prompt<{reason: string}, boolean>`\
Does the following reason provided by a user in a text message justify why two people should date each other? You will reply in either "true" or "false" EXACTLY.
"they both like (common interest)" -> true
"it's clear from their behaviour when interacting" -> true
"obviously" -> false
"why not" -> false
"{reason}" ->
`;

const TEAMS = new Teams();
const VERIFICATION_CODE_CLIENT = new SES("jainitaigiri@gmail.com", `\
Hey {name}! Here is your verification code for Hannah:
{code}
If you didn't request this code, please report it at https://hannah.ai/report.
`);

export async function checkReason(reason: string): Promise<boolean> {
    return await CHECK_REASON_PROMPT({reason});
}

/**
 * Handles preprocessing, postprocessing, and inference on gpt-3.5-turbo
 * @param info The info of the requesting user
 * @param messages The existing conversation
 * @param message The new message from the user
 */
export async function sendChatMessage(info: UserInfo, messages: ClientMessage[], message: ClientMessage): Promise<string> {
    let t: number | null = null;
    const l = messages.length;
    const idx = messages.findIndex(x => x.content.endsWith("menu on the top-left."));
    messages = [messages[0], createUserMessage("<login flow omitted>"), ...messages.slice(idx + 1)];
    messages.reverse().forEach(mm => {
        if (mm.role === "user") {
            t = mm.timestamp;
        }
    });
    messages.reverse();
    const tt = t === null ? "N/A" : timeSinceTimestamp(t);
    const grade = GRADES[info.grade - 1];
    const p = TEMPLATE.replaceAll("{name}", info.firstName).replace("{msg}", message.content).replace("{time}", tt).replace("{school}", info.school).replace("{grade}", grade);
    void generateKnowledge(info, messages, message);
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: SYSTEM.replaceAll("{name}", info.firstName) }, ...messages.map(msg => ({role: msg.role, content: msg.content})), {role: "user", content: p}],
        model: 'gpt-3.5-turbo',
        presence_penalty: 0.5,
    });
    const content = chatCompletion.choices[0].message.content!;
    await Message.batchPut([{userId: info.id, order: l, ...message}, {userId: info.id, order: l + 1, role: "assistant", content, pii: true, deletable: true, timestamp: Date.now()}] as MessageType[]);
    return content;
}

export async function getUserInfo(email: string): Promise<UserInfo | null> {
    if (!email.endsWith("@lwsd.org") || !email.startsWith("s-")) {
        return null;
    }
    const user = await User.query("email").eq(email).exec();
    if (user.length === 0) {
        const u = await TEAMS.getUserInfoByEmail(email);
        if (u) {
            // @ts-ignore
            u.verified = false;
            console.log(u);
            await User.create(u);
            cookies().set("user-id", u.id);
        }
        return u;
    }
    cookies().set("user-id", user[0].id);
    return user[0].toJSON() as UserInfo;
}

export async function getUserSuggestions(text: string): Promise<UserInfo[] | null> {
    return await TEAMS.getUserSuggestions(text, "");
}

/**
 * Initiates the process of registering a new user
 * @param email User's email
 */
export async function initiateRegisterProcess(email: string): Promise<boolean> {
    const code = generateRandomCode();
    console.log(code);

    const uid = cookies().get('user-id')?.value;

    if (!uid) {
        return false;
    }

    const user = (await User.query("id").eq(uid).exec())[0];
    user.code = hash(code + "");
    await user.save();

    await VERIFICATION_CODE_CLIENT.sendTextEmail(email, `Your Hannah verification code is ${code}`, {name: user.firstName, code});

    return true;
}

/**
 * Registers a new user or returns `null` on invalid code.
 * @param code Verification code
 * @param friendData Data on friends
 * @param messages Previous user conversation
 */
export async function registerUser(code: string, friendData: FriendData | null, messages: ClientMessage[]): Promise<UserInfo & {verified: boolean} | null> {
    const uid = cookies().get('user-id')?.value;

    if (!uid) {
        return null;
    }

    const user = (await User.query("id").eq(uid).exec())[0];

    if (user.code !== hash(code)) {
        return null;
    }

    cookies().set("session", hash(uid));
    if (!user.verified) {
        await Message.batchPut([...messages, {role: "assistant", timestamp: Date.now(), content: VERIFY_SUCCEED.replace("{name}", user.firstName)}].map((msg, i) => ({...msg, order: i, userId: uid})));
        await cypher(`MERGE (:Person {id: "${user.id}", name: "${user.firstName} ${user.lastName}", email: "${user.email}", grade: ${user.grade}}) MERGE (s:School {name: "${user.school}"}) MERGE (:Person)-[:BELONGS_TO]->(s);`);
    }

    await user.save();
    await Object.defineProperty(user, "verified", {value: true}).save();

    return user.toJSON() as UserInfo & {verified: boolean};
}

/**
 * Attempts to authenticate the current user based on their cookies
 */
export async function getUser(): Promise<UserInfo | null> {
    const uid = cookies().get('user-id')?.value;
    const session = cookies().get('session')?.value;

    if (!uid || !session) {
        return null;
    }

    const user = await User.query("id").eq(uid).exec();

    if (user.length === 0) {
        return null;
    }

    if (hash(uid) !== session) {
        return null;
    }

    return user[0].toJSON() as UserInfo;
}

/**
 * Attempts to download the current user's messages based on their cookies
 */
export async function getMessages(): Promise<ClientMessage[] | null> {
    const uid = cookies().get('user-id')?.value;

    if (!uid) {
        return null;
    }

    return (await Message.query("userId").eq(uid).sort('descending').limit(50).exec()).reverse(); // TODO: fix
}

/**
 * Attempts to log in a user
 * @param email The email to use
 */
export async function loginUser(email: string): Promise<boolean> {
    if (!email.endsWith("@lwsd.org") || !email.startsWith("s-")) {
        return false;
    }
    const user = await User.query("email").eq(email).exec();
    if (user.length === 0 || !user[0].verified) {
        return false;
    }
    cookies().set("user-id", user[0].id);

    const code = generateRandomCode();
    user[0].code = code;
    await user[0].save();

    await VERIFICATION_CODE_CLIENT.sendTextEmail(email, `Your Hannah verification code is ${code}`, {name: user[0].firstName, code});

    return true;
}

