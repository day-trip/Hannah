import * as cookie from "cookie";

const OAUTH = `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`; // TODO: test w/ this new token

const CANARY = `Q6ukUO-lW0Wo70EpeQGwl-AFhk7q0dsYxrNt9T3ucKwvMxz4L-CKqachZNxbqYbe_PVfENtuPrM.`;

const CONN = `fDIuMl4AKbXAed3mqFNu9+XSCBMhB8F5YoDjZX0HF/MAAQAAGR5Rsjn32MhcfAaAU6p6N67mCADdlDDQ9KcmJckp46xzz4C84xOS2rRfp1l+M+vugNOUZ4hj0UoPDD6Az6cw8Dwqkm/I2rYnUtpXePGi3qjC6pZir1qH4O9qRBY76xsrCk/wyapfmyVMdOpCJwc/ENIBJbvwHfAN+sNDMDDoxfnAceF6/rfbXwCkzbmCDSMFtiZIt/l1ArtkL83k5P1wtE1b0yOJhadG8u3opIFKW1EKHyGWZggNsqISLq5VtYtn2H1Zi1X+BfKT9qCsdbgSjEjs1hE9yvoijhxA2xMaB6tYVlvNVv/EYDfqD0fJJi+jlhoGrsrGnTM7elKUsOJDAGAAAAAw9m0ZCmHNC2dFnVHtnoWKPe5ArxStWz5Q4XGzoXuGuAO0c7zI3l2k9ApmwCbWTPnu9X6LCZ/boH04GyyeAgBB5pX76b9FhWfCYYAnAZeSDIAKNd8kBpGSNcRfwrATUKE=`;

const TEST = `155293f2-0e9b-441a-b973-b3cd823c6b0a`


export default class Outlook {
    private static OAUTH_TOKEN: string = OAUTH;
    private static BEARER_TOKEN: string = "";
    private static OWA_CANARY: string = CANARY;
    private static CONNECTION_ID: string = TEST;
    private static CONNECTION_TOKEN: string = CONN;
    private static N: number = 220;

    public static async getOauth(): Promise<[string, string, string, string] | null> {
        try {
            const r = await fetch(`https://outlook.office.com/owa/notificationchannel/negotiate?clientProtocol=1.5&UA=0&cid=7278d18c-1a12-6e8b-bf68-f21e45ada198&X-OWA-CANARY=2pDPuTw6qkq8jVuBbHLRtpDi_Fxr09sYdKaJTG4wOyH-HfsnBb5BWXg11gEnYpmIXliNGz1Tmfk.&app=Mail&connectionToken=${this.CONNECTION_TOKEN}&_=1698023070740`, {
                "headers": {
                    "accept": "text/plain, */*; q=0.01",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "application/json; charset=UTF-8",
                    "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "cookie": `MUID=10E2AE340D8E643A1A33BD9B0CA965E9; ClientId=1C09A6F55B9441C9989CD084F9B0ECD9; OIDC=1; UC=f4e1c9ca6c604dbb8a96bead93c58e45; OWAAppId=00000002-0000-0ff1-ce00-000000000000; as=Y2RgYGAEYmYgZjEysDQAAA; DefaultAnchorMailbox=10037FFE9CE81983@1fd4673f-df96-4621-8638-a1d88c4c85d7; O365Consumer=0; OWAAppIdType=Exchange; RoutingKeyCookie=v2:l%2bkLY5zovqlkRsb%2bLrTpDycUH%2b4Exdmf7lRBj8SEOM8%3d:77f3cd12-778d-4032-9d01-c5260c1a9133@lwsd.org; OptInH=vKi5cb6NHj0eoy7MdKJxIVpBwvFEgqVhI30frOYIPE0; MSFPC=GUID=dcf8f32f8699445bb8a5c15df68f9ff5&HASH=dcf8&LV=202308&V=4&LU=1692476532717; domainName=lwsd.org; SuiteServiceProxyKey=NYZQTFePthE3+C59VDfqUPLlahLE9jjZ4k7C5ipS2AQ=&Bg7bxEGC8TxJtS4qY+XCzw==; OpenIdConnect.token.v1=${this.OAUTH_TOKEN}; X-OWA-CANARY=2pDPuTw6qkq8jVuBbHLRtpDi_Fxr09sYdKaJTG4wOyH-HfsnBb5BWXg11gEnYpmIXliNGz1Tmfk.`
                },
                "referrerPolicy": "no-referrer",
                "body": null,
                "method": "GET"
            });
            const json: {ConnectionToken: string, ConnectionId: string} = await r.json();
            const ck = Object.fromEntries(r.headers.get("set-cookie")!.split('; ').map(x => x.split("=")));
            console.log(JSON.stringify(ck, null, 4));
            // @ts-ignore
            const cook = r.headers.getSetCookie();
            console.log(cook);
            // Oauth, canary, session, connection
            const cookies = cookie.parse(r.headers.get("set-cookie")!);
            console.log(cookies["OpenIdConnect.token.v1"]);
            return [cookies["OpenIdConnect.token.v1"], cookies["X-OWA-CANARY"], json.ConnectionId, json.ConnectionToken];
        } catch (e) {
            console.error("Got exception:");
            console.error(e);
            return null;
        }
    }

