import {motion, useScroll, useTransform} from "framer-motion";
import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {getUserSuggestions} from "@/app/actions";
import TextareaAutosizeP from 'react-textarea-autosize';
import {useDebouncedCallback} from "use-debounce";
import {FriendData} from "@/app/page";
import {User} from "@/app/(backend)/data";
const TextareaAutosize = motion(TextareaAutosizeP);

const matchWords = (inputString: string, queryString: string): boolean => inputString.toLowerCase().split(" ")[0].startsWith(queryString);
// const matchWords = (inputString: string, queryString: string): boolean => inputString.toLowerCase().split(" ").some(word => word.startsWith(queryString) || word.endsWith(queryString));

export default function MessageInput({disabled, value, setValue, send, condition, placeholder, type = "text"}: {disabled: boolean, value: string, setValue: Dispatch<SetStateAction<string>>, send: () => Promise<void>, condition?: (x: string) => boolean, placeholder: string, type?: string}) {
    const keyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!disabled) {
                void send();
            }
        } else if (e.key === 'Enter' && e.shiftKey) {
            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            setValue(value.substring(0, start) + '\n' + value.substring(end));

            textarea.selectionStart = textarea.selectionEnd = start + 1;

            e.preventDefault();
        }
    };

    return <motion.div className="relative flex w-full sm:w-full px-3 md:px-0 md:w-[38rem] lg:w-[45rem]">
        {/* @ts-ignore */}
        <TextareaAutosize type={type} enterKeyHint="send" autoFocus={true} onKeyDown={keyPress} value={value} onChange={e => (!condition || condition(e.target.value)) && setValue(e.target.value)} className="w-full resize-none transition-shadow text-xl shadow-xl ring-0 hover:ring-1 focus:ring-1 focus:shadow-none hover:shadow-sm pl-4 pr-10 py-2 md:py-3 placeholder-gray-300 focus:placeholder-gray-200 placeholder-opacity-75 rounded-3xl font-playfair ring-rose-300 ring-opacity-50 focus:outline-none bg-white" placeholder={placeholder}/>
        <motion.button initial={{scale: 1}} whileTap={{scale: 0.9}} onClick={() => {!disabled && void send()}} disabled={disabled} className="rounded-full bg-rose-400 hover:bg-rose-500 disabled:bg-[#faf5ea] transition-colors flex justify-center items-center w-9 h-9 absolute bottom-1 md:bottom-2 right-5 md:right-2">
            <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-5 h-5">
                <motion.path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </motion.svg>
        </motion.button>
    </motion.div>
}

