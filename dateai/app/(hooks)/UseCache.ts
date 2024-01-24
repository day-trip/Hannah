import useStorage from "@/app/(hooks)/UseStorage";
import {TeamsUserInfo} from "@/app/(backend)/microsoft/teams";
import {Dispatch, SetStateAction, useEffect} from "react";

export default function useCache<T extends object>(key: string, user: TeamsUserInfo | false | undefined, initial: T, fetcher: () => Promise<T> | T): [T, Dispatch<SetStateAction<T>>] {
    const [cache, setCache] = useStorage<T>(key, initial);

    useEffect(() => {
        if (user === false) {
            setCache(initial);
        }
        if (!user) {
            return;
        }
        const x = fetcher();
        if ("then" in x) {
            x.then(y => {
                setCache(y);
            });
        } else {
            setCache(x);
        }
    }, [user]);

    return [cache, setCache];
}
