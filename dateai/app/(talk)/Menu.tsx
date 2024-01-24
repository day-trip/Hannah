import {AnimatePresence, motion} from "framer-motion";
import {RefObject, useState} from "react";
import Cookies from "js-cookie";
import { useMotionValue } from "framer-motion";
import {Tooltip} from "react-tooltip";
import {ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";

export default function Menu({login, openUserSettings}: {login?: () => void, openUserSettings: RefObject<HTMLDialogElement>}) {
    const [menuVisible, setMenuVisible] = useState(false);

    const pathVariants = {
        closed: {
            d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
            transition: { duration: 0.2 }
        },
        open: {
            d: "M6 18L18 6M6 6l12 12",
            transition: { duration: 0.2 }
        }
    };
    const p1 = "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5";
    const p2 = "M6 18L18 6M6 6l12 12";

    return <>
        <div className="top-[1px] md:top-3 left-3 fixed flex items-center gap-1">
            {localStorage.session && <>
                <motion.button onClick={() => setMenuVisible(!menuVisible)} className="w-8 h-8 flex justify-center items-center">
                    <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-8 h-8 text-rose-400`}>
                        <motion.path d={menuVisible ? p2 : p1} animate={{d: menuVisible ? p2 : p1}} transition={{duration: 0.2}} strokeLinecap="round" strokeLinejoin="round" /> :
                    </motion.svg>
                </motion.button>
                <AnimatePresence>
                    {menuVisible && <motion.button initial={{opacity: 0.15, scale: 0.15}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0}} transition={{duration: 0.1, delay: menuVisible ? 0 : 0.1}} onClick={() => setMenuVisible(false)} className="w-9 h-9 flex justify-center items-center">
                        <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                            <motion.path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </motion.svg>
                    </motion.button>}
                </AnimatePresence>
                <AnimatePresence>
                    {menuVisible && <motion.button initial={{opacity: 0.15, scale: 0.15}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0}} transition={{duration: 0.1, delay: 0.05}} onClick={() => setMenuVisible(false)} className="w-9 h-9 flex justify-center items-center">
                        <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-rose-300">
                            <motion.path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </motion.svg>
                    </motion.button>}
                </AnimatePresence>
                <AnimatePresence>
                    {menuVisible && <motion.button initial={{opacity: 0.15, scale: 0.15}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0}} transition={{duration: 0.1, delay: menuVisible ? 0.1 : 0}} onClick={() => {setMenuVisible(false); openUserSettings.current!.showModal();}} className="w-9 h-9 flex justify-center items-center">
                        <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                            <motion.path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </motion.svg>
                    </motion.button>}
                </AnimatePresence>
            </>}
            {login && <>
                <motion.button id="login-button" onClick={login} className="w-9 h-9 flex justify-center items-center">
                    <ArrowRightOnRectangleIcon className="w-9 h-9 text-rose-400"/>
                </motion.button>
                <Tooltip place="right" content="Sign in" anchorSelect="#login-button" style={{backgroundColor: "rgb(253 230 138)", color: "black", fontFamily: "\"Cambria\", serif", fontSize: "1.15rem", padding: "0.4rem"}} className="bg-amber-200"/>
            </>}
        </div>
    </>
}
