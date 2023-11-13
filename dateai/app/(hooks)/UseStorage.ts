import {Dispatch, SetStateAction, useEffect, useState} from "react";

export default function useStorage<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>((localStorage[key]) ? JSON.parse(localStorage[key]): initial);

    useEffect(() => {
        localStorage[key] = JSON.stringify(state);
    }, [state]);

    return [state, setState];
}
