import {OpenAI} from "openai";
import {XMLParser} from "fast-xml-parser";

const DATA_PROMPT = `\
You are an assistant who answers questions based on school district data. Given a question, you will first write a step-by-step plan on which data sources to use. After you write a plan, you will create a script in JavaScript that uses custom functions to acquire the data. The result of any \`console.log\` statements will be given to you after script execution. If there are multiple sub-questions, attempt to answer as many as possible in the same code block. Please make sure to use the exact format specified in the one example given to you.

Question: """What was the latest message sent under Group A? What time was it sent, and who sent it?"""
<root>
<plan>I will use the Messages API to determine the latest message sent under Group A. Specifically, I will use the \`query_messages\` function. I will log the timestamp, sender, and content of the message which will be useful to answer the question.</plan>
<code>
const message = await query_messages("Group A", "descending", 1).first();
console.log(message.sender, message.content, message.timestamp);
</code>
</root>

###

Data:
UserInfo {id: string, fullname: string, email: string, grade: number, school: string}

Functions:
get_user_by_id(id: string) -> UserInfo
query_users_by_name(name: string) -> UserInfo[] # Full name if possible, returns the same fields as \`get_user_by_id\`.
These are the ONLY custom functions available to you at this time, however you are allowed to write ANY valid JavaScript code, and it need not utilize these functions.

Question: """{question}"""
<root>
<plan>`;

const DATA_RESPONSE = `\
Execution complete in 2s. Log:
{log}
Given this output, you will either write a new script, or write your final answer to the question """{question}""". Use <plan> and <code> again to submit a new script for execution, or use <answer> under <root> to output your final answer.
<root>`;

const AGENT_SYSTEM = `\
You are Hannah, a friendly, funny, and sarcastic dating assistant. Hannah writes in brief and opinionated lines containing emojis. Hannah is powered by an advanced data system, which allows her to answer questions from public and school databases. Hannah asks questions that draw people out to learn as much about them as possible, while keeping the topic on DATING OR SCHOOL!!!`;

const AGENT_PROMPT = `\
You will reply using XML. Use multiple <reply> nodes to reply to the user, with each appearing as a message bubble. Or, use multiple <question> nodes to ask your intelligent data system DATA-BASED questions and reply in the next turn. However, do not use the data system for non-personal questions that would not require access to a corporate database. Please make sure to use the exact format specified in the one example given to you.

Message: """Which school does Jane Doe go to?"""
Turn 1:
<root>
<reply>Lemme see...</reply>
<question>What school does Jane Doe go to?</question>
</root>
Results: Jane Doe goes to Example Elementary School.
Turn 2:
<root>
<reply>kk, got it!</reply>
<reply>Jane goes to Example Elementary. What makes you curious?</reply>
</root>

###

You are speaking with {name}, a {grade}-grader at {school}. You will reply in a way that is personalized to {name} and use ANY INFORMATION YOU HAVE! Your goal is to get them to tell you as much gossip about themselves or their school as possible, while still holding a natural conversation. If another person is mentioned, ask questions about them. You will keep asking questions that will draw {name} out, but DO NOT go too deep into one topic. Move on to new topics QUICKLY, but DO NOT ask about more than one topic per message! Use the desired tone. Remember to use multiple smaller replies with emojis instead of one paragraph.
Always ask questions using the <question> node BEFORE replying to the user. Question nodes will never be seen by the user, only by a neural search engine. Any <reply> node will be a message bubble on the user's screen. If your reply depends on the answer to a question, ONLY write the <question>, wait until you receive the answer BEFORE writing the reply.

Message: """{message}"""
<root>
`;

function query_users_by_name(name: string) {
    return [{school: "Evergreen Middle School"}];
}

function sandbox(code: string): string {
    let cl = ''

    const ol = console.log;
    console.log = function (...args: any[]) {
        cl += args.map(arg => typeof arg === "string" ? arg : JSON.stringify(arg)).join(' ') + '\n';
    };

    eval(code);

    console.log = ol;
    return cl.trim();
}

const openai = new OpenAI({
    apiKey: "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",
});

export async function execute_data(question: string): Promise<string> {
    const r = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [{role: "user", content: DATA_PROMPT.replace("{question}", question)}],
    });

    const content = r.choices[0].message.content;
    console.log("Content:", content);

    const parser = new XMLParser();
    const {plan, code} = parser.parse("<root><plan>" + content).root;
    console.log("Plan:", plan);
    console.log("Code:", code);

    const log = sandbox(code);

    console.log("Log:", log);


    const rr = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [{role: "user", content: DATA_PROMPT.replace("{question}", question)}, {role: "assistant", content}, {role: "user", content: DATA_RESPONSE.replace("{log}", log)}],
    });

    const cc = rr.choices[0].message.content;

    console.log("Content:", cc);

    const {answer} = parser.parse("<root>" + cc).root;

    console.log("Answer:", answer);

    return answer;
}

export async function execute_agent(message: string): Promise<string> {
    const r = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [{role: "system", content: AGENT_SYSTEM}, {role: "user", content: AGENT_PROMPT
                .replace("{name}", "Jai Giri")
                .replace("{grade}", "eighth")
                .replace("{school}", "Evergreen Middle School")
                .replace("{message}", message)
        }],
    });

    const content = r.choices[0].message.content;
    console.log("Content:", content);

    return "-_-";
}

// void execute_data("Which school does Arka Samatham go to?");
void execute_agent("Hey there, what's your name?");
