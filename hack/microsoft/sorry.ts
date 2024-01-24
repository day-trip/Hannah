import {CryptoProvider, Configuration, LogLevel, PublicClientApplication, AuthorizationCodeRequest, INetworkModule, NetworkRequestOptions, NetworkResponse} from "@azure/msal-node";
import puppeteer from "puppeteer";

type TeamsUser = {
    userLocation: string;
    alias: string;
    mail: string;
    objectType: string;
    sipProxyAddress: string;
    smtpAddresses: string[];
    isSipDisabled: boolean;
    isShortProfile: boolean;
    peopleType: string;
    peopleSubType: string;
    responseSourceInformation: string;
    userPrincipalName: string;
    givenName: string;
    surname: string;
    jobTitle: string;
    department: string;
    email: string;
    userType: string;
    displayName: string;
    type: string;
    mri: string;
    objectId: string;
};

type TeamsSearchResult = {
    type: string;
    value: TeamsUser[];
};

type Response = {
    id: string;
    access: string;
    expiry: number;
}

const SKYPE = `eyJhbGciOiJSUzI1NiIsImtpZCI6IjVFODQ4MjE0Qzc3MDczQUU1QzJCREU1Q0NENTQ0ODlEREYyQzRDODQiLCJ4NXQiOiJYb1NDRk1kd2M2NWNLOTVjelZSSW5kOHNUSVEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE2OTgyNzM3MzQsImV4cCI6MTY5ODI3ODQyOCwic2t5cGVpZCI6Im9yZ2lkOmE0M2VmOWY3LWY2YzUtNDhiMy05MDA3LTY2NzVkOWVjNzE1OCIsInNjcCI6NzgwLCJjc2kiOiIxNjk4MjczNDMzIiwidGlkIjoiMWZkNDY3M2YtZGY5Ni00NjIxLTg2MzgtYTFkODhjNGM4NWQ3IiwicmduIjoiYW1lciIsImFhZF91dGkiOiJ3MHZUdFZBTEFrR2VVZ0o3dE9KN0FBIiwiYWFkX2lhdCI6MTY5ODI3MzQzM30.MxexSkQ9tkpmolk_3cQzYznhrXMfhDxS8ZSbcbqjuY-6Tcwatjt1SjlNUOj0UYmxcYzXjExf-yIRCjR3cfRa5dqgGhboM7bh3YX6OVjnGd_CLiKt7wl760xXxmU_Z7eQTZ9rCMYTLlZkx3ve7QJfkXABQoSwNVGextq3s2ZxAZUxXYowHflTcDg5lVaYCxaH4vsOyQadPuFjpy6CC-lTz43Xb7cZYtaZq-xdv6oHhg5CykuWNKSOrdElM8gUTEPU-c3dbX8jbYLgnEqWZS-NhjgPAaRTskmYeK51sqDE9JeV4zeGBL-VByxFi0rg-QkguL4nwA9s-nGlT9FlhUkTUw`;

class PatchedNetworkClient implements INetworkModule {
    private static readonly ORIGIN = "";

    public async sendGetRequestAsync<T>(url: string, options?: NetworkRequestOptions, cancellationToken?: number): Promise<NetworkResponse<T>> {
        const r = await fetch(url, {method: "GET", headers: {...options.headers, "Origin": PatchedNetworkClient.ORIGIN}});
        return {
            headers: Object.fromEntries(r.headers.entries()),
            body: await r.json(),
            status: r.status,
        };
    }
    public async sendPostRequestAsync<T>(url: string, options?: NetworkRequestOptions): Promise<NetworkResponse<T>> {
        const r = await fetch(url, {method: "POST", body: options.body, headers: {...options.headers, "Origin": PatchedNetworkClient.ORIGIN}});
        return {
            headers: Object.fromEntries(r.headers.entries()),
            body: await r.json(),
            status: r.status,
        };
    }

}

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
        },
        networkClient: new PatchedNetworkClient(),
    }
};

const pca = new PublicClientApplication(config);

const cryptoProvider = new CryptoProvider();

function getQueryParam(url: string, param: string): string {
    param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + param + "=([^&#]*)");
    var results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

