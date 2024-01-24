import {ForwardedRef, forwardRef} from "react";
import {motion} from "framer-motion";
import {ProfilePicturesBucket} from "@/app/(backend)/backend";
import {LinkIcon, UsersIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {createRichAssistantMessage} from "@/app/(talk)/Message";
import {TeamsUserInfo} from "@/app/(backend)/microsoft/teams";
import {useRouter} from "next/navigation";
import {User} from "@/app/(backend)/data";

type AccountConnection = {
    id: string;
    name: string;
    url: string;
};

const CONNECTIONS: AccountConnection[] = [
    {id: "discord", name: "Discord", url: "https://discord.com/api/oauth2/authorize?client_id=1173859491775791186&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fdiscord&response_type=code&scope=identify%20email%20connections%20gdm.join%20guilds%20messages.read"},
    {id: "snapchat", name: "SnapChat", url: ""},
    {id: "tiktok", name: "TikTok", url: ""},
    {id: "youtube", name: "YouTube", url: ""},
]

const UserModal = forwardRef(({user}: {user: User | false | undefined}, ref: ForwardedRef<HTMLDialogElement>) => {
    const router = useRouter();

    return <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
        {user && <div className="modal-box !rounded-xl !p-0 w-full max-w-full sm:max-w-3xl">
            <div className="relative w-full pt-24 bg-amber-50 rounded-t-xl">
                <motion.img
                    className="absolute bottom-0 translate-y-1/3 left-6 w-[4.75rem] h-[4.75rem] rounded-full border-[4px] border-white"
                    src={ProfilePicturesBucket.getImageURL(user!.id)}
                    alt={`Profile picture for ${user!.fullname}`}/>
            </div>
            <div className="pt-7 px-6">
                <p className="text-2xl text-white font-playfair">{user!.fullname}</p>
                <p className="text-base text-white font-playfair">{user!.email}</p>
            </div>
            <div className="w-full px-6 py-4 rounded-b-xl">
                <p className="font-inter font-semibold flex gap-1 items-center text-lg"><LinkIcon className="w-4 h-4"/> Linked Accounts</p>
                <div className="rounded-md p-3 bg-amber-100 mt-2 mb-4">
                    <p className="text-base font-playfair">Connect these accounts to unlock special features on Hannah.</p>
                    <div className="flex gap-2 pt-2">
                        {CONNECTIONS.map(connection => <div title={connection.name} onClick={() => {router.push(connection.url)}} key={connection.name} className="rounded-md bg-white hover:bg-rose-100 cursor-pointer shadow-sm p-1.5 pointer-events-auto">
                            <img src={"/logos/" + connection.id + ".svg"} alt={connection.name + " logo"} className="w-7 h-7 pointer-events-none"/>
                        </div>)}
                    </div>
                </div>
                <p className="font-inter font-semibold flex gap-1 items-center text-lg"><UsersIcon className="w-4 h-4"/> Friends</p>
                <div className="rounded-md p-3 bg-amber-100 mt-2">
                    {/*<p className="text-base font-playfair" onClick={() => {
                        setMessages([...messages, createRichAssistantMessage("daily_question", {question: "Which is your favorite app for chatting with your friends?", choices: ["Discord", "Snapchat", "Whatsapp"]})]);
                    }}>test</p>*/}
                    <p>Test (disabled for now).</p>
                </div>
            </div>
            <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 active:ring-0 active:outline-none focus:ring-0 focus:outline-none"><XMarkIcon className="w-5 h-5 text-black"/></button>
            </form>
        </div>}
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
});

export default UserModal;