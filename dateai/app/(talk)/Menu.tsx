import {AnimatePresence, motion} from "framer-motion";
import {useState} from "react";
import Cookies from "js-cookie";
import { useMotionValue } from "framer-motion";

export default function Menu({login}: {login?: () => void}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const session = Cookies.get("session");

    const buttonX = useMotionValue(0);

    const buttonVariants = {
        closed: { x: 0 },
        open: { x: -5 },
    };

    const svgVariants = {
        closed: { fill: "currentColor" },
        open: { fill: "none" },
    }

    const pathVariants = {
        // closed: { d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" },
        closed: { d: "M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" },
        open: { d: "M6 18L18 6M6 6l12 12" },
    }

    return <>
        <div className={`${login ? "top-3 left-3" : "top-0.5 left-1/2 -translate-x-1/2 md:translate-x-0 md:top-3 md:left-3"} fixed flex items-center gap-1`}>
            {session && <>
                <motion.button variants={buttonVariants} transition={{duration: 0.2}} style={{x: buttonX}} animate={menuVisible ? "open" : "closed"} onClick={() => setMenuVisible(!menuVisible)} className="w-8 h-8 flex justify-center items-center">
                    <motion.svg variants={svgVariants} animate={menuVisible ? "open" : "closed"} transition={{duration: 0.2}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-8 h-8 text-rose-400`}>
                        <motion.path variants={pathVariants} animate={menuVisible ? "open" : "closed"} transition={{duration: 0.2}} strokeLinecap="round" strokeLinejoin="round" /> :
                    </motion.svg>
                </motion.button>
                <AnimatePresence>
                    {menuVisible && <motion.button initial={{opacity: 0.15, scale: 0.15}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0}} transition={{duration: 0.1, delay: 0}} onClick={() => setMenuVisible(false)} className="w-9 h-9 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                    </motion.button>}
                </AnimatePresence>
                <AnimatePresence>
                    {menuVisible && <motion.button initial={{opacity: 0.15, scale: 0.15}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0}} transition={{duration: 0.1, delay: 0.05}} onClick={() => setMenuVisible(false)} className="w-9 h-9 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-rose-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                    </motion.button>}
                </AnimatePresence>
                <AnimatePresence>
                    {menuVisible && <motion.button initial={{opacity: 0.15, scale: 0.15}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0}} transition={{duration: 0.1, delay: 0.1}} onClick={() => {setMenuVisible(false)}} className="w-9 h-9 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </motion.button>}
                </AnimatePresence>
            </>}
            {login && <motion.button onClick={login} className="w-9 h-9 flex justify-center items-center">
                <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-9 h-9 text-rose-400`}>
                    <motion.path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </motion.svg>
            </motion.button>}
        </div>
    </>
}
