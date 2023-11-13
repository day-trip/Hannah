import {
    CryptoProvider,
    Configuration,
    LogLevel,
    PublicClientApplication,
    AuthorizationCodeRequest,
    INetworkModule,
    NetworkRequestOptions,
    NetworkResponse
} from "@azure/msal-node";
import puppeteer from "puppeteer";
import {Token} from "@/app/(backend)/backend";
import {AnyItem} from "dynamoose/dist/Item";

export type TokenInfo = {
    scopes: string;
    id: string;
    access: string;
    expiry: number;
}

class PatchedNetworkClient implements INetworkModule {
    private static readonly ORIGIN = "";

    public async sendGetRequestAsync<T>(url: string, options?: NetworkRequestOptions, cancellationToken?: number): Promise<NetworkResponse<T>> {
        const r = await fetch(url, {
            method: "GET",
            headers: {...options.headers, "Origin": PatchedNetworkClient.ORIGIN}
        });
        return {
            headers: Object.fromEntries(r.headers.entries()),
            body: await r.json(),
            status: r.status,
        };
    }

    public async sendPostRequestAsync<T>(url: string, options?: NetworkRequestOptions): Promise<NetworkResponse<T>> {
        const r = await fetch(url, {
            method: "POST",
            body: options.body,
            headers: {...options.headers, "Origin": PatchedNetworkClient.ORIGIN}
        });
        return {
            headers: Object.fromEntries(r.headers.entries()),
            body: await r.json(),
            status: r.status,
        };
    }

}

function getQueryParam(url: string, param: string): string {
    param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + param + "=([^&#]*)");
    const results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export default class MicrosoftAuth {
    private readonly pca: PublicClientApplication;
    private readonly cryptoProvider: CryptoProvider;

    private readonly scopes: string[];
    private readonly client_id: string;
    private readonly tenant_id: string;
    private readonly redirect: string;

    constructor(scopes: string[], client_id: string, tenant_id: string, redirect: string) {
        this.scopes = scopes;
        this.client_id = client_id;
        this.tenant_id = tenant_id;
        this.redirect = redirect;
        const config: Configuration = {
            auth: {
                clientId: client_id,
                authority: `https://login.microsoftonline.com/${tenant_id}`
            },
            system: {
                loggerOptions: {
                    loggerCallback(loglevel: LogLevel, message: string, containsPii: boolean) {
                        if (loglevel === 0) {
                            console.error(message);
                        } else if (loglevel === 1) {
                            console.warn(message);
                        }
                    },
                    piiLoggingEnabled: false,
                    logLevel: LogLevel.Verbose,
                },
                networkClient: new PatchedNetworkClient(),
            }
        };

        this.pca = new PublicClientApplication(config);

        this.cryptoProvider = new CryptoProvider();
    }

    public static teams(client_id: string, tenant_id: string): MicrosoftAuth {
        return new MicrosoftAuth(["https://api.spaces.skype.com/.default", "openid", "profile", "offline_access"], client_id, tenant_id, "https://teams.microsoft.com/go");
    }

    public static outlook(client_id: string, tenant_id: string): MicrosoftAuth {
        return new MicrosoftAuth(["https://api.spaces.skype.com/.default", "openid", "profile", "offline_access"], client_id, tenant_id, "https://teams.microsoft.com/go");
    }

    public static sharepoint(client_id: string, tenant_id: string): MicrosoftAuth {
        return new MicrosoftAuth(["https://api.spaces.skype.com/.default", "openid", "profile", "offline_access"], client_id, tenant_id, "https://teams.microsoft.com/go");
    }

    public async getToken(): Promise<TokenInfo> {
        const tokens: (TokenInfo & AnyItem)[] = await Token.scan("scopes").eq(this.scopes.join(",")).exec();
        const valid = tokens.filter(t => t.expiry > Math.floor(Date.now() / 1000)).sort(t => t.expiry).reverse();
        for (const token of tokens) {
            if (!valid.includes(token)) {
                await token.delete();
            }
        }
        if (valid.length > 0) {
            console.log("hit da cache");
            return valid[0].toJSON();
        }

        return new Promise(async (resolve, reject) => {
            try {
                const {verifier, challenge} = await this.cryptoProvider.generatePkceCodes();
                const url = await this.pca.getAuthCodeUrl({
                    scopes: this.scopes,
                    redirectUri: this.redirect,
                    codeChallenge: challenge,
                    codeChallengeMethod: "S256",
                });

                console.log(verifier, challenge, url);

                const browser = await puppeteer.launch({
                    headless: "new",
                });
                const page = await browser.newPage();

                await page.setRequestInterception(true);
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
                            scopes: this.scopes,
                            redirectUri: this.redirect,
                            codeVerifier: verifier,
                            clientInfo: ci,
                        };

                        const tokenData = await this.pca.acquireTokenByCode(tokenRequest);
                        const response: TokenInfo = {
                            scopes: this.scopes.join(","),
                            id: tokenData.idToken,
                            access: tokenData.accessToken,
                            expiry: Math.floor(tokenData.expiresOn.getTime() / 1000)
                        };
                        console.log("Response:\n", response);
                        await Token.create(response);
                        resolve(response);
                    } else {
                        await request.continue();
                    }
                });

                await page.goto(url + "&sso_reload=true");

                await page.waitForSelector("#i0116");
                await page.type("#i0116", "s-jgiri@lwsd.org");
                await page.click("#idSIButton9");

                await page.waitForTimeout(2700);
                await page.waitForSelector("#i0118");
                await page.type("#i0118", "Dogs(dogs5");
                await page.click("#idSIButton9");

                await page.waitForTimeout(1700);
                await page.click("#idSIButton9");
            } catch (e) {
                reject(e);
            }
        });
    }
}