(async () => {
    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
    const url = await pca.getAuthCodeUrl({
        scopes: ["https://api.spaces.skype.com/.default", "openid", "profile", "offline_access"],
        redirectUri: "https://teams.microsoft.com/go",
        codeChallenge: challenge,
        codeChallengeMethod: "S256",
    });

    console.log(verifier, challenge, url);

    const browser = await puppeteer.launch({
        headless: "new",
        // defaultViewport: {width: 1080, height: 720},
    });
    const page = await browser.newPage();

    page.setRequestInterception(true);
    page.on('request', async (request) => {
        if (request.url().startsWith("https://teams.microsoft.com/go?code=")) {
            const code = getQueryParam(request.url(), "code");
            const ci = getQueryParam(request.url(), "client_info");
            console.log(request.url());
            console.log("Housten, we got a code: " + code);
            await page.close();
            await browser.close();

            const tokenRequest: AuthorizationCodeRequest = {
                code: code,
                scopes: ["https://api.spaces.skype.com/.default", "openid", "profile", "offline_access"],
                redirectUri: "https://teams.microsoft.com/go",
                codeVerifier: verifier, // PKCE Code Verifier
                clientInfo: ci,
            };

            const tokenData = await pca.acquireTokenByCode(tokenRequest);
            const response: Response = {id: tokenData.idToken, access: tokenData.accessToken, expiry: Math.floor(tokenData.expiresOn.getTime() / 1000)};
            console.log("Response:\n", response);

            const r = await fetch("https://teams.microsoft.com/api/mt/amer/beta/users/searchV2?includeDLs=false&includeBots=true&skypeTeamsInfo=true&source=searchResults&enableGuest=true&includeMTOUsers=false", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": `Bearer ${response.access}`,
                    "clientrequestid": "3e2dcb0d-1d65-4280-9db8-67699e15440b",
                    "content-type": "application/json;charset=UTF-8",
                    "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-ms-serp-correlation-id": "3e2dcb0d-1d65-4280-9db8-67699e15440b",
                    "x-skypetoken": SKYPE,
                    "cookie": `MUID=1AE6E50159A760F52A89F6735DA7669C; MC1=GUID=dcf8f32f8699445bb8a5c15df68f9ff5&HASH=dcf8&LV=202308&V=4&LU=1692476532717; _cs_c=0; at_check=true; IR_gbd=microsoft.com; IR_7593=1697753860190%7C0%7C1697753860190%7C%7C; _tt_enable_cookie=1; _ttp=aZw36Kvt8rxJZi0eIw7oLKwrZM2; AMCVS_EA76ADE95776D2EC7F000101%40AdobeOrg=1; _cs_id=eb7c20d6-2646-a8a9-fabe-3ec00f7b4393.1697753860.1.1697753860.1697753860.1613561419.1731917860487; _cs_cvars=%7B%7D; graceIncr=1; MSCC=NR; msresearch=%7B%22state%22%3A%7B%22name%22%3A%22IDLE%22%7D%2C%22userid%22%3A%221698191020276862661970848679%22%7D; fptctx2=H3ihr9e92IdW6yd1ZgQ9Sz4bj6XMGo9empP83sM5eweFT7rgF6BClkGOoMbV5lk1qCA7IPFTuqQStW7UxedESgL0mY0PZSR2qBB%252fD2ySRHypi08ZmsNip1zfmuLTBsUkTH7KpaQcUlx%252baMIejR8fXH3Bu%252fZvjok7KDEVsPF4XDtYoccrKCyu647ahNzLmBs72MjXpmmStO0z5dG%252bSd04FkmWy3X7G9LyCVFLo2iPa3LNAdcVH0qushmc8EVdV3OQPKaRD1UoTnzm8JmVJDVrs%252fLlwxsypBHd3%252byAbh2REJT1nnFZk%252bbHErsroy47fPZ4zPW7EA0Y4sac%252fd5l4%252bITig%253d%253d; mboxEdgeCluster=34; mbox=PC#f28873a6cfd4459b84a85f750c1725f0.34_0#1700865720|session#8297cc6a301642b69fbdbe606970d2e1#1698275580; AMCV_EA76ADE95776D2EC7F000101%40AdobeOrg=1585540135%7CMCIDTS%7C19655%7CMCMID%7C87913662653605234352589142141325703394%7CMCAAMLH-1698878519%7C9%7CMCAAMB-1698878519%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C-2042935117%7CMCOPTOUT-1698280919s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.0; _uetsid=fa81c0c072c611ee8ec5755b76ecb8d6; _uetvid=510a90a06ecd11eea397d109137af4ef; MUIDB=1AE6E50159A760F52A89F6735DA7669C; TSPREAUTHCOOKIE=true; clocale=en-us; deviceId=cfa355c6-89eb-4726-97f8-9e7a03460a01; firstTimeLaunch=1698273730584; DesiredAuth=msal2_dev3; TSREGIONCOOKIE=amer; platformid_asm=1415; skypetoken_asm=${SKYPE}; authtoken=Bearer%3D${response.access}%26Origin%3Dhttps%3A%2F%2Fteams.microsoft.com; clienttype=web; tenantId=1fd4673f-df96-4621-8638-a1d88c4c85d7; minimumVersionClientUpdateTries=0; ringFinder=%7B%22oid%22%3A%22a43ef9f7-f6c5-48b3-9007-6675d9ec7158%22%2C%22tid%22%3A%221fd4673f-df96-4621-8638-a1d88c4c85d7%22%7D; files-version=23092911200; sessionId=e55540d4-322f-e36c-bff4-8594a2ff0aba`,
                    "Referer": "https://teams.microsoft.com/multi-window/?agent=web&version=23092911205",
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                },
                "body": "s-asamatham@lwsd.org",
                "method": "POST",
            });
            const json = await r.json() as TeamsSearchResult;
            console.log(json);
        } else {
            await request.continue();
        }
    });

    await page.goto(url + "&sso_reload=true");
    // await page.setViewport({width: 1080, height: 720});

    await page.waitForSelector("#i0116");
    await page.type("#i0116", "s-jgiri@lwsd.org");
    await page.click("#idSIButton9");

    await page.waitForTimeout(2700);
    await page.waitForSelector("#i0118");
    await page.type("#i0118", "Dogs(dogs5");
    // await page.waitForTimeout(2000);
    await page.click("#idSIButton9");

    await page.waitForTimeout(1700);
    await page.click("#idSIButton9");
})();
