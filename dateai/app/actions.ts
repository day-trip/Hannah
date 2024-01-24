"use server";

import {Message, MessageType} from "@/app/(backend)/backend";
import prompt from "@/app/(backend)/ai/prompt";
import {FriendData} from "@/app/page";
import {generateRandomCode, hash} from "@/app/(backend)/util";
import cypher from "@/app/(backend)/graph/cypher";
import SES from "@/app/(backend)/aws/SES";
import {createRichAssistantMessage, RICH_MESSAGES, RichMessage} from "@/app/(talk)/Message";
import {SCHOOLS} from "@/app/data";
import kx from "knex";
import {User} from "./(backend)/data";

const SYSTEM = `\
You are Hannah, a helpful dating assistant that responds in an extremely friendly, humorous, and sarcastic tone. Having an attitude is OK, and responses are opinionated. Use of emojis and brief sentences split by newlines are also encouraged.
You are speaking with {name}, a {grade}-grader at {school}. The last message was {time}.
Attempt to ask questions that will draw {name} and let you learn as much about them as possible. Keep the topic focused on DATING OR SCHOOL!!! Use tools/functions only when absolutely necessary.
`;

const TEMPLATE = `\
You will reply in a way that is personalized to {name} and use ANY INFORMATION YOU HAVE! Your goal is to get them to tell you as much gossip about themselves or their school as possible, while still holding a natural conversation. If another person is mentioned, ask questions about them. You will keep asking questions that will draw {name} out, but DO NOT go too deep into one topic. Move on to new topics QUICKLY, and DO NOT ask about more than one topic per message! Use the desired tone. DO NOT START EVERY MESSAGE IN THE SAME WAY.
Use tools/functions before replying for more context and knowledge, but don't reply when using a tool. Do not use a tool to find information you already know (eg about {name}). PLEASE MAN, just DONT SPAM TOOL CALLS.
{name}: """
{msg}
"""
`;

const GRADES = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];

const CHECK_REASON_PROMPT = prompt<{reason: string}, boolean>`\
Does the following reason provided by a user in a text message justify why two people should date each other? You will reply in either "true" or "false" EXACTLY.
"they both like (common interest)" -> true
"it's clear from their behaviour when interacting" -> true
"obviously" -> false
"why not" -> false
"{reason}" ->
`;

// const TEAMS = new Teams();
const VERIFICATION_CODE_CLIENT = new SES("jainitaigiri@gmail.com", `\
Hey {name}! Here is your verification code for Hannah:
{code}
If you didn't request this code, please report it at https://hannah.ai/report.
`);

const knex = kx({
    client: 'postgresql',
    connection: {
        host : '127.0.0.1',
        port : 5432,
        user : 'postgres',
        password : 'JaiAvi10:14',
        database : 'postgres'
    },
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: 'knex_migrations'
    }
});

export async function checkReason(reason: string): Promise<boolean> {
    return await CHECK_REASON_PROMPT({reason});
}

/**
 * Handles preprocessing, postprocessing, and inference on gpt-3.5-turbo
 * @param info The info of the requesting user
 * @param messages The existing conversation
 * @param message The new message from the user
 */
