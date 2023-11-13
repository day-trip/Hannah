import * as fs from "fs";
import {CryptoProvider, Configuration, LogLevel, PublicClientApplication} from "@azure/msal-node";
import { JSDOM, ResourceLoader, AbortablePromise, FetchOptions } from "jsdom";

const config: Configuration = {
    auth: {
        clientId: "5e3ce6c0-2b1f-4285-8d4b-75ee78787346",
        authority: "https://login.microsoftonline.com/1fd4673f-df96-4621-8638-a1d88c4c85d7"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel: LogLevel, message: string, containsPii: boolean) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: LogLevel.Verbose,
        }
    }
};

const INJECT = `\
window.addEventListener('load', (event) => {
  setTimeout(() => {
      console.log('Hello World');
      console.log(window.ko.dataFor(document.getElementById("ftrPrivacy")));
      // console.log(document.getElementById("i0116"));
      console.log(document.body.children.length);
      console.log(document.body.children[1].children[0].attributes);
      console.log(document.body.children[1].children[0].children[0].children.length);
  }, 5000);
});\
`; // TODO: inline JS code and go knockoutin' crazy

const pca = new PublicClientApplication(config);

const cryptoProvider = new CryptoProvider();

(async () => {
    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
    const url = await pca.getAuthCodeUrl({
        scopes: ["https://api.spaces.skype.com/.default", "openid", "profile", "offline_access"],
        redirectUri: "https://teams.microsoft.com/go",
        codeChallenge: challenge,
        codeChallengeMethod: "S256",
    });

    console.log(verifier, challenge, url);

    /*const page = await fetch(url + "&sso_reload=true", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*!/!*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "upgrade-insecure-requests": "1",
            "cookie": "fpc=As6wdZNeRrlNuwnebMCFHjA; x-ms-gateway-slice=estsfd; stsservicecookie=estsfd; AADSSO=NA|NoExtension; SSOCOOKIEPULLED=1",
            "Referer": url,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });

    let cookies: {buid: string, esctx: string, fpc: string, [key: string]: string} = Object.fromEntries(page.headers.getSetCookie().map((x: string) => x.split(";")[0].split("=")));
    console.log(cookies);
    let [flowKey, flowToken] = Object.keys(cookies).filter(key => key.startsWith("esctx-")).map(x => ([x, cookies[x]]))[0];
    console.log(page.status);

    const text = await page.text();

    fs.writeFileSync("yote.html", text);*/

    /*const dom = new JSDOM(text, {
        runScripts: "dangerously",
        resources: new ResourceLoader({
            userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36`,
            strictSSL: false,
        }),
        url: url + "&sso_reload=true",
        referrer: url,
        contentType: "text/html",
        includeNodeLocations: true, // TODO: disable in production for more performance
    });*/
    const dom = await JSDOM.fromURL(url + "&sso_reload=true", {
        runScripts: "dangerously",
        resources: new ResourceLoader({
            userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36`,
            strictSSL: false,
        }),
        userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36`,
        // referrer: url,
        includeNodeLocations: true, // TODO: disable in production for more performance
    });

    dom.window.eval(INJECT);
    setTimeout(() => {
        fs.writeFileSync("./pirate.html", dom.serialize());
        console.log(dom.window.console.messages);
    }, 5000);
})();
