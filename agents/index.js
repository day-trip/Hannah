"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute_agent = exports.execute_data = void 0;
var openai_1 = require("openai");
var fast_xml_parser_1 = require("fast-xml-parser");
var DATA_PROMPT = "You are an assistant who answers questions based on school district data. Given a question, you will first write a step-by-step plan on which data sources to use. After you write a plan, you will create a script in JavaScript that uses custom functions to acquire the data. The result of any `console.log` statements will be given to you after script execution. If there are multiple sub-questions, attempt to answer as many as possible in the same code block. Please make sure to use the exact format specified in the one example given to you.\n\nQuestion: \"\"\"What was the latest message sent under Group A? What time was it sent, and who sent it?\"\"\"\n<root>\n<plan>I will use the Messages API to determine the latest message sent under Group A. Specifically, I will use the `query_messages` function. I will log the timestamp, sender, and content of the message which will be useful to answer the question.</plan>\n<code>\nconst message = await query_messages(\"Group A\", \"descending\", 1).first();\nconsole.log(message.sender, message.content, message.timestamp);\n</code>\n</root>\n\n###\n\nData:\nUserInfo {id: string, fullname: string, email: string, grade: number, school: string}\n\nFunctions:\nget_user_by_id(id: string) -> UserInfo\nquery_users_by_name(name: string) -> UserInfo[] # Full name if possible, returns the same fields as `get_user_by_id`.\nThese are the ONLY custom functions available to you at this time, however you are allowed to write ANY valid JavaScript code, and it need not utilize these functions.\n\nQuestion: \"\"\"{question}\"\"\"\n<root>\n<plan>";
var DATA_RESPONSE = "Execution complete in 2s. Log:\n{log}\nGiven this output, you will either write a new script, or write your final answer to the question \"\"\"{question}\"\"\". Use <plan> and <code> again to submit a new script for execution, or use <answer> under <root> to output your final answer.\n<root>";
var AGENT_SYSTEM = "You are Hannah, a friendly, funny, and sarcastic dating assistant. Hannah writes in brief and opinionated lines containing emojis. Hannah is powered by an advanced data system, which allows her to answer questions from public and school databases. Hannah asks questions that draw people out to learn as much about them as possible, while keeping the topic on DATING OR SCHOOL!!!";
var AGENT_PROMPT = "You will reply using XML. Use multiple <reply> nodes to reply to the user, with each appearing as a message bubble. Or, use multiple <question> nodes to ask your intelligent data system DATA-BASED questions and reply in the next turn. However, do not use the data system for non-personal questions that would not require access to a corporate database. Please make sure to use the exact format specified in the one example given to you.\n\nMessage: \"\"\"Which school does Jane Doe go to?\"\"\"\nTurn 1:\n<root>\n<reply>Lemme see...</reply>\n<question>What school does Jane Doe go to?</question>\n</root>\nResults: Jane Doe goes to Example Elementary School.\nTurn 2:\n<root>\n<reply>kk, got it!</reply>\n<reply>Jane goes to Example Elementary. What makes you curious?</reply>\n</root>\n\n###\n\nYou are speaking with {name}, a {grade}-grader at {school}. You will reply in a way that is personalized to {name} and use ANY INFORMATION YOU HAVE! Your goal is to get them to tell you as much gossip about themselves or their school as possible, while still holding a natural conversation. If another person is mentioned, ask questions about them. You will keep asking questions that will draw {name} out, but DO NOT go too deep into one topic. Move on to new topics QUICKLY, but DO NOT ask about more than one topic per message! Use the desired tone. Remember to use multiple smaller replies with emojis instead of one paragraph.\nAlways ask questions using the <question> node BEFORE replying to the user. Question nodes will never be seen by the user, only by a neural search engine. Any <reply> node will be a message bubble on the user's screen. If your reply depends on the answer to a question, ONLY write the <question>, wait until you receive the answer BEFORE writing the reply.\n\nMessage: \"\"\"{message}\"\"\"\n<root>\n";
function query_users_by_name(name) {
    return [{ school: "Evergreen Middle School" }];
}
function sandbox(code) {
    var cl = '';
    var ol = console.log;
    console.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        cl += args.map(function (arg) { return typeof arg === "string" ? arg : JSON.stringify(arg); }).join(' ') + '\n';
    };
    eval(code);
    console.log = ol;
    return cl.trim();
}
var openai = new openai_1.OpenAI({
    apiKey: "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",
});
function execute_data(question) {
    return __awaiter(this, void 0, void 0, function () {
        var r, content, parser, _a, plan, code, log, rr, cc, answer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, openai.chat.completions.create({
                        model: "gpt-3.5-turbo-1106",
                        messages: [{ role: "user", content: DATA_PROMPT.replace("{question}", question) }],
                    })];
                case 1:
                    r = _b.sent();
                    content = r.choices[0].message.content;
                    console.log("Content:", content);
                    parser = new fast_xml_parser_1.XMLParser();
                    _a = parser.parse("<root><plan>" + content).root, plan = _a.plan, code = _a.code;
                    console.log("Plan:", plan);
                    console.log("Code:", code);
                    log = sandbox(code);
                    console.log("Log:", log);
                    return [4 /*yield*/, openai.chat.completions.create({
                            model: "gpt-3.5-turbo-1106",
                            messages: [{ role: "user", content: DATA_PROMPT.replace("{question}", question) }, { role: "assistant", content: content }, { role: "user", content: DATA_RESPONSE.replace("{log}", log) }],
                        })];
                case 2:
                    rr = _b.sent();
                    cc = rr.choices[0].message.content;
                    console.log("Content:", cc);
                    answer = parser.parse("<root>" + cc).root.answer;
                    console.log("Answer:", answer);
                    return [2 /*return*/, answer];
            }
        });
    });
}
exports.execute_data = execute_data;
function execute_agent(message) {
    return __awaiter(this, void 0, void 0, function () {
        var r, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openai.chat.completions.create({
                        model: "gpt-3.5-turbo-1106",
                        messages: [{ role: "system", content: AGENT_SYSTEM }, { role: "user", content: AGENT_PROMPT
                                    .replace("{name}", "Jai Giri")
                                    .replace("{grade}", "eighth")
                                    .replace("{school}", "Evergreen Middle School")
                                    .replace("{message}", message)
                            }],
                    })];
                case 1:
                    r = _a.sent();
                    content = r.choices[0].message.content;
                    console.log("Content:", content);
                    return [2 /*return*/, "-_-"];
            }
        });
    });
}
exports.execute_agent = execute_agent;
// void execute_data("Which school does Arka Samatham go to?");
void execute_agent("Hey there, what's your name?");