export async function sendChatMessage(info: User, messages: RichMessage[], message: RichMessage): Promise<[RichMessage, RichMessage]> {
    /*const lastMessageTime = [...messages].reverse().find(msg => msg.role === "user") ? moment([...messages].reverse().find(msg => msg.role === "user")!.timestamp).fromNow() : "N/A";
    const firstName = info.fullname.split(" ")[0];
    const filteredMessages = [messages[0], createUserMessage("<onboarding flow omitted>"), ...messages.slice(messages.findIndex(x => x.type === "verify_succeed"))];
    const grade = GRADES[info.grade - 1];

    const prompt = TEMPLATE.replaceAll("{name}", firstName).replace("{msg}", RICH_MESSAGES.toString(message)).replace("{time}", lastMessageTime).replace("{school}", SCHOOLS[info.school]).replace("{grade}", grade);
    const system = SYSTEM.replaceAll("{name}", firstName).replace("{time}", lastMessageTime).replace("{school}", SCHOOLS[info.school]).replace("{grade}", grade);

    /!*const r = await fetch("http://127.0.0.1:5555/knowledge/add", {
        method: "post",
        body: JSON.stringify([...messages.map(msg => ({role: msg.role, timestamp: msg.timestamp, content: RICH_MESSAGES.toString(msg)})), {role: "user", timestamp: message.timestamp, content: RICH_MESSAGES.toString(message)}]),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJ1c2VyX2lkIjoiYTQzZWY5ZjctZjZjNS00OGIzLTkwMDctNjY3NWQ5ZWM3MTU4IiwiaGFzaCI6ImQ1MWM2NzA4YWQzNjlkYjEzNzU4OTNjNmJjYzgzYWI1NmRjYzM5NmRiYmNjMjdjNTY4ZDczMGU1NGQ5ZTI5ODgiLCJleHBpcnkiOjEyMzQ1Njc4OTB9"
        },
    });
    console.log(await r.text());*!/

    const msgs: any = [{ role: 'system', content: system }, ...filteredMessages.map(msg => ({role: msg.role, content: RICH_MESSAGES.toString(msg)})), {role: "user", content: prompt}];

    console.log(msgs);

    const chatCompletion = await openai.chat.completions.create({
        messages: msgs,
        model: 'gpt-3.5-turbo-1106',
        // model: "gpt-4-1106-preview",
        presence_penalty: 0.2,
        tools: TOOLS,
        tool_choice: "auto",
    });
    let msg = chatCompletion.choices[0].message;
    if (msg.tool_calls) {
        for (const toolCall of msg.tool_calls) {
            console.log(toolCall);
            if (toolCall.function.name === "query_users_by_name") {
                const {name} = JSON.parse(toolCall.function.arguments);
                const suggestions = await knex.raw(`select * from get_user_by_name('${name}', 3)`);
                console.log(JSON.stringify(suggestions.rows.map((row: User) => ({...row, school: SCHOOLS[row.school]})), null, 2));
                const cc = await openai.chat.completions.create({
                    messages: [...msgs, msg, {role: "tool", tool_call_id: toolCall.id, content: JSON.stringify(suggestions.rows, null, 2)}] as any,
                    model: 'gpt-3.5-turbo-1106',
                    // model: "gpt-4-1106-preview",
                    presence_penalty: 0.2,
                    tools: TOOLS,
                    tool_choice: "auto",
                });
                msg = cc.choices[0].message;
                break
            } else if (toolCall.function.name == "reply_to_user") {
                const {message} = JSON.parse(toolCall.function.arguments);
                await Message.batchPut([RICH_MESSAGES.serialize(message, info, messages.length), RICH_MESSAGES.serialize(createAssistantMessage(message), info, messages.length + 1)] as MessageType[]);
                return message;
            }
        }
    }
    let content = msg.content;
    await Message.batchPut([RICH_MESSAGES.serialize(message, info, messages.length), RICH_MESSAGES.serialize(createAssistantMessage(content!), info, messages.length + 1)] as MessageType[]);
    return content!;*/
    try {
        const r = await fetch("http://127.0.0.1:5555/messages", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJ1c2VyX2lkIjoiYTQzZWY5ZjctZjZjNS00OGIzLTkwMDctNjY3NWQ5ZWM3MTU4IiwiaGFzaCI6ImQ1MWM2NzA4YWQzNjlkYjEzNzU4OTNjNmJjYzgzYWI1NmRjYzM5NmRiYmNjMjdjNTY4ZDczMGU1NGQ5ZTI5ODgiLCJleHBpcnkiOjEyMzQ1Njc4OTB9",
            },
            body: JSON.stringify({
                messages,
                message,
                user: info,
            })
        });
        const data: {user: RichMessage, assistant: RichMessage} = await r.json();

        await Message.batchPut([RICH_MESSAGES.serialize(data.user, info, messages.length), RICH_MESSAGES.serialize(data.assistant, info, messages.length + 1)] as MessageType[]);

        return [data.user, data.assistant];
    } catch (e) {
        return [message, createRichAssistantMessage("server_error")];
    }
}

export async function getUserInfo(email: string): Promise<User | null> {
    if (!email.endsWith("@lwsd.org") || !email.startsWith("s-")) {
        return null;
    }
    return (await knex("user").select("*").where({email}))[0] as User;
}

export async function getUserSuggestions(text: string): Promise<User[] | null> {
    const suggestions = await knex.raw(`select * from get_user_by_name('${text}', 10)`);
    return suggestions.rows;
}

/**
 * Initiates the process of registering a new user
 * @param email User's email
 * @param userId
 */
export async function initiateRegisterProcess(email: string, userId: string): Promise<boolean> {
    const code = generateRandomCode();
    console.log(code);

    const user = await knex("user").where({id: userId}).update({code: hash(code)}, ["fullname"]);

    await VERIFICATION_CODE_CLIENT.sendTextEmail(email, `Your Hannah verification code is ${code}`, {name: user[0].fullname.split(" ")[0], code});

    return true;
}

