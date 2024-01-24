import {TeamsUserInfo} from "@/app/(backend)/microsoft/teams";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {getUser} from "@/app/actions";
import {User} from "@/app/(backend)/data";

export default function useUser(): [User | false | undefined, () => Promise<void>] {
    const [user, setUser] = useState<User | false | undefined>(undefined);

    const refresh = async () => {
        if (!localStorage.uid || !localStorage.session) {
            setUser(false);
            return;
        }
        const x = await getUser(localStorage.uid, localStorage.session);
        if (x === null) {
            setUser(false);
            return;
        }
        console.log(x);
        setUser(x);
    }

    useEffect(() => {
        if (user === undefined) {
            void refresh();
        }
    }, [user]);
    return [user, refresh];
}
