import * as fs from "fs";
import {CryptoProvider, AuthorizationUrlRequest, Configuration, LogLevel, PublicClientApplication} from "@azure/msal-node";

function generateAuthUUID(): string {
    const hexChars: string = '0123456789abcdef';
    let uuid: string = '';

    for (let i = 0; i < 32; i++) {
        const randomIndex: number = Math.floor(Math.random() * 16);
        uuid += hexChars[randomIndex];
        if (i === 7 || i === 11 || i === 15 || i === 19) {
            uuid += '-';
        }
    }

    return uuid;
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
        }
    }
};

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

    const page = await fetch(url, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
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

    const ctx = `rQQIARAAhZHPa9NgGMebZqtddVvZwAn-oJQhojZN0jZrC1PXruuy9cc6u7WpyEjfvGnTJnmzvOnPsZuI7LSjbCcFLz3NXSZe9LzTEAXZXyADQUTQk9oiXpUHvjxf-B6ez_N1OViKiVD0TZKl6Oh0CAYA5ADtY8uM7Auy4ZAvLAXLvpkQhDPh_gSCnDnhch8k3k092ufuHT3-KU39KqR6xLWqZRk46vdbUNQwpSnARBjJFgWQ5q-gVwRxQhCfCKJnnwYcG2YhhL4ILANfMMyFfBEpyPqC0gwj05xIi0Hu1D6enWtYVXYgyFS68Mw-hqEKgbUhAoAauvXV7pRNsaJB3dojDdhZMkpxnuNrajVdq3fSeb6dysdq6W7CysyXlFKcDgoFvpXKg3amW2ll5xe0UjJHpzs85jVGlZIJJatjRSyE6FJxqSoEVo0yG1qDxZjK15ACtPW6WFxShUBOkYv0bI-88pdYNBQKGyKAmML1jgEHyIfkKDIroq50RUtBOj4m4_-K-ykJymJDtTzIgLoieQwTyYoKPUiWVUWHA2aI8UeSOBkizoYuOu3uyUs2j-3GdZqMOp0ut23gfgwRz4f77RRefLusXl3mj3Y2n-3dvUMcD_sbnFoMLWfpitnScnUh3FkszDXjUkEyjPuxGEjUNaRUmCaTU9BsJMrsOohdx-ShY8RJum1eMr7CHDvGNSyqVA1TZRO1MDS_OIgn52yvR_7T_FMX0XPdqi9EGolKe7FWWteE5TVmLWwZ-bmSuhkRNhuRVmspJXRjsP9qExy4iJPzxOmFsMsBVFHR8AS15f3Dv2GhOtS90S1vW8MbAAy2pqg2IPZGH3j7V3ofbm9vvx21_Rjbf7_z5sPL758Xz8ZvJ3NpdrW5XkUaU00KOaacSUGuZi7Q_Eo9r5cz1SQulzpCmmvkZg_ctt81&hpgrequestid=d758099e-190b-4ad5-8a23-35722d082e00`;
    const hp = generateAuthUUID();

    // Get flow token
    const usr = await fetch("https://login.microsoftonline.com/common/GetCredentialType?mkt=en-US", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "canary": "PAQABAAEAAAAtyolDObpQQ5VtlI4uGjEPA5UahNdHKMjwiLziUXxCP84ghi_dNLZT-Wk6gF0LD708m8vIBOvRe0x_AQPCXFz2Hl4JpZ5BKdR5Ghjb6MpCdkr-wCaenGAxkBGEwbottSseb9V-lSPduAe25Cd_l1Dt8y4b1v1cstjgmWhDqo6i9-Og5gzY08aGMwolY2O3nYCqADgOeAbjqekNEIptL5I2e-diS-5cjy4I5yhAisDI0yAA",
            "client-request-id": generateAuthUUID(),
            "content-type": "application/json; charset=UTF-8",
            "hpgact": "1800",
            "hpgid": "1104",
            "hpgrequestid": hp,
            "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "cookie": `x-ms-gateway-slice=estsfd; stsservicecookie=estsfd; AADSSO=NA|NoExtension; buid=${cookies.buid}; esctx=${cookies.esctx}; ${flowKey}=${flowToken}; fpc=${cookies.fpc}; brcap=0`,
            "Referer": `${url}&sso_reload=true`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `{"username":"s-jgiri@lwsd.org","isOtherIdpSupported":true,"checkPhones":false,"isRemoteNGCSupported":true,"isCookieBannerShown":false,"isFidoSupported":true,"originalRequest":"${ctx}","country":"US","forceotclogin":false,"isExternalFederationDisallowed":false,"isRemoteConnectSupported":false,"federationFlags":0,"isSignup":false,"flowToken":"${"AQABAAEAAAAtyolDObpQQ5VtlI4uGjEPPc1qK5KriDvYVOVtxkuC1c4AsUuXG7_rjsIPcui9qX5NxHObuYuTV7hxi0r7TIs7N79ZtBI3HaOABQCmQRpSu--ba4fZCBXYSAJKEYvr165fioUkTjhvE1ThvWQstk6vc1FIDwZzmQe1uO92ita7qeAMweAp4D1DMKmXnubbPgkHJGRscNoAuCZqk_yOtIGlUd2RqudXWyv51xKj4WgaG7WqADLEdwf_0dNqLmqrkgPcwZkaT-IBAoCit50nx36vLzyL33-TIgIReylOSp9K2OJHd9LIaq6OUT8ZzEZIFy4wVqr0SowoNEi2NwQAANJni-RUXch4Za7HLyDyZix8M9kDGhqO-9LJqRqOJLEnnBLeAMOVPGNiftxtradzQGGlRXUFh4fmfIDRoh1DXKBXvNQco6bOkkS-FgUF54jZ6LVGOh-HcPNyzCNsQq5sDYbHQ77-nj1jrpNBfVXxxCSvP5aCG1odZKPu8b-8ITiiwGX6twFkclV4Kfa22bgnMY3bxeU3YbPPEns3YZIhCg2-S-SygwDUR_XAdHDNvwAEEMzG9ebUlhL4_KcQCMDEccUY96iunlkveiVTN_3hCbmnNMtk16zDoXBWGx87Og4NG71WwTmdAc1_rMzayJM22xz2b4BwBcFvII3rOQh3EmHTASAA"}","isAccessPassSupported":true}`,
        "method": "POST"
    });
    const usrData: {FlowToken: string, apiCanary: string} = await usr.json();
    console.log(usrData);

    // Get new auth cookies for password
    const pwdPage = await fetch("https://login.microsoftonline.com/common/login", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": `x-ms-gateway-slice=estsfd; stsservicecookie=estsfd; AADSSO=NA|NoExtension; SSOCOOKIEPULLED=1; brcap=0; wlidperf=FR=L&ST=1699144071870`,
            "Referer": "https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&scope=https%3A%2F%2Fapi.spaces.skype.com%2F.default%20openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2Fgo&client-request-id=f9d69212-8c93-4e4e-abb7-87a48a3cccb1&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=2.19.0&x-client-OS=&x-client-CPU=&client_info=1&code_challenge=tcr37gFQtnrgUvgiiLb1_jIMV73ngHl0D3B4vU5kkqw&code_challenge_method=S256&prompt=select_account&nonce=53b0dd00-5fee-48bc-a68e-10a7657f7ca5&state=eyJpZCI6IjJjZWQxNTBlLWI5MGItNDg5OC05MGFiLTRlOWIzZmI3ZjQxYSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D&claims=%7B%22access_token%22%3A%7B%22xms_cc%22%3A%7B%22values%22%3A%5B%22CP1%22%5D%7D%7D%7D&sso_reload=true",
            "Referrer-Policy": "strict-origin-when-cross-origin" // TODO: keep removing headers until X_X
        },
        "body": `i13=0&login=s-jgiri%40lwsd.org&loginfmt=s-jgiri%40lwsd.org&type=11&LoginOptions=3&lrt=&lrtPartition=&hisRegion=&hisScaleUnit=&passwd=Dogs%28dogs5&ps=2&psRNGCDefaultType=&psRNGCEntropy=&psRNGCSLK=&canary=${encodeURIComponent("bxMm85HnTEdKOoGROr+3Hy+5H5b+wVYjQuOCWvmo7tc=3:1:CANARY:YITw6ux5J5Wq0X0L6I546XpmC+unLRjDSBFnP3J7lTo=")}&ctx=${ctx}&hpgrequestid=${hp}&flowToken=${usrData.FlowToken}&PPSX=&NewUser=1&FoundMSAs=&fspost=0&i21=0&CookieDisclosure=0&IsFidoSupported=1&isSignupPost=0&i19=29371`,
        "method": "POST"
    });

    console.log(pwdPage.headers);
    cookies = Object.fromEntries(pwdPage.headers.getSetCookie().map((x: string) => x.split(";")[0].split("=")));
    console.log(cookies);
    /*[flowKey, flowToken] = Object.keys(cookies).filter(key => key.startsWith("esctx-") && cookies[key].length > 0).map(x => ([x, cookies[x]]))[0];*/

    fs.writeFileSync("yeet.html", await pwdPage.text());
    console.log(pwdPage.status);
})();
