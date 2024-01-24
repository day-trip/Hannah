"use client";
import {RefObject, useEffect, useRef, useState} from "react";
import {motion, useScroll, useTransform} from 'framer-motion';
import FullDiv from "react-div-100vh";
import {
    checkReason,
    getMessages,
    getUserInfo,
    initiateRegisterProcess,
    loginUser,
    registerUser,
    sendChatMessage
} from "@/app/actions";
import Menu from "@/app/(talk)/Menu";
import MessageInput, {DoubleMessageInput} from "@/app/(talk)/MessageInput";
import useStorage from "@/app/(hooks)/UseStorage";
import {ProfilePicturesBucket} from "@/app/(backend)/backend";
import useUser from "@/app/(hooks)/UseUser";

import {
    createAssistantMessage,
    createRichAssistantMessage,
    createRichUserMessage, createUserMessage,
    RichMessage,
} from "@/app/(talk)/Message";
import RichMessageRenderer from "@/app/(talk)/MessageClient";
import UserModal from "@/app/(backend)/(ui)/UserModal";
import { User } from "./(backend)/data";


const OBF = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`;

export type FriendData = {
    friend1?: User;
    date1?: User;
    reason1?: string;
    friend2?: User;
    date2?: User;
    reason2?: string;
};

const checkJunk = (text: string): boolean => {
    return !(text.length > 7 && text.split(' ').length > 3);
}

export default function Talk() {
    const [user, refreshUser] = useUser();

    const [messages, setMessages] = useStorage<RichMessage[]>("messages", [createRichAssistantMessage("initial")]);
    const [state, setState] = useStorage<number>("stage", 1);

    const [message, setMessage] = useState<string>("");
    const [canContinue, setCanContinue] = useStorage<boolean>("continue", false);

    const [friendData, setFriendData] = useStorage<FriendData>("f-data", {});

    const [glitch, setGlitch] = useState("");

    const [typing, setTyping] = useState<boolean>(false);

    const scroller = useRef<HTMLDivElement>(null);
    const modal = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const e = (e: Event) => {
            e.preventDefault();
        }
        document.body.addEventListener("touchmove", e);
        const x = setInterval(() => {
            setGlitch(Array.from({ length: 8 }, () => OBF[Math.floor(Math.random() * OBF.length)]).join(''));
        }, 400);
        RichMessageRenderer.init();
        return () => {
            clearInterval(x);
            document.body.removeEventListener("touchmove", e);
            RichMessageRenderer.destroy();
        }
    }, []);

    useEffect(() => {
        void (async () => {
            if (user === false && state === 5) {
                setMessages([createRichAssistantMessage("initial")]);
                setState(1);
                return;
            }
            if (!user) {
                return;
            }
            setMessages((await getMessages(user.id))!);
        })();
    }, [user, setMessages]);

    useEffect(() => {
        console.log(friendData);
    }, [friendData]);

    useEffect(() => {
        if (scroller.current) {
            scroller.current!.scrollTop = scroller.current!.scrollHeight;
        }
    }, [messages, scroller]);

    const submitMessage = async () => {
        console.log(user);
        if (!user) {
            console.log("edge case: no user.");
            return;
        }
        setTyping(true);
        const msg = createUserMessage(message);
        setMessage("");
        setMessages([...messages, msg]);
        const [i, o] = await sendChatMessage(user, messages, msg);
        setMessages([...messages, i, o]);
        setTyping(false);
    }

    const submitNames = async () => {
        console.log("IMAGINE!");
        console.log(friendData);
        setMessage("");
        setMessages([...messages, createRichUserMessage("friend_user", {friend: friendData[canContinue ? "friend2" : "friend1"]!.fullname.split(" ")[0], date: friendData[canContinue ? "date2" : "date1"]!.fullname.split(" ")[0]}), createRichAssistantMessage("friend_reason_ask", {friend: friendData[canContinue ? "friend2" : "friend1"]!.fullname.split(" ")[0], date: friendData[canContinue ? "date2" : "date1"]!.fullname.split(" ")[0]})]);

        setState(2);
    }

    const submitReason = async () => {
        setMessage("");
        setMessages([...messages, createUserMessage(message)]);
        setTyping(true);
        if (!await checkReason(message)) {
            setMessages([...messages, createUserMessage(message), createRichAssistantMessage("reason_retry")]);
            setTyping(false);
            return;
        }

        setState(canContinue ? 3 : 1);
        setFriendData({...friendData, [canContinue ? "reason2" : "reason1"]: message});
        setMessages([...messages, createUserMessage(message), createRichAssistantMessage(canContinue ? "email_ask" : "friend_ask")])
        setCanContinue(true);

        setTyping(false);
    }

    const submitEmail = async () => {
        setTyping(true);
        const m = [...messages, createUserMessage(message)];
        setMessage("");
        setMessages(m);
        const n = await getUserInfo(message);
        if (n === null) {
            setMessages([...m, createRichAssistantMessage("email_fail")]);
            setTyping(false);
            return;
        }

        localStorage.uid = n.id;
        await initiateRegisterProcess(message, n.id);

        setMessages([...m, createRichAssistantMessage("email_succeed", {name: n.fullname.split(" ")[0]})]);
        setTyping(false);
        setState(4);
    }

    const sendVerificationCode = async () => {
        setTyping(true);
        setMessage("");
        if (message === "idk") {
            setTyping(false);
            setMessages([...messages, createUserMessage(message), createRichAssistantMessage("email_retry")]);
            setState(3);
            return;
        }
        const m = [...messages, createUserMessage(message)];
        setMessages(m);
        const nm = createRichAssistantMessage("verify_succeed", {date: "<date>", reason: "<reason>"});
        const x = await registerUser(message, localStorage.uid, friendData, [...m, nm]);
        if (x) {
            localStorage.session = x.session;
            setMessages([]);
            void refreshUser(); // Reloads messages from DB
            setState(5);
        } else {
            setMessages([...m, createRichAssistantMessage("verify_fail")]);
        }
        setTyping(false);
    }

    const login = () => {
        setMessage("");
        setMessages([...messages, createUserMessage("I want to login."), createRichAssistantMessage("login_ask")]);
        setState(-2);
    }

    const submitLogin = async () => {
        setMessage("");
        if (message === "cancel") {
            setMessages([...messages, createUserMessage(message), createRichAssistantMessage("login_retry")]);
            setState(1);
            return;
        }
        setMessages([...messages, createUserMessage(message)]);
        const x = await loginUser(message);
        if (x) {
            localStorage.uid = x.id;
            setMessages([...messages, createUserMessage(message), createRichAssistantMessage("login_succeed")]);
            setState(4);
        } else {
            setMessages([...messages, createUserMessage(message), createRichAssistantMessage("login_fail")]);
        }
    }

    return <>
        <FullDiv className="flex flex-col gap-y-2.5">
            <div ref={scroller} className={`flex flex-1 w-full justify-center overflow-y-auto ${(state < 3 && state > -1) || user ? "pt-8" : "pt-0"} md:pt-5`}>
                <div className="relative testbox sm:w-full px-3 md:px-0 md:w-[38rem] lg:w-[45rem]">
                    {messages.map((msg, index) => <MessageUX key={index} message={msg} messages={messages} index={index} user={user} container={scroller}/>)}
                    {typing && <div id="wave">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>}
                </div>
            </div>
            <div className="flex flex-col items-center w-full pb-1.5">
                {state === 1 && <DoubleMessageInput disabled={false} friendData={friendData} setFriendData={setFriendData} send={submitNames} canContinue={canContinue}/>}
                {state === 2 && <MessageInput disabled={checkJunk(message)} value={message} setValue={setMessage} send={submitReason} placeholder="Because..."/>}
                {state === 3 && <MessageInput type={"email"} disabled={!message.startsWith("s-") || !message.endsWith("@lwsd.org") || message.length <= 12} value={message} setValue={setMessage} send={submitEmail} placeholder="School email"/>}
                {state === 4 && <MessageInput disabled={(message.length !== 4 && !Number.isInteger(message)) && message !== "idk"} value={message} setValue={setMessage} send={sendVerificationCode} placeholder="Code"/>}
                {state === 5 && <MessageInput disabled={message.length === 0} value={message} setValue={setMessage} send={submitMessage} placeholder="Talk to Hannah"/>}
                {state === -2 && <MessageInput type={"email"} disabled={(!message.startsWith("s-") || !message.endsWith("@lwsd.org") || message.length <= 12) && message !== "cancel"} value={message} setValue={setMessage} send={submitLogin} placeholder="School email"/>}
                <p className="text-[0.4rem] md:text-xs text-center text-gray-500 font-semibold mx-5 md:mx-0 mt-1.5 md:mt-3.5">By messaging Hannah, you are agreeing to her Privacy Policy and these Terms of Service.</p>
            </div>
        </FullDiv>
        <Menu login={(state < 3 && state > -1) ? login : undefined} openUserSettings={modal}/>
        <UserModal user={user} ref={modal}/>
    </>
}

function MessageUX({message, messages, index, user, container}: {message: RichMessage, messages: RichMessage[], index: number, user: false | User | undefined, container: RefObject<HTMLDivElement>}) {
    const ref = useRef<HTMLDivElement>(null);
    const {scrollYProgress: sYU} = useScroll({target: ref, container, axis: "y", offset: ["center start", "center end"]});
    const opacity = useTransform(sYU, [0, 0.1, 0.2, 0.95, 1], [index === 0 ? 1 : 0, index === 0 ? 1 : 0.3, 1, 1, 0]);
    const scale = useTransform(sYU, [0, 0.05, 0.975, 1], [index === 0 ? 1 : 0.9, 1, 1, 0.9]);

    if (message.role === "assistant") {
        return <motion.div ref={ref} className="relative" style={{opacity, scale}}>
            {RichMessageRenderer.render(message, index === messages.length - 1)}
        </motion.div>
    }
    return <motion.div ref={ref} className="w-full flex justify-end mt-8 mb-6" style={{opacity, scale}}>
            <motion.div initial={{opacity: index === messages.length - 1 ? 0.25 : 0, translateY: index === messages.length - 1 ? "175%" : "0%"}} animate={{opacity: 1, translateY: "0%"}} transition={{duration: 0.125, ease: "easeIn"}} className="p-3 bg-rose-100 rounded-[10px] w-fit group relative">
                {RichMessageRenderer.render(message, index === messages.length - 1)}
                {user && <motion.img
                    className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-16 w-[3.25rem] h-[3.25rem] rounded-full border-[1px] shadow-sm border-amber-50"
                    src={ProfilePicturesBucket.getImageURL(user.id)}
                    alt={`Profile picture for ${user.fullname}`}/>}
            </motion.div>
        </motion.div>
}