    /*public static async getToken(repeat: boolean = true): Promise<string | null> {
        let r: Response;
        try {
            r = await fetch(`https://outlook.office.com/owa/service.svc?action=GetAccessTokenforResource&UA=0&app=Mail&n=${this.N}`, {
                "headers": {
                    "accept": "*!/!*",
                    "accept-language": "en-US,en;q=0.9",
                    "action": "GetAccessTokenforResource",
                    "content-type": "application/json; charset=utf-8",
                    "ms-cv": "/CErqU3tV+GAwJr7ajqDwa.230",
                    "prefer": "exchange.behavior=\"IncludeThirdPartyOnlineMeetingProviders\"",
                    "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-owa-canary": "Q6ukUO-lW0Wo70EpeQGwl-AFhk7q0dsYxrNt9T3ucKwvMxz4L-CKqachZNxbqYbe_PVfENtuPrM.",
                    "x-owa-correlationid": "728b1768-9364-4f71-9bf6-641aeee3b1b5",
                    "x-owa-hosted-ux": "false",
                    "x-owa-sessionid": "63d5d496-dfe2-40dd-9ab1-e8f9d480c390",
                    "x-owa-urlpostdata": "%7B%22__type%22%3A%22TokenRequest%3A%23Exchange%22%2C%22Resource%22%3A%22https%3A%2F%2Foutlook.office.com%2F%22%7D",
                    "x-req-source": "Mail",
                    "cookie": `MUID=10E2AE340D8E643A1A33BD9B0CA965E9; ClientId=1C09A6F55B9441C9989CD084F9B0ECD9; OIDC=1; UC=f4e1c9ca6c604dbb8a96bead93c58e45; domainName=lwsd.org; OWAAppId=00000002-0000-0ff1-ce00-000000000000; as=Y2RgYGAEYmYgZjEysDQAAA; DefaultAnchorMailbox=10037FFE9CE81983@1fd4673f-df96-4621-8638-a1d88c4c85d7; O365Consumer=0; OWAAppIdType=Exchange; RoutingKeyCookie=v2:l%2bkLY5zovqlkRsb%2bLrTpDycUH%2b4Exdmf7lRBj8SEOM8%3d:77f3cd12-778d-4032-9d01-c5260c1a9133@lwsd.org; OptInH=vKi5cb6NHj0eoy7MdKJxIVpBwvFEgqVhI30frOYIPE0; MSFPC=GUID=dcf8f32f8699445bb8a5c15df68f9ff5&HASH=dcf8&LV=202308&V=4&LU=1692476532717; SuiteServiceProxyKey=+sC+Lqce2VorgjDqT9jqmBPV4vJ19DZIh1u5brGVuMk=&nppdplwA8iowjHiOYhl/BQ==; OpenIdConnect.token.v1=${this.OAUTH_TOKEN}; X-OWA-CANARY=Q6ukUO-lW0Wo70EpeQGwl-AFhk7q0dsYxrNt9T3ucKwvMxz4L-CKqachZNxbqYbe_PVfENtuPrM.`
                },
                "referrerPolicy": "no-referrer",
                "body": null,
                "method": "POST"
            });
            this.N++;
            return (await r.json()).AccessToken;
        } catch (e: TypeError | SyntaxError | any) {
            if (e instanceof TypeError && e.message === "fetch failed") {
                console.error("Fetch to Outlook bearer token API failed due to an error on the server.");
                return null;
            }
            if (e instanceof SyntaxError && e.message.includes("JSON")) {
                console.error("Could not parse JSON from Outlook bearer token API! Refreshing OAuth info...");
                console.log(await r!.text());

                if (!repeat) {
                    console.error("Could not refresh oauth token (out of tries)");
                }
                const o = await this.getOauth();
                if (!o) {
                    console.error("Could not refresh oauth token (error).");
                    return null;
                }
                this.OAUTH_TOKEN = o[0];
                this.OWA_CANARY = o[1];
                this.CONNECTION_ID = o[2];
                this.CONNECTION_TOKEN = o[3];
                return this.getToken(false);
            }
            console.log("An unexpected error occured while refreshing the bearer token:");
            console.log(e);
        }
        return null;
    }*/