export function DoubleMessageInput({disabled, friendData, setFriendData, send, condition, canContinue}: {disabled: boolean, friendData: FriendData, setFriendData: Dispatch<SetStateAction<FriendData>>, send: () => Promise<void>, condition?: (x: string) => boolean, canContinue: boolean}) {
    const nf = canContinue ? "friend2" : "friend1";
    const nd = canContinue ? "date2" : "date1";

    const [value, setValue] = useState(friendData[nf]?.fullname || "");
    const [value1, setValue1] = useState(friendData[nd]?.fullname || "");

    const [focus, setFocus] = useState<number>(-1);
    const [results, setResults] = useState<User[]>([]);

    const [i1v, setI1v] = useState(false);
    const [i2v, setI2v] = useState(false);

    const input1Ref = useRef<HTMLInputElement>(null);
    const input2Ref = useRef<HTMLInputElement>(null);

    const suggestionsRef = useRef<HTMLDivElement>(null);
    const { scrollXProgress } = useScroll({ container: suggestionsRef });
    const f1Opacity = useTransform(scrollXProgress, [0, 0.1], [0, 1])
    const f2Opacity = useTransform(scrollXProgress, [0.9, 1], [1, 0])

    const [canceled, setCanceled] = useState(false);

    const clickName = (user: User) => {
        setFocus(-1);
        if (focus === 0) {
            setFriendData({...friendData, [nf]: user});
            setValue(user.fullname);
            setI1v(true);
            input2Ref.current!.focus();
        } else {
            setFriendData({...friendData, [nd]: user});
            console.log(user);
            setValue1(user.fullname);
            setI2v(true);
            if (i1v) {
                input2Ref.current!.focus();
            } else {
                input1Ref.current!.focus();
            }
        }
    }

    const updateResultsAPI = useDebouncedCallback((text: string) => {
        getUserSuggestions(text).then(x => {
            setResults(x!);
        });
    }, 400);

    useEffect(() => {
        void (async () => {
            if (focus >= 0) {
                const v = (focus === 0 ? value : value1).toLowerCase();
                if (v.length > 0) {
                    setResults(r => r.filter(x => {
                        return x.fullname.toLowerCase().split(" ").some(x => x.startsWith(v.toLowerCase()));
                    }));
                    updateResultsAPI(v);
                } else {
                    setResults([]);
                }
            }
        })();
    }, [value, value1, focus]);

    useEffect(() => {
        if (focus >= 0) {
            setCanceled(value === "cancel" || value1 === "cancel");
            const v = (focus === 0 ? value : value1);
            const x = (focus === 0 ? setI1v : setI2v);
            const ui = results.find(i => v === i.fullname);
            x(!!ui);
            if (ui) {
                setFriendData({...friendData, [focus === 0 ? nf : nd]: ui});
            }
        }
    }, [results, value, value1, focus]);

    return <>
        <motion.div className="flex w-full sm:w-full px-5 md:px-0 md:w-[38rem] lg:w-[45rem]">
            <motion.div style={{opacity: f1Opacity}} initial={{opacity: 0}} className="w-8 -mr-8 bg-gradient-to-r from-amber-50 to-white/0 z-[100]"></motion.div>
            <motion.section ref={suggestionsRef} className="flex-1 flex gap-2 overflow-x-auto py-1 px-1 flex-nowrap relative">
                {results && focus >= 0 && (results.length > 1 || !(focus === 0 ? i1v : i2v)) && <>
                    {results.map((result, i) => <motion.div onClick={() => {clickName(result)}} initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1, delay: i * 0.075}} key={i} className="py-1 px-2 rounded-md bg-amber-100 font-playfair whitespace-nowrap cursor-pointer hover:bg-amber-200 pointer-events-auto">{result.fullname}</motion.div>)}
                </>}
            </motion.section>
            <motion.div style={{opacity: f2Opacity}} initial={{opacity: 1}} className="w-8 -ml-8 bg-gradient-to-l from-amber-50 to-white/0 z-[100]"></motion.div>
        </motion.div>
        <motion.div className="flex w-full sm:w-full px-3 md:px-0 md:w-[38rem] lg:w-[45rem]">
            <motion.div className="w-full flex rounded-3xl transition-shadow shadow-xl hover:shadow-sm group focus:shadow-none">
                <motion.input ref={input1Ref} enterKeyHint="send" autoComplete="off" autoCorrect="off" autoCapitalize="on" onFocus={() => {setFocus(0)}} type="text" autoFocus={true} onKeyDown={e => e.key === "Enter" && ((!disabled && i1v && i2v) || canceled) && (e.preventDefault(), void send())} value={value} onChange={e => (!condition || condition(e.target.value)) && setValue(e.target.value)} className="w-full bg-white box-border text-xl ring-0 hover:ring-1 focus:ring-1 px-4 py-3 placeholder-gray-300 focus:placeholder-gray-200 placeholder-opacity-75 rounded-l-3xl font-playfair ring-rose-300 ring-opacity-50 focus:outline-none" placeholder="Friend (eg John)"/>
                <motion.input ref={input2Ref} enterKeyHint="send" autoComplete="off" autoCorrect="off" autoCapitalize="on" onFocus={() => {setFocus(1)}} type="text" autoFocus={false} onKeyDown={e => e.key === "Enter" && ((!disabled && i1v && i2v) || canceled) && (e.preventDefault(), void send())} value={value1} onChange={e => (!condition || condition(e.target.value)) && setValue1(e.target.value)} className="w-full bg-white box-border border-l-[1px] border-rose-500 border-opacity-50 text-xl ring-0 hover:ring-1 focus:ring-1 px-4 py-3 placeholder-gray-300 focus:placeholder-gray-200 placeholder-opacity-75 rounded-r-3xl font-playfair ring-rose-300 ring-opacity-50 focus:outline-none" placeholder="Should date (eg Mary)"/>
            </motion.div>
            <motion.button onClick={() => {!disabled && ((!disabled && i1v && i2v) || canceled) && void send()}} disabled={(disabled || !i1v || !i2v) && !canceled} className="rounded-full bg-rose-400 hover:bg-rose-500 disabled:bg-[#faf5ea] transition-colors flex justify-center items-center w-9 h-9 -ml-12 mt-2">
                <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-5 h-5">
                    <motion.path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </motion.svg>
            </motion.button>
        </motion.div>
    </>
}
