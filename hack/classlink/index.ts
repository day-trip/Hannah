import {CookieJar} from "tough-cookie";

const browserFetch = async (url: string, init: RequestInit & {source?: string, cookie?: CookieJar}): Promise<Response & {content: string}> => {
    init.headers = {
        ...(init.headers || {}),
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    };
    if (!init.headers["Referer"] && init.source) {
        init.headers["Referer"] = init.source;
    }
    if (!init.headers["Origin"] && init.source) {
        init.headers["Origin"] = (new URL(init.source)).origin;
    }
    if (init.cookie) {
        init.headers["cookie"] = await init.cookie.getCookieString(init.source || url);
    }
    const r = await fetch(url, init) as Response & {content: string};
    r.content = await r.text();
    if (init.cookie) {
        r.headers.getSetCookie().forEach(cookie => {
            init.cookie.setCookieSync(cookie, init.source || url);
        });
    }
    return r;
}

void (async () => {
})();