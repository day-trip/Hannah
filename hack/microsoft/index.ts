/**
 * This script acquires an access token for Microsoft Teams based on an LWSD email and password
 */
import {
    AuthenticationResult, AuthError,
    AuthorizationCodeRequest,
    CryptoProvider, ICachePlugin,
    INetworkModule, InteractionRequiredAuthError, LogLevel,
    NetworkRequestOptions,
    NetworkResponse,
    PublicClientApplication, ServerError, TokenCacheContext
} from "@azure/msal-node";
import * as cheerio from "cheerio";
import * as acorn from "acorn";
import * as fs from "fs/promises";
import {CookieJar} from "tough-cookie";
import 'dotenv/config';
import {model, Schema} from "dynamoose";
import {AnyItem} from "dynamoose/dist/Item";
import * as pb from "protobufjs";
import {Client} from "@microsoft/microsoft-graph-client";

/**
 * Includes an `Origin` header for MSAL to avert an HTTP(s) error
 */
class PatchedNetworkClient implements INetworkModule {
    private static readonly ORIGIN = "";

    public async sendGetRequestAsync<T>(url: string, options?: NetworkRequestOptions, cancellationToken?: number): Promise<NetworkResponse<T>> {
        const r = await fetch(url, {
            method: "GET",
            headers: {...options?.headers, "Origin": PatchedNetworkClient.ORIGIN}
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
            body: options?.body,
            headers: {...options?.headers, "Origin": PatchedNetworkClient.ORIGIN}
        });
        return {
            headers: Object.fromEntries(r.headers.entries()),
            body: await r.json(),
            status: r.status,
        };
    }
}

const LWSD_TENANT_ID = "1fd4673f-df96-4621-8638-a1d88c4c85d7";
const LWSD_EMAIL = process.env.LWSD_EMAIL!; // s-jgiri@lwsd.org
const LWSD_PASSWORD = process.env.LWSD_PASSWORD!; // **********

type OfficeClient = {
    client_id: string;
    scopes: string[];
    redirect: string;
}

const TEAMS: OfficeClient = {
    client_id: "5e3ce6c0-2b1f-4285-8d4b-75ee78787346",
    scopes: ["https://api.spaces.skype.com/.default", "openid", "profile", "offline_access"],
    redirect: "https://teams.microsoft.com/go",
}

type TokenInfo = {
    email: string;
    client: string;
    id: string;
    data: Buffer;
}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = String(0)

export const Token = model<TokenInfo & AnyItem>('Hannah-Token', new Schema({
    email: {
        type: String,
        hashKey: true,
    },
    client: {
        type: String,
        rangeKey: true,
    },
    data: Buffer,
}));

const schema = `
  syntax = "proto3";

  package token;

  message Account {
    string home_account_id = 1;
    string environment = 2;
    string realm = 3;
    string local_account_id = 4;
    string username = 5;
    string authority_type = 6;
    string name = 7;
    string client_info = 8;
  }

  message Id {
    string home_account_id = 1;
    string environment = 2;
    string credential_type = 3;
    string client_id = 4;
    string secret = 5;
    string realm = 6;
  }

  message Access {
    string home_account_id = 1;
    string environment = 2;
    string credential_type = 3;
    string client_id = 4;
    string secret = 5;
    string realm = 6;
    string target = 7;
    string cached_at = 8;
    string expires_on = 9;
    string extended_expires_on = 10;
    string token_type = 11;
  }

  message Refresh {
    string home_account_id = 1;
    string environment = 2;
    string credential_type = 3;
    string client_id = 4;
    string secret = 5;
  }

  message Token {
    map<string, Account> Account = 1;
    map<string, Id> IdToken = 2;
    map<string, Access> AccessToken = 3;
    map<string, Refresh> RefreshToken = 4;
  }
`;

class DynamoDBCachePlugin implements ICachePlugin {
    private readonly client: OfficeClient;
    private readonly schema: pb.Type;

    private info: string | null;

    constructor(client: OfficeClient) {
        this.client = client;

        const root = pb.parse(schema, {keepCase: true}).root;
        root.resolveAll();
        this.schema = root.lookupType("token.Token");
    }

    public async setEmail(email: string): Promise<boolean> {
        const token = await Token.query("email").eq(email).where("client").eq(this.clientHash()).exec();
        if (token[0]) {
            this.info = JSON.stringify(this.schema.decode(new Uint8Array(token[0].data)).toJSON());
            return true;
        }
        return false;
    }

    private clientHash(): string {
        return `${this.client.client_id}#${this.client.scopes.join(",")}`;
    }

