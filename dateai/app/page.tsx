"use client";
import {useCallback, useEffect, useRef, useState} from "react";
import {motion} from 'framer-motion';
import FullDiv from "react-div-100vh";
import {
    checkReason,
    getMessages,
    getUserInfo,
    loginUser,
    sendChatMessage,
    initiateRegisterProcess,
    registerUser
} from "@/app/actions";
import {
    EMAIL_ASK,
    EMAIL_FAIL,
    EMAIL_RETRY,
    EMAIL_SUCCEED,
    FRIEND_A_1,
    FRIEND_A_2,
    FRIEND_U_1, FRIENDS_ASK, SCHOOL_RETRY,
    INITIAL, SCHOOL,
    VERIFY_FAIL,
    VERIFY_SUCCEED, LOGIN_ASK, LOGIN_FAIL, LOGIN_RETRY, LOGIN_SUCCEED, REASON_RETRY
} from "@/app/(talk)/prompts";
import Menu from "@/app/(talk)/Menu";
import MessageInput, {DoubleMessageInput, SchoolInput} from "@/app/(talk)/MessageInput";
import useStorage from "@/app/(hooks)/UseStorage";
import {ProfilePicturesBucket} from "@/app/(backend)/backend";
import {ClientMessage, createAssistantMessage, createUserMessage} from "@/app/message";
import Cookies from "js-cookie";
import useUser from "@/app/(hooks)/UseUser";
import Image from "next/image";

export const SCHOOLS = [
    "Alcott Elementary",
    "Audubon Elementary",
    "Bell Elementary",
    "Blackwell Elementary",
    "Carson Elementary",
    "Clara Barton Elementary",
    "Community School",
    "Dickinson Elementary",
    "Discovery Elementary",
    "Einstein Elementary",
    "Ella Baker Elementary",
    "Emerson K-12",
    "Explorer Community School",
    "Franklin Elementary",
    "Frost Elementary",
    "Juanita Elementary",
    "Keller Elementary",
    "Kirk Elementary",
    "Lakeview Elementary",
    "Mann Elementary",
    "McAuliffe Elementary",
    "Mead Elementary",
    "Muir Elementary",
    "Redmond Elementary",
    "Rockwell Elementary",
    "Rosa Parks Elementary",
    "Rose Hill Elementary",
    "Rush Elementary",
    "Sandburg Elementary",
    "Smith Elementary",
    "Thoreau Elementary",
    "Twain Elementary",
    "Wilder Elementary",
    "Environmental Middle",
    "Evergreen Middle",
    "Finn Hill Middle",
    "Inglewood Middle",
    "Kamiakin Middle",
    "Kirkland Middle",
    "Northstar Middle",
    "Redmond Middle",
    "Renaissance Middle",
    "Rose Hill Middle",
    "Stella Schola Middle",
    "Timberline Middle",
    "Eastlake High",
    "Emerson High",
    "Futures School",
    "International",
    "Juanita High",
    "Lake Washington High",
    "Redmond High",
    "Tesla STEM High",
    "WANIC High"
];

