import {HTMLProps, ReactNode, useEffect, useState} from "react";

export default function MobileFullscreen({children, ...props}: {children: ReactNode} & HTMLProps<HTMLDivElement>) {
    const [height, setHeight] = useState(window.visualViewport?.height || window.innerHeight);

    useEffect(() => {
        const e = () => {
            setHeight(window.visualViewport?.height || window.innerHeight);
        };
        window.addEventListener("resize", e);
        return () => {
            window.removeEventListener("resize", e);
        }
    }, []);

    return <div style={{height: height + "px"}} {...props}>
        {children}
    </div>
}
