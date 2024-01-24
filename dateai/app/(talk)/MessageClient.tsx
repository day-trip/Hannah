"use client";
import {ReactNode} from "react";
import {motion} from "framer-motion";
import {RICH_MESSAGES, RichMessage} from "@/app/(talk)/Message";

export default class RichMessageRenderer {
    public static init() {

    }

    public static destroy() {

    }

    public static render(message: RichMessage, latest: boolean = false): ReactNode {
        const [_, role, renderer] = RICH_MESSAGES.templates[message.type];
        if (renderer) {
            return renderer(message);
        }
        const m = RICH_MESSAGES.toString(message);

        // " " + y.replace("@glitch@", `<span class="w-[4.7rem] inline-block align-middle overflow-hidden">${glitch}</span>`
        return <>
            {message.role === "assistant" ? m.split("\n").map((x, idx) => <motion.p key={idx} className="font-playfair text-xl mb-3">
                {x.split(" ").map((y, ii) =>
                    <motion.span key={ii} initial={{ opacity: latest ? 0 : 1 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: (idx * 0.9) + (ii * 0.04) }} dangerouslySetInnerHTML={{__html: " " + y}}/>
                )}
            </motion.p>) : m.split('\n').map((x, ii) =>
                <motion.p key={ii} className="font-playfair text-xl flex flex-nowrap">{x}</motion.p>
            )}
        </>
    }
}

RICH_MESSAGES.registerMessageType("daily_question", `\
Question of the day: {question}
Choices: {choices}.
`, "assistant", (message) => {
    const {question, choices} = message.data as {question: string, choices: string[]};

    return <motion.div className="bg-amber-100 rounded-md shadow-sm p-3.5">
        <motion.p className="font-inter text-md text-gray-400 font-semibold mb-0.5">QUESTION OF THE DAY</motion.p>
        <motion.p className="font-playfair text-xl mb-3">{question}</motion.p>
        <motion.div className="mb-3 flex gap-2.5">
            {choices.map(choice => <span className="bg-rose-200 font-playfair rounded-md shadow-sm py-0.5 px-1.5" key={choice}>{choice}</span>)}
        </motion.div>
    </motion.div>
});
