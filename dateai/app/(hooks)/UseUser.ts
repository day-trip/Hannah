import {UserInfo} from "@/app/(backend)/microsoft/teams";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {getUser} from "@/app/actions";

export default function useUser(): [UserInfo | false | undefined, () => Promise<void>] {
    const [user, setUser] = useState<UserInfo | false | undefined>(undefined);

    const refresh = async () => {
        if (!Cookies.get("user-id") || !Cookies.get("session")) {
            setUser(false);
            return;
        }
        const x = await getUser();
        if (x === null) {
            setUser(false);
            return;
        }
        setUser(x);
    }

    useEffect(() => {
        if (user === undefined) {
            void refresh();
        }
    }, [user]);
    return [user, refresh];
}