/**
 * Registers a new user or returns `null` on invalid code.
 * @param code Verification code
 * @param userId Stored `userid`
 * @param friendData Data on friends
 * @param messages Previous user conversation
 */
export async function registerUser(code: string, userId: string, friendData: FriendData, messages: RichMessage[]): Promise<User & {session: string} | null> {
    const user = (await knex("user").select("*").where({id: userId}))[0] as User;

    console.log(user);

    if (user.code !== hash(code)) {
        return null;
    }

    if (!user.verified) {
        await Message.batchPut(messages.map((msg, i) => RICH_MESSAGES.serialize(msg, userId, i)));

        const {friend1: f1, friend2: f2, date1: d1, date2: d2} = friendData;
        await cypher(`\
        MERGE (user:Person {id: "${user.id}", name: "${user.fullname}", email: "${user.email}", grade: ${user.grade}})
        MERGE (s1:School {name: "${SCHOOLS[user.school]}"})
        MERGE (user)-[:BELONGS_TO]->(s1)

        MERGE (f1:Person {id: "${f1!.id}", name: "${f1!.fullname}", email: "${f1!.email}", grade: ${f1!.grade}})
        MERGE (s2:School {name: "${SCHOOLS[f1!.school]}"})
        MERGE (f1)-[:BELONGS_TO]->(s2)

        MERGE (user)-[:FRIENDS_WITH {source_id: "${user.id}"}]->(f1)
        MERGE (f1)-[:FRIENDS_WITH {source_id: "${user.id}"}]->(user)

        MERGE (f2:Person {id: "${f2!.id}", name: "${f2!.fullname}", email: "${f2!.email}", grade: ${f2!.grade}})
        MERGE (s3:School {name: "${SCHOOLS[f2!.school]}"})
        MERGE (f2)-[:BELONGS_TO]->(s3)

        MERGE (user)-[:FRIENDS_WITH {source_id: "${user.id}"}]->(f2)
        MERGE (f2)-[:FRIENDS_WITH {source_id: "${user.id}"}]->(user)
        
        MERGE (f1)-[:FRIENDS_WITH {source_id: "${user.id}"}]->(f2)
        MERGE (f2)-[:FRIENDS_WITH {source_id: "${user.id}"}]->(f1)

        MERGE (d1:Person {id: "${d1!.id}", name: "${d1!.fullname}", email: "${d1!.email}", grade: ${d1!.grade}})
        MERGE (s4:School {name: "${SCHOOLS[d1!.school]}"})
        MERGE (d1)-[:BELONGS_TO]->(s4)

        MERGE (f1)-[:SHOULD_DATE {source_id: "${user.id}"}]->(d1)

        MERGE (d2:Person {id: "${d2!.id}", name: "${d2!.fullname}", email: "${d2!.email}", grade: ${d2!.grade}})
        MERGE (s5:School {name: "${SCHOOLS[d2!.school]}}"})
        MERGE (d2)-[:BELONGS_TO]->(s5)

        MERGE (f2)-[:SHOULD_DATE {source_id: "${user.id}"}]->(d2)\
        `);

        await knex("user").where({id: user.id}).update({verified: true, code: null});
    }

    return {...user, session: hash(user.id)} as User & {session: string};
}

/**
 * Attempts to authenticate the current user based on their cookies
 */
export async function getUser(userId: string, session: string): Promise<User | null> {
    if (hash(userId) !== session) {
        return null;
    }

    return (await knex("user").select("*").where({id: userId}))[0] as User;
}

/**
 * Attempts to download the current user's messages based on their cookies
 */
export async function getMessages(userId: string): Promise<RichMessage[] | null> {
    return (await Message.query("userId").eq(userId).sort('descending').limit(50).exec()).toJSON().map(x => RICH_MESSAGES.deserialize(x as MessageType)).reverse(); // TODO: fix
}

/**
 * Attempts to log in a user
 * @param email The email to use
 */
export async function loginUser(email: string): Promise<User | null> {
    if (!email.endsWith("@lwsd.org") || !email.startsWith("s-")) {
        return null;
    }
    const user = (await knex("user").select("*").where({email}))[0] as User;
    if (!user.verified) {
        return null;
    }

    const code = generateRandomCode();
    console.log(code);
    await knex("user").where({id: user.id}).update({code: hash(code)});

    await VERIFICATION_CODE_CLIENT.sendTextEmail(email, `Your Hannah verification code is ${code}`, {name: user.fullname.split(" ")[0], code});

    return user;
}
