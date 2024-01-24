/**
 * An extremely overkill solution for message templating, efficient storage and custom rendering.
 */
import {ReactNode} from "react";
import {MessageType} from "@/app/(backend)/backend";
import * as msgpack from "msgpack-lite";
import {User} from "@/app/(backend)/data";

export type RichMessage = {
    type: string;
    data: Record<string, any>;
    role: "user" | "assistant";
    timestamp: number;
};

export const createUserMessage = (text: string): RichMessage => ({role: "user", timestamp: Date.now(), type: "base", data: {text}});
export const createRichUserMessage = (type: string, data?: Record<string, any>): RichMessage => ({role: "user", timestamp: Date.now(), type: type, data: data || {}});
export const createAssistantMessage = (text: string): RichMessage => ({role: "assistant", timestamp: Date.now(), type: "base", data: {text}});
export const createRichAssistantMessage = (type: string, data?: Record<string, any>): RichMessage => ({role: "assistant", timestamp: Date.now(), type: type, data: data || {}});
export default class RichMessages {
    public readonly templates: Record<string, [string, "user" | "assistant", ((msg: RichMessage) => ReactNode)?]> = {};

    public registerMessageType(name: string, template: string, role: "user" | "assistant", renderer?: (msg: RichMessage) => ReactNode) {
        this.templates[name] = [template, role, renderer];
    }

    public toString(message: RichMessage): string {
        let m = this.templates[message.type][0] + "";
        Object.keys(message.data).forEach(k => {
            m = m.replaceAll("{" + k + "}", message.data[k].toString());
        });
        return m;
    }

    public serialize(message: RichMessage, user: User | string, order: number): MessageType {
        return {userId: typeof user === "string" ? user : user.id, order, role: message.role, timestamp: message.timestamp, content: msgpack.encode({type: message.type, data: message.data}).toString("binary")};
    }

    public deserialize(message: MessageType): RichMessage {
        return {role: message.role, timestamp: message.timestamp, ...(msgpack.decode(Buffer.from(message.content, "binary")))};
    }
}

export const RICH_MESSAGES = new RichMessages();
// Misc
RICH_MESSAGES.registerMessageType("base", "{text}", "user");
RICH_MESSAGES.registerMessageType("base_a", "{text}", "user");

// Login
RICH_MESSAGES.registerMessageType("login_ask", `\
Ok, let's get you signed in! Please tell me your email, or enter "cancel" to go back.\
`, "assistant");
RICH_MESSAGES.registerMessageType("login_fail", `\
Sorry, but that user does not exist... yet. Try another email, or enter "cancel" to go back.\
`, "assistant");
RICH_MESSAGES.registerMessageType("login_retry", `\
Ok, please tell me who you think two of your friends should date and why.\
`, "assistant");
RICH_MESSAGES.registerMessageType("login_succeed", `\
A code has been sent to your email. Please enter it to proceed, or enter "idk" to switch emails.\
`, "assistant");

// Flow
RICH_MESSAGES.registerMessageType("initial", `\
Hey there! ❤️ I'm Hannah, your personal dating assistant.
According to your friends, @glitch@ thinks you're cute. I'll reveal who it is, but first I need you to tell me who you think two of your friends should date and why.\
`, "assistant");
RICH_MESSAGES.registerMessageType("friend_user", `\
{friend} should date {date}.\
`, "user");
RICH_MESSAGES.registerMessageType("friend_ask", `\
Great! Tell me about one more friend.\
`, "assistant");
RICH_MESSAGES.registerMessageType("friend_reason_ask", `\
Why should {friend} date {date}?\
`, "assistant");
RICH_MESSAGES.registerMessageType("reason_retry", `\
My apologies, but I'm pretty sure you can give me a better reason than that.\
`, "assistant");
RICH_MESSAGES.registerMessageType("email_ask", `\
Thanks! 😊 Please tell me your school email so we can return to this conversation later. 📧\
`, "assistant");
RICH_MESSAGES.registerMessageType("email_fail", `\
Sorry! I couldn't find anyone with that email. Maybe there was a typo? 😅 Please reenter.\
`, "assistant");
RICH_MESSAGES.registerMessageType("email_retry", `\
Ok, try another email. 🔁\
`, "assistant");
RICH_MESSAGES.registerMessageType("email_succeed", `\
Hey {name}, great to meet you! 😎 One last thing: just to make sure it's actually you, please tell me the code I sent to your email.
If you'd like to use a different email, enter the code "idk."\
`, "assistant");
RICH_MESSAGES.registerMessageType("verify_fail", `\
It looks like that code is invalid. Try another one, or enter "idk" to use a different email.\
`, "assistant");
RICH_MESSAGES.registerMessageType("verify_succeed", `\
You got it! Your friends said that {date} thinks you're cute, because {reason}.
How's your week been so far? Any exciting news?\
`, "assistant");

// Errors
RICH_MESSAGES.registerMessageType("server_error", `\
I'm so sorry but I can't reply to you right now because of an error on my servers. 😭\
`, "assistant");