    public static async getToken(): Promise<string | null> {
        try {
            const r = await fetch("https://outlook.office.com/owa/service.svc?action=GetAccessTokenforResource&UA=0&app=Mail&n=96", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "action": "GetAccessTokenforResource",
                    "content-type": "application/json; charset=utf-8",
                    "ms-cv": "ZNMBmo1qWCIYxotKsayLR8.108",
                    "prefer": "exchange.behavior=\"IncludeThirdPartyOnlineMeetingProviders\"",
                    "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-owa-canary": "JBkFE5cmUUOHIybViBkRi1ByKK6p1dsYg4HfOcZDIad9MzvbmpkYwtdV-4bSsmCaIeZwsYLgPGE.",
                    "x-owa-correlationid": "8bb19d1e-e434-b149-e6ff-bfae71531a4e",
                    "x-owa-hosted-ux": "false",
                    "x-owa-sessionid": "9ea885bc-a268-47c0-8bdf-1c8d670c5fb6",
                    "x-owa-urlpostdata": "%7B%22__type%22%3A%22TokenRequest%3A%23Exchange%22%2C%22Resource%22%3A%22https%3A%2F%2Fpushchannel.1drv.ms%22%7D",
                    "x-req-source": "Mail",
                    "cookie": "ClientId=1C09A6F55B9441C9989CD084F9B0ECD9; OIDC=1; UC=f4e1c9ca6c604dbb8a96bead93c58e45; OWAAppId=00000002-0000-0ff1-ce00-000000000000; as=Y2RgYGAEYmYgZjEysDQAAA; DefaultAnchorMailbox=10037FFE9CE81983@1fd4673f-df96-4621-8638-a1d88c4c85d7; O365Consumer=0; OWAAppIdType=Exchange; RoutingKeyCookie=v2:l%2bkLY5zovqlkRsb%2bLrTpDycUH%2b4Exdmf7lRBj8SEOM8%3d:77f3cd12-778d-4032-9d01-c5260c1a9133@lwsd.org; OptInH=vKi5cb6NHj0eoy7MdKJxIVpBwvFEgqVhI30frOYIPE0; MSFPC=GUID=dcf8f32f8699445bb8a5c15df68f9ff5&HASH=dcf8&LV=202308&V=4&LU=1692476532717; domainName=lwsd.org; MUID=0DC37D72625F6FEB1B9C6EC163C36E58; SuiteServiceProxyKey=Ktuds8sGsvBIoqtL4y194lBJE7WJbkHiJs1NULkc6Pg=&dRKTocvZc1MBZrEGZrNJNQ==; OpenIdConnect.token.v1=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; X-OWA-CANARY=JBkFE5cmUUOHIybViBkRi1ByKK6p1dsYg4HfOcZDIad9MzvbmpkYwtdV-4bSsmCaIeZwsYLgPGE."
                },
                "referrerPolicy": "no-referrer",
                "body": null,
                "method": "POST"
            });
            return (await r.json()).AccessToken;
        } catch (e) {
            return null;
        }
    }

    private static generateRandomHex(length: number): string {
        return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    private static generateRandomUUID(): string {
        return `${Outlook.generateRandomHex(8)}-${Outlook.generateRandomHex(4)}-${Outlook.generateRandomHex(4)}-${Outlook.generateRandomHex(4)}-${Outlook.generateRandomHex(12)}`;
    }
    
    public static async getSuggestions(email: string, retry: boolean = true): Promise<{ EmailAddresses: string[], PeopleType: string, JobTitle: string, PersonId: string, DisplayName: string }[] | null> {
        console.log("bearer: " + this.BEARER_TOKEN);
        let r;
        try {
            const rid = Outlook.generateRandomUUID();
            const cv = `06p/u8DoqxgQmuideTCs2k.${Math.floor(Math.random() * 900) + 100}`;
            r = await fetch(`https://outlook.office.com/search/api/v1/suggestions?scenario=owa.react.compose&setflight=CSRClientEnabled&n=${this.N}&cri=${rid}&cv=${encodeURIComponent(cv)}`, {
                headers: {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "authorization": `Bearer  ${this.BEARER_TOKEN}`,
                    "client-request-id": rid,
                    "client-session-id": "915ff6bf-7cc9-48dc-43b2-5753327473bc",
                    "content-type": "application/json",
                    "ms-cv": cv,
                    "prefer": "exchange.behavior=\"IncludeThirdPartyOnlineMeetingProviders\"",
                    "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-anchormailbox": "PUID:10037FFE9CE81983@1fd4673f-df96-4621-8638-a1d88c4c85d7",
                    "x-client-localtime": new Date(Date.now()).toISOString(),
                    "x-client-version": "20231013005.10",
                    "x-clientid": "1C09A6F55B9441C9989CD084F9B0ECD9",
                    "x-ms-appname": "owa-reactmail",
                    "x-owa-canary": "oxHnL8dFTU6fbB8jjumM7FC2SWPy0NsY3VdeAJav2ihjmeHYPAdq-pUW3M77kuz4zdBIwI8oGzk.",
                    "x-owa-sessionid": "e52e3466-21e7-4ee7-8012-667322a0c963",
                    "x-routingparameter-sessionkey": "PUID:10037FFE9CE81983@1fd4673f-df96-4621-8638-a1d88c4c85d7"
                },
                referrerPolicy: "no-referrer",
                body: JSON.stringify({
                    "AppName": "OWA",
                    "Scenario": {
                        "Name": "owa.react.compose"
                    },
                    "Cvid": "6601314c-c6b5-24d1-81f3-866455488baa",
                    "EntityRequests": [
                        {
                            "Query": {
                                "QueryString": email
                            },
                            "EntityType": "People",
                            "Provenances": [
                                "Mailbox"
                            ],
                            "Size": "5",
                            "Fields": [
                                "Id",
                                "ADObjectId",
                                "DisplayName",
                                "EmailAddresses",
                                "PeopleSubtype",
                                "PeopleType",
                                "PDLItemId",
                                "PersonaId",
                                "ImAddress",
                                "JobTitle",
                                "PersonId",
                                "MRI",
                                "ExternalDirectoryObjectId",
                                "FeatureData"
                            ]
                        }
                    ],
                    "LogicalId": rid
                }),
                method: "POST"
            });
            this.N++;
            return (await r.json()).Groups[0].Suggestions;
        } catch (e: TypeError | SyntaxError | any) {
            if (e instanceof TypeError && e.message === "fetch failed") {
                console.error("Fetch to Outlook suggestions API failed due to an error on the server.");
                return null;
            }
            if (e instanceof SyntaxError && e.message.includes("JSON")) {
                console.error("Could not parse JSON from Outlook suggestions API.");
                if (!retry) {
                    console.error("Could not refresh bearer token (retry limit exceeded).");
                    return null;
                }
                console.log("Refreshing bearer token...");
                const t = await this.getToken();
                if (!t) {
                    console.error("Could not refresh bearer token (error).");
                    return null;
                }
                this.BEARER_TOKEN = t;
                return this.getSuggestions(email, false);
            }
            console.error(`An unknown error occurred (${typeof e}).`);
            console.error(e);
        }
        return null;
    }
}