const OBF = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`;

export type FriendData = {
    friend1: string;
    date1: string;
    reason1: string;
    friend2: string;
    date2: string;
    reason2: string;
}

const checkJunk = (text: string): boolean => {
    return !(text.length > 7 && text.split(' ').length > 3);
}

export default function Talk() {
    const [user, refreshUser] = useUser();

    const [messages, setMessages] = useStorage<ClientMessage[]>("messages", [{content: INITIAL, role: "assistant", timestamp: Date.now()}]);
    const [state, setState] = useStorage<number>("stage", 1);

    const [message, setMessage] = useState<string>("");
    const [message1, setMessage1] = useState<string>("");
    const [canContinue, setCanContinue] = useStorage<boolean>("continue", false);

    const [friendData, setFriendData] = useStorage<FriendData | null>("f-data", null);

    const [glitch, setGlitch] = useState("");

    const [typing, setTyping] = useState<boolean>(false);

    const scroller = useRef<HTMLDivElement>();

    useEffect(() => {
        const x = setInterval(() => {
            setGlitch(Array.from({ length: 8 }, () => OBF[Math.floor(Math.random() * OBF.length)]).join(''));
        }, 400);
        return () => {
            clearInterval(x);
        }
    }, []);

    useEffect(() => {
        void (async () => {
            if (user) {
                setMessages((await getMessages())!);
            }
        })();
    }, [user]);

    useEffect(() => {
        if (scroller.current) {
            scroller.current!.scrollTop = scroller.current!.scrollHeight;
        }
    }, [messages, scroller]);

    const submitSchool = useCallback(async () => {
        setMessage("");
        Cookies.set("school", btoa(message), {expires: 365});
        setMessages([...messages, createUserMessage(SCHOOL.replace("{school}", message)), createAssistantMessage(FRIENDS_ASK)]);
        setState(1);
    }, [message, messages]);

    const submitMessage = async () => {
        if (!user) {
            console.log("no user");
            return;
        }
        setTyping(true);
        const msg: ClientMessage = {role: "user", content: message, timestamp: Date.now(), deletable: true, pii: true};
        const m: ClientMessage[] = [...messages, msg];
        setMessage("");
        setMessages(m);
        const response = await sendChatMessage(user, messages, msg);
        setMessages([...m, {role: "assistant", content: response, timestamp: Date.now()}]);
        setTyping(false);
    }

    const submitNames = async () => {
        setMessage("");
        setMessage1("");
        if (message === "cancel" || message1 === "cancel") {
            setMessages([...messages, createUserMessage("cancel"), createAssistantMessage(SCHOOL_RETRY)]);
            setState(1);
            return;
        }
        setMessages([...messages, createUserMessage(FRIEND_U_1.replace("{friend}", message).replace("{date}", message1)), createAssistantMessage(FRIEND_A_1.replace("{friend}", message).replace("{date}", message1))]);

        setState(2);
    }

    const submitReason = async () => {
        setMessage("");
        setMessages([...messages, createUserMessage(message)]);
        setTyping(true);
        if (!await checkReason(message)) {
            setMessages([...messages, createUserMessage(message), createAssistantMessage(REASON_RETRY)]);
            setTyping(false);
            return;
        }
        if (canContinue) {
            setMessages([...messages, createUserMessage(message), createAssistantMessage(EMAIL_ASK)]);
            setState(3);
        } else {
            setMessages([...messages, createUserMessage(message), createAssistantMessage(FRIEND_A_2)]);
            setState(1);
            setCanContinue(true);
        }
        setTyping(false);
    }

    const submitEmail = async () => {
        const m: ClientMessage[] = [...messages, {role: "user", timestamp: Date.now(), content: message}];
        setMessage("");
        setMessages(m);
        const n = await getUserInfo(message);
        if (n === null) {
            setMessages([...m, {role: "assistant", timestamp: Date.now(), content: EMAIL_FAIL}]);
            return;
        }

        console.log(n);

        await initiateRegisterProcess(message);

        setMessages([...m, {role: "assistant", timestamp: Date.now(), content: EMAIL_SUCCEED.replace("{name}", n.firstName.split(" ")[0]).replace("{date}", "{date}").replace("{reason}", "you both like badminton")}]);
        setState(4);
    }

    const sendVerificationCode = async () => {
        setMessage("");
        if (message === "idk") {
            setMessages([...messages, {role: "user", timestamp: Date.now(), content: "idk"}, {role: "assistant", timestamp: Date.now(), content: EMAIL_RETRY}])
            setState(3);
            return;
        }
        const m: ClientMessage[] = [...messages, {role: "user", timestamp: Date.now(), content: message}];
        setMessages(m);
        const x = await registerUser(message, friendData, messages);
        if (x) {
            void refreshUser();
            if (x.verified) {
                setMessages([]);
            } else {
                setMessages([...m, {role: "assistant", timestamp: Date.now(), content: VERIFY_SUCCEED.replace("{name}", x.firstName)}]);
            }
            setState(5);
        } else {
            setMessages([...m, {role: "assistant", timestamp: Date.now(), content: VERIFY_FAIL}]);
        }
    }

    const login = () => {
        setMessage("");
        setMessage1("");
        setMessages([...messages, createUserMessage("I want to login."), createAssistantMessage(LOGIN_ASK)]);
        setState(-2);
    }

    const submitLogin = async () => {
        setMessage("");
        if (message === "cancel") {
            setMessages([...messages, createUserMessage(message), createAssistantMessage(LOGIN_RETRY)]);
            setState(1);
            return;
        }
        setMessages([...messages, createUserMessage(message)]);
        if (await loginUser(message)) {
            setMessages([...messages, createUserMessage(message), createAssistantMessage(LOGIN_SUCCEED)]);
            setState(4);
            return;
        }
        setMessages([...messages, createUserMessage(message), createAssistantMessage(LOGIN_FAIL)]);
    }

    return <>
        <FullDiv className="flex flex-col">
            <div ref={scroller} className={`flex flex-1 w-full justify-center overflow-y-auto mb-3 md:mb-7 ${(state < 3 && state > -1) || user ? "mt-12" : "mt-0"} md:mt-5`}>
                <div className="relative testbox sm:w-full px-3 md:px-0 md:w-[38rem] lg:w-[45rem]">
                    {messages.map((msg, index) => msg.role === "assistant" ?
                        <div className="relative">
                            <Image src="/hannah.png" width={520} height={516} alt="Profile picture for Hannah" className="absolute -left-16 w-[3.25rem] h-[3.25rem] rounded-full border-[1px] shadow-sm border-amber-50"/>
                            {msg.content.split("\n").map((x, idx) => <motion.p key={index + msg.content + idx} className="font-playfair text-xl mb-3">
                                {x.split(" ").map((y, ii) =>
                                    <motion.span key={ii} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: (idx * 0.9) + (ii * 0.04) }} dangerouslySetInnerHTML={{__html: " " + y.replace("@glitch@", `<span class="w-[4.7rem] inline-block align-middle overflow-hidden">${glitch}</span>`)}}/>
                                )}
                            </motion.p>)}
                        </div> :
                        <div key={index} className="w-full flex justify-end mt-8 mb-6">
                            <motion.div initial={{opacity: 0.25, translateY: "175%"}} animate={{opacity: 1, translateY: "0%"}} transition={{duration: 0.125, ease: "easeIn"}} className="p-3 bg-rose-100 rounded-[10px] w-fit group relative">
                                {msg.content.split('\n').map((x, ii) =>
                                    <motion.p key={ii} className="font-playfair text-xl flex flex-nowrap">{x}</motion.p>
                                )}
                                {user && <motion.img
                                    className="absolute top-1/2 -translate-y-1/2 -right-16 w-[3.25rem] h-[3.25rem] rounded-full border-[1px] shadow-sm border-amber-50"
                                    src={ProfilePicturesBucket.getImageURL(user.id)}
                                    alt={`Profile picture for ${user.firstName} ${user.lastName}`}/>}
                            </motion.div>
                        </div>)}
                    {typing && <div id="wave">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>}
                </div>
            </div>
            <div className="flex flex-col items-center w-full pb-1.5">
                {state === 0 && <SchoolInput disabled={false} value={message} setValue={setMessage} send={submitSchool} placeholder={"Enter your school"}/>}
                {state === 1 && <DoubleMessageInput disabled={message.length < 2 || message1.length < 2} value={message} value1={message1} setValue={setMessage} setValue1={setMessage1} send={submitNames} placeholder="Friend (eg John)" placeholder1="Should date (eg Mary)"/>}
                {state === 2 && <MessageInput disabled={checkJunk(message)} value={message} setValue={setMessage} send={submitReason} placeholder="Because..."/>}
                {state === 3 && <MessageInput disabled={!message.startsWith("s-") || !message.endsWith("@lwsd.org") || message.length <= 12} value={message} setValue={setMessage} send={submitEmail} placeholder="School email"/>}
                {state === 4 && <MessageInput disabled={(message.length !== 4 && !Number.isInteger(message)) && message !== "idk"} value={message} setValue={setMessage} send={sendVerificationCode} placeholder="Code"/>}
                {state === 5 && <MessageInput disabled={message.length === 0} value={message} setValue={setMessage} send={submitMessage} placeholder="Talk to Hannah"/>}
                {state === -2 && <MessageInput disabled={(!message.startsWith("s-") || !message.endsWith("@lwsd.org") || message.length <= 12) && message !== "cancel"} value={message} setValue={setMessage} send={submitLogin} placeholder="School email"/>}
                <p className="text-[0.6rem] md:text-xs text-center text-gray-500 font-semibold mx-5 md:mx-0 mt-2 md:mt-3.5">By messaging Hannah, you are agreeing to her Privacy Policy and these Terms of Service.</p>
            </div>
        </FullDiv>
        <Menu login={(state < 3 && state > -1) ? login : undefined}/>
    </>
}