    async beforeCacheAccess(cacheContext: TokenCacheContext): Promise<void> {
        if (this.info) {
            cacheContext.cache.deserialize(this.info);
        }
    }

    async afterCacheAccess(cacheContext: TokenCacheContext): Promise<void> {
        if (cacheContext.hasChanged) {
            console.log("ACA");
            let cache = JSON.parse(cacheContext.cache.serialize());
            delete cache.AppMetadata;
            let data = this.schema.create(cache);
            await (new Token({
                email: (Object.entries(cache.Account)[0][1] as any).username,
                client: this.clientHash(),
                data: Buffer.from(this.schema.encode(data).finish()),
            })).save();
        }
    }
}

class MicrosoftAuthenticatorV2 {
    private readonly client: OfficeClient;
    private readonly tenant: string;
    private readonly cachePlugin: DynamoDBCachePlugin;
    public readonly pca: PublicClientApplication;
    private readonly cp: CryptoProvider;

    constructor(client: OfficeClient, tenant: string) {
        this.client = client;
        this.tenant = tenant;
        this.cachePlugin = new DynamoDBCachePlugin(client);
        this.pca = new PublicClientApplication({
            auth: {
                clientId: client.client_id,
                authority: `https://login.microsoftonline.com/${tenant}`
            },
            cache: {
                cachePlugin: this.cachePlugin,
            },
            system: {
                loggerOptions: {
                    loggerCallback(loglevel: LogLevel, message: string, _: boolean) {
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
        });

        this.cp = new CryptoProvider();
    }

    /**
     * Uses Cheerio and Acorn to extract the `$Config` constant from the scraped `<script>` tag
     * @param html The HTML source
     * @param keys The object keys to load
     */
    private extractHTMLConfig<T extends string[]>(html: string, keys: T): Record<keyof T, string | number | boolean> {
        const $ = cheerio.load(html);
        const scriptTagWithConfig = $('script').filter((_, el) => {
            const scriptContent = $(el).html();
            return scriptContent && scriptContent.includes('$Config={');
        });
        const scriptContent = scriptTagWithConfig.html();
        const parsedScript = acorn.parse(scriptContent, { ecmaVersion: 'latest' });
        const expression = ((parsedScript.body.find(
            node => node.type === 'ExpressionStatement' && node.expression.type === "AssignmentExpression" && node.expression.left.type === "Identifier" && node.expression.left.name === "$Config"
        ) as acorn.ExpressionStatement).expression as acorn.AssignmentExpression).right;
        return Object.fromEntries(keys.map(key => [key, (((expression as acorn.ObjectExpression).properties.find(
            node => node.type === "Property" && node.key.type === "Literal" && node.key.value === key
        ) as acorn.Property).value as acorn.Literal).value])) as Record<keyof T, string | number | boolean>;
    }

    /**
     * Helper function for encoding a `FormData` object into a `string`
     * @param formData The object containing the form data
     */
    private encodeFormData(formData: FormData): string {
        return Array.from(formData.entries()).map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`).join("&");
    }

    /**
     * Extracts a query parameter from a URL
     * @param url The URL
     * @param param The name of the parameter to extract
     */
    private getQueryParam(url: string, param: string): string {
        param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        const regex = new RegExp("[\\?&]" + param + "=([^&#]*)");
        const results = regex.exec(url);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    /**
     * Uses a series of HTTP(s) requests to acquire a real user session
     * @param email LWSD Email
     * @param pwsd Password
     * @param log Logging function
     * @private
     */
    private async acquireSession(email: string, pwsd: string, log: typeof console.log = console.log): Promise<AuthenticationResult> {
        // Gets auth URL
        const {verifier, challenge} = await this.cp.generatePkceCodes();
        const url = await this.pca.getAuthCodeUrl({
            scopes: this.client.scopes,
            redirectUri: this.client.redirect,
            codeChallenge: challenge,
            codeChallengeMethod: "S256",
        });

        log("----------------------------------------- PHASE 1 ------------------------------------------");
        log("---------------------------------------- Handshake -----------------------------------------\n");
        log("Handshake information:", verifier, challenge, url);

        const jar = new CookieJar();

        jar.setCookieSync("fpc=As6wdZNeRrlNuwnebMCFHjDnfDJRAQAAAOTADt0OAAAA; path=/; secure; HttpOnly; SameSite=None", url);
        jar.setCookieSync("x-ms-gateway-slice=estsfd; path=/; secure; samesite=none; httponly", url);
        jar.setCookieSync("stsservicecookie=estsfd; path=/; secure; samesite=none; httponly", url);
        jar.setCookieSync("AADSSO=NA|NoExtension; path=/; secure; samesite=none", url);
        jar.setCookieSync("SSOCOOKIEPULLED=1; path=/; secure; samesite=none", url);


        log("\n----------------------------------------- PHASE 2 ------------------------------------------");
        log("------------------------------------ Initial Page Load -------------------------------------\n");

        // Initial Page Load
        const page = await fetch(url, {
            method: "GET",
            body: null,
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "upgrade-insecure-requests": "1",
                "cookie": await jar.getCookieString(url),
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "Host": "login.microsoftonline.com",
                "Origin": "https://login.microsoftonline.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            },
        });

        page.headers.getSetCookie().forEach(cookie => {
            jar.setCookieSync(cookie, url);
        });
        jar.setCookieSync("brcap=0; path=/; secure; samesite=none", url);
        const ccs = await jar.getCookieString("https://login.microsoftonline.com/common/GetCredentialType?mkt=en-US", {allPaths: true});
        log("Cookies jar:", ccs);

        // Steals some juicy information
        const t = await page.text();

        const {sFT: flowToken, sCtx: ctx, apiCanary, canary, sessionId: session, correlationId: correlation, hpgid: gid, hpgact: gact} = this.extractHTMLConfig(t, ["sFT", "sCtx", "apiCanary", "canary", "sessionId", "correlationId", "hpgid", "hpgact"]) as any;

        log("Data:", flowToken, ctx, apiCanary, canary, session, correlation, gid, gact);

        log("\n----------------------------------------- PHASE 3 ------------------------------------------");
        log("---------------------------------------- Username ------------------------------------------\n");

        // Submit username/email
        const username = await fetch("https://login.microsoftonline.com/common/GetCredentialType?mkt=en-US", {
            headers: {
                "accept": "application/json",
                "accept-language": "en-US,en;q=0.9",
                "canary": apiCanary,
                "client-request-id": correlation,
                "content-type": "application/json; charset=UTF-8",
                "hpgact": String(gact),
                "hpgid": String(gid),
                "hpgrequestid": session,
                "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": ccs,
                "Referer": url,
                "Host": "login.microsoftonline.com",
                "Origin": "https://login.microsoftonline.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: JSON.stringify({
                "username": email,
                "isOtherIdpSupported": true,
                "checkPhones": false,
                "isRemoteNGCSupported": true,
                "isCookieBannerShown": false,
                "isFidoSupported": true,
                "originalRequest": ctx,
                "country": "US",
                "forceotclogin": false,
                "isExternalFederationDisallowed": false,
                "isRemoteConnectSupported": false,
                "federationFlags": 0,
                "isSignup": false,
                "flowToken": flowToken,
                "isAccessPassSupported": true
            }),
            method: "POST"
        });

        jar.setCookieSync(`wlidperf=FR=L&ST=${Date.now()}; path=/; secure; samesite=none`, "https://login.microsoftonline.com/common/GetCredentialType?mkt=en-US");

        const {FlowToken} = await username.json();
        log("Flow token:", FlowToken);

        log("\n----------------------------------------- PHASE 4 ------------------------------------------");
        log("---------------------------------------- Password ------------------------------------------\n");

        // Prepare big daddy's lunch
        const passwordData = new FormData();

        passwordData.append('i13', '0');
        passwordData.append('login', email);
        passwordData.append('loginfmt', email);
        passwordData.append('type', '11');
        passwordData.append('LoginOptions', '3');
        passwordData.append('lrt', '');
        passwordData.append('lrtPartition', '');
        passwordData.append('hisRegion', '');
        passwordData.append('hisScaleUnit', '');
        passwordData.append('passwd', pwsd);
        passwordData.append('ps', '2');
        passwordData.append('psRNGCDefaultType', '');
        passwordData.append('psRNGCEntropy', '');
        passwordData.append('psRNGCSLK', '');
        passwordData.append('canary', canary);
        passwordData.append('ctx', ctx);
        passwordData.append('hpgrequestid', session);
        passwordData.append('flowToken', FlowToken);
        passwordData.append('PPSX', '');
        passwordData.append('NewUser', '1');
        passwordData.append('FoundMSAs', '');
        passwordData.append('fspost', '0');
        passwordData.append('i21', '0');
        passwordData.append('CookieDisclosure', '0');
        passwordData.append('IsFidoSupported', '1');
        passwordData.append('isSignupPost', '0');
        passwordData.append('i19', '85807692');

        // here's the big daddy
        const password = await fetch(`https://login.microsoftonline.com/${this.tenant}/login`, {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": await jar.getCookieString(`https://login.microsoftonline.com/${this.tenant}/login`),
                "Referer": url,
                "Origin": "https://login.microsoftonline.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: this.encodeFormData(passwordData),
            method: "POST",
            keepalive: true,
        });

        const tt = await password.text();
        await fs.writeFile("yayo.html", tt);

        password.headers.getSetCookie().forEach(cookie => {
            jar.setCookieSync(cookie, `https://login.microsoftonline.com/${this.tenant}/login`);
        });
        jar.setCookieSync("MicrosoftApplicationsTelemetryDeviceId=f26b1d93-26c4-45f4-9ef4-1d229b6f7e10; path=/; secure; samesite=none", `https://login.microsoftonline.com/${this.tenant}/login`);
        jar.setCookieSync(`ai_session=c0fnnT+ZyGehZPh+dc6sEW|${Date.now()}|${Date.now()}; path=/; secure; samesite=none`, `https://login.microsoftonline.com/${this.tenant}/login`);
        const ccs1 = await jar.getCookieString("https://login.microsoftonline.com/kmsi");
        log("Cookie jar:", ccs1);

        const {sFT: flowToken1, sCtx: ctx1, apiCanary: apiCanary1, canary: canary1, sessionId: session1, correlationId: correlation1, hpgid: gid1, hpgact: gact1} = this.extractHTMLConfig(tt, ["sFT", "sCtx", "apiCanary", "canary", "sessionId", "correlationId", "hpgid", "hpgact"]) as any;

        log("$Config:", flowToken1, ctx1, apiCanary1, canary1, session1, correlation1, gid1, gact1);

        const kmsiData = new FormData();

        kmsiData.append("LoginOptions", "1");
        kmsiData.append("type", "28");
        kmsiData.append("ctx", ctx1);
        kmsiData.append("flowToken", flowToken1);
        kmsiData.append("hpgrequestid", session1);
        kmsiData.append("canary", canary1);
        kmsiData.append("i19", "26348");

        log("\n----------------------------------------- PHASE 5 ------------------------------------------");
        log("------------------------------------------- KMSI ------------------------------------------\n");

        const kmsi = await fetch("https://login.microsoftonline.com/kmsi", {
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*!/!*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": ccs1,
                "Referer": "https://login.microsoftonline.com/common/login",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "Origin": "https://login.microsoftonline.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            },
            body: this.encodeFormData(kmsiData),
            method: "POST",
            keepalive: true,
            redirect: "manual",
        });

        log(kmsi.headers.getSetCookie());

        kmsi.headers.getSetCookie().forEach(cookie => {
            jar.setCookieSync(cookie, url);
        });

        const fUrl = kmsi.headers.get("Location");

        const code = this.getQueryParam(fUrl, "code");
        const ci = this.getQueryParam(fUrl, "client_info");

        log(fUrl, code, ci);

        const tokenRequest: AuthorizationCodeRequest = {
            code: code,
            scopes: this.client.scopes,
            redirectUri: this.client.redirect,
            codeVerifier: verifier,
            clientInfo: ci,
        };

        const tokenData = await this.pca.acquireTokenByCode(tokenRequest);

        log(JSON.stringify(tokenData));

        return tokenData;
    }

    public async getToken(email: string, password: string, log: typeof console.log = console.log): Promise<{access: string, id: string, expiry: number} | null> {
        try {
            if (!(await this.cachePlugin.setEmail(email))) {
                throw new InteractionRequiredAuthError();
            }

            const account = (await this.pca.getTokenCache().getAllAccounts())[0];

            const r =  await this.pca.acquireTokenSilent({
                account,
                scopes: this.client.scopes,
            });
            return {
                access: r.accessToken,
                id: r.idToken,
                expiry: Math.floor(r.expiresOn.getTime() / 1000),
            }
        } catch (e) {
            if (e instanceof AuthError || e instanceof ServerError) {
                const r = await this.acquireSession(email, password, log);
                return {
                    access: r.accessToken,
                    id: r.idToken,
                    expiry: r.expiresOn.getTime(),
                }
            }
            throw e;
        }
    }
}

void (async () => {
    const v2 = new MicrosoftAuthenticatorV2(TEAMS, LWSD_TENANT_ID);
    const t = await v2.getToken(LWSD_EMAIL, LWSD_PASSWORD, () => {});

    const client = Client.init({
        authProvider: (done) => {
            done(null, t.access);
        }
    });

    console.log(t);

    const p = await client.api("/me").get();
    console.log(p);
})();
