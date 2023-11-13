"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs = require("fs");
var msal_node_1 = require("@azure/msal-node");
function generateAuthUUID() {
    var hexChars = '0123456789abcdef';
    var uuid = '';
    for (var i = 0; i < 32; i++) {
        var randomIndex = Math.floor(Math.random() * 16);
        uuid += hexChars[randomIndex];
        if (i === 7 || i === 11 || i === 15 || i === 19) {
            uuid += '-';
        }
    }
    return uuid;
}
var config = {
    auth: {
        clientId: "5e3ce6c0-2b1f-4285-8d4b-75ee78787346",
        authority: "https://login.microsoftonline.com/1fd4673f-df96-4621-8638-a1d88c4c85d7"
    },
    system: {
        loggerOptions: {
            loggerCallback: function (loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal_node_1.LogLevel.Verbose
        }
    }
};
var pca = new msal_node_1.PublicClientApplication(config);
var cryptoProvider = new msal_node_1.CryptoProvider();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, verifier, challenge, url, page, cookies, _b, flowKey, flowToken, ctx, hp, usr, usrData, pwdPage, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, cryptoProvider.generatePkceCodes()];
            case 1:
                _a = _f.sent(), verifier = _a.verifier, challenge = _a.challenge;
                return [4 /*yield*/, pca.getAuthCodeUrl({
                        scopes: ["https://api.spaces.skype.com/.default", "openid", "profile", "offline_access"],
                        redirectUri: "https://teams.microsoft.com/go",
                        codeChallenge: challenge,
                        codeChallengeMethod: "S256"
                    })];
            case 2:
                url = _f.sent();
                console.log(verifier, challenge, url);
                return [4 /*yield*/, fetch(url, {
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
                    })];
            case 3:
                page = _f.sent();
                cookies = Object.fromEntries(page.headers.getSetCookie().map(function (x) { return x.split(";")[0].split("="); }));
                console.log(cookies);
                _b = Object.keys(cookies).filter(function (key) { return key.startsWith("esctx-"); }).map(function (x) { return ([x, cookies[x]]); })[0], flowKey = _b[0], flowToken = _b[1];
                console.log(page.status);
                ctx = "rQQIARAAhZHPa9NgGMebZqtddVvZwAn-oJQhojZN0jZrC1PXruuy9cc6u7WpyEjfvGnTJnmzvOnPsZuI7LSjbCcFLz3NXSZe9LzTEAXZXyADQUTQk9oiXpUHvjxf-B6ez_N1OViKiVD0TZKl6Oh0CAYA5ADtY8uM7Auy4ZAvLAXLvpkQhDPh_gSCnDnhch8k3k092ufuHT3-KU39KqR6xLWqZRk46vdbUNQwpSnARBjJFgWQ5q-gVwRxQhCfCKJnnwYcG2YhhL4ILANfMMyFfBEpyPqC0gwj05xIi0Hu1D6enWtYVXYgyFS68Mw-hqEKgbUhAoAauvXV7pRNsaJB3dojDdhZMkpxnuNrajVdq3fSeb6dysdq6W7CysyXlFKcDgoFvpXKg3amW2ll5xe0UjJHpzs85jVGlZIJJatjRSyE6FJxqSoEVo0yG1qDxZjK15ACtPW6WFxShUBOkYv0bI-88pdYNBQKGyKAmML1jgEHyIfkKDIroq50RUtBOj4m4_-K-ykJymJDtTzIgLoieQwTyYoKPUiWVUWHA2aI8UeSOBkizoYuOu3uyUs2j-3GdZqMOp0ut23gfgwRz4f77RRefLusXl3mj3Y2n-3dvUMcD_sbnFoMLWfpitnScnUh3FkszDXjUkEyjPuxGEjUNaRUmCaTU9BsJMrsOohdx-ShY8RJum1eMr7CHDvGNSyqVA1TZRO1MDS_OIgn52yvR_7T_FMX0XPdqi9EGolKe7FWWteE5TVmLWwZ-bmSuhkRNhuRVmspJXRjsP9qExy4iJPzxOmFsMsBVFHR8AS15f3Dv2GhOtS90S1vW8MbAAy2pqg2IPZGH3j7V3ofbm9vvx21_Rjbf7_z5sPL758Xz8ZvJ3NpdrW5XkUaU00KOaacSUGuZi7Q_Eo9r5cz1SQulzpCmmvkZg_ctt81&hpgrequestid=d758099e-190b-4ad5-8a23-35722d082e00";
                hp = generateAuthUUID();
                return [4 /*yield*/, fetch("https://login.microsoftonline.com/common/GetCredentialType?mkt=en-US", {
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
                            "cookie": "x-ms-gateway-slice=estsfd; stsservicecookie=estsfd; AADSSO=NA|NoExtension; buid=".concat(cookies.buid, "; esctx=").concat(cookies.esctx, "; ").concat(flowKey, "=").concat(flowToken, "; fpc=").concat(cookies.fpc, "; brcap=0"),
                            "Referer": "".concat(url, "&sso_reload=true"),
                            "Referrer-Policy": "strict-origin-when-cross-origin"
                        },
                        "body": "{\"username\":\"s-jgiri@lwsd.org\",\"isOtherIdpSupported\":true,\"checkPhones\":false,\"isRemoteNGCSupported\":true,\"isCookieBannerShown\":false,\"isFidoSupported\":true,\"originalRequest\":\"".concat(ctx, "\",\"country\":\"US\",\"forceotclogin\":false,\"isExternalFederationDisallowed\":false,\"isRemoteConnectSupported\":false,\"federationFlags\":0,\"isSignup\":false,\"flowToken\":\"").concat("AQABAAEAAAAtyolDObpQQ5VtlI4uGjEPPc1qK5KriDvYVOVtxkuC1c4AsUuXG7_rjsIPcui9qX5NxHObuYuTV7hxi0r7TIs7N79ZtBI3HaOABQCmQRpSu--ba4fZCBXYSAJKEYvr165fioUkTjhvE1ThvWQstk6vc1FIDwZzmQe1uO92ita7qeAMweAp4D1DMKmXnubbPgkHJGRscNoAuCZqk_yOtIGlUd2RqudXWyv51xKj4WgaG7WqADLEdwf_0dNqLmqrkgPcwZkaT-IBAoCit50nx36vLzyL33-TIgIReylOSp9K2OJHd9LIaq6OUT8ZzEZIFy4wVqr0SowoNEi2NwQAANJni-RUXch4Za7HLyDyZix8M9kDGhqO-9LJqRqOJLEnnBLeAMOVPGNiftxtradzQGGlRXUFh4fmfIDRoh1DXKBXvNQco6bOkkS-FgUF54jZ6LVGOh-HcPNyzCNsQq5sDYbHQ77-nj1jrpNBfVXxxCSvP5aCG1odZKPu8b-8ITiiwGX6twFkclV4Kfa22bgnMY3bxeU3YbPPEns3YZIhCg2-S-SygwDUR_XAdHDNvwAEEMzG9ebUlhL4_KcQCMDEccUY96iunlkveiVTN_3hCbmnNMtk16zDoXBWGx87Og4NG71WwTmdAc1_rMzayJM22xz2b4BwBcFvII3rOQh3EmHTASAA", "\",\"isAccessPassSupported\":true}"),
                        "method": "POST"
                    })];
            case 4:
                usr = _f.sent();
                return [4 /*yield*/, usr.json()];
            case 5:
                usrData = _f.sent();
                console.log(usrData);
                return [4 /*yield*/, fetch("https://login.microsoftonline.com/common/login", {
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
                            "cookie": "x-ms-gateway-slice=estsfd; stsservicecookie=estsfd; AADSSO=NA|NoExtension; SSOCOOKIEPULLED=1; brcap=0; wlidperf=FR=L&ST=1699144071870",
                            "Referer": "https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&scope=https%3A%2F%2Fapi.spaces.skype.com%2F.default%20openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2Fgo&client-request-id=f9d69212-8c93-4e4e-abb7-87a48a3cccb1&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=2.19.0&x-client-OS=&x-client-CPU=&client_info=1&code_challenge=tcr37gFQtnrgUvgiiLb1_jIMV73ngHl0D3B4vU5kkqw&code_challenge_method=S256&prompt=select_account&nonce=53b0dd00-5fee-48bc-a68e-10a7657f7ca5&state=eyJpZCI6IjJjZWQxNTBlLWI5MGItNDg5OC05MGFiLTRlOWIzZmI3ZjQxYSIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D&claims=%7B%22access_token%22%3A%7B%22xms_cc%22%3A%7B%22values%22%3A%5B%22CP1%22%5D%7D%7D%7D&sso_reload=true",
                            "Referrer-Policy": "strict-origin-when-cross-origin" // TODO: keep removing headers until X_X
                        },
                        "body": "i13=0&login=s-jgiri%40lwsd.org&loginfmt=s-jgiri%40lwsd.org&type=11&LoginOptions=3&lrt=&lrtPartition=&hisRegion=&hisScaleUnit=&passwd=Dogs%28dogs5&ps=2&psRNGCDefaultType=&psRNGCEntropy=&psRNGCSLK=&canary=".concat(encodeURIComponent("bxMm85HnTEdKOoGROr+3Hy+5H5b+wVYjQuOCWvmo7tc=3:1:CANARY:YITw6ux5J5Wq0X0L6I546XpmC+unLRjDSBFnP3J7lTo="), "&ctx=").concat(ctx, "&hpgrequestid=").concat(hp, "&flowToken=").concat(usrData.FlowToken, "&PPSX=&NewUser=1&FoundMSAs=&fspost=0&i21=0&CookieDisclosure=0&IsFidoSupported=1&isSignupPost=0&i19=29371"),
                        "method": "POST"
                    })];
            case 6:
                pwdPage = _f.sent();
                console.log(pwdPage.headers);
                cookies = Object.fromEntries(pwdPage.headers.getSetCookie().map(function (x) { return x.split(";")[0].split("="); }));
                console.log(cookies);
                /*[flowKey, flowToken] = Object.keys(cookies).filter(key => key.startsWith("esctx-") && cookies[key].length > 0).map(x => ([x, cookies[x]]))[0];*/
                _d = (_c = fs).writeFileSync;
                _e = ["yeet.html"];
                return [4 /*yield*/, pwdPage.text()];
            case 7:
                /*[flowKey, flowToken] = Object.keys(cookies).filter(key => key.startsWith("esctx-") && cookies[key].length > 0).map(x => ([x, cookies[x]]))[0];*/
                _d.apply(_c, _e.concat([_f.sent()]));
                console.log(pwdPage.status);
                return [2 /*return*/];
        }
    });
}); })();
