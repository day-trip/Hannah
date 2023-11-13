"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var msal_node_1 = require("@azure/msal-node");
var puppeteer_1 = require("puppeteer");
var SKYPE = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVFODQ4MjE0Qzc3MDczQUU1QzJCREU1Q0NENTQ0ODlEREYyQzRDODQiLCJ4NXQiOiJYb1NDRk1kd2M2NWNLOTVjelZSSW5kOHNUSVEiLCJ0eXAiOiJKV1QifQ.eyJpYXQiOjE2OTgyNzM3MzQsImV4cCI6MTY5ODI3ODQyOCwic2t5cGVpZCI6Im9yZ2lkOmE0M2VmOWY3LWY2YzUtNDhiMy05MDA3LTY2NzVkOWVjNzE1OCIsInNjcCI6NzgwLCJjc2kiOiIxNjk4MjczNDMzIiwidGlkIjoiMWZkNDY3M2YtZGY5Ni00NjIxLTg2MzgtYTFkODhjNGM4NWQ3IiwicmduIjoiYW1lciIsImFhZF91dGkiOiJ3MHZUdFZBTEFrR2VVZ0o3dE9KN0FBIiwiYWFkX2lhdCI6MTY5ODI3MzQzM30.MxexSkQ9tkpmolk_3cQzYznhrXMfhDxS8ZSbcbqjuY-6Tcwatjt1SjlNUOj0UYmxcYzXjExf-yIRCjR3cfRa5dqgGhboM7bh3YX6OVjnGd_CLiKt7wl760xXxmU_Z7eQTZ9rCMYTLlZkx3ve7QJfkXABQoSwNVGextq3s2ZxAZUxXYowHflTcDg5lVaYCxaH4vsOyQadPuFjpy6CC-lTz43Xb7cZYtaZq-xdv6oHhg5CykuWNKSOrdElM8gUTEPU-c3dbX8jbYLgnEqWZS-NhjgPAaRTskmYeK51sqDE9JeV4zeGBL-VByxFi0rg-QkguL4nwA9s-nGlT9FlhUkTUw";
var PatchedNetworkClient = /** @class */ (function () {
    function PatchedNetworkClient() {
    }
    PatchedNetworkClient.prototype.sendGetRequestAsync = function (url, options, cancellationToken) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch(url, { method: "GET", headers: __assign(__assign({}, options.headers), { "Origin": PatchedNetworkClient.ORIGIN }) })];
                    case 1:
                        r = _b.sent();
                        _a = {
                            headers: Object.fromEntries(r.headers.entries())
                        };
                        return [4 /*yield*/, r.json()];
                    case 2: return [2 /*return*/, (_a.body = _b.sent(),
                            _a.status = r.status,
                            _a)];
                }
            });
        });
    };
    PatchedNetworkClient.prototype.sendPostRequestAsync = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch(url, { method: "POST", body: options.body, headers: __assign(__assign({}, options.headers), { "Origin": PatchedNetworkClient.ORIGIN }) })];
                    case 1:
                        r = _b.sent();
                        _a = {
                            headers: Object.fromEntries(r.headers.entries())
                        };
                        return [4 /*yield*/, r.json()];
                    case 2: return [2 /*return*/, (_a.body = _b.sent(),
                            _a.status = r.status,
                            _a)];
                }
            });
        });
    };
    PatchedNetworkClient.ORIGIN = "";
    return PatchedNetworkClient;
}());
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
        },
        networkClient: new PatchedNetworkClient()
    }
};
var pca = new msal_node_1.PublicClientApplication(config);
var cryptoProvider = new msal_node_1.CryptoProvider();
function getQueryParam(url, param) {
    param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + param + "=([^&#]*)");
    var results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, verifier, challenge, url, browser, page;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, cryptoProvider.generatePkceCodes()];
            case 1:
                _a = _b.sent(), verifier = _a.verifier, challenge = _a.challenge;
                return [4 /*yield*/, pca.getAuthCodeUrl({
                        scopes: ["https://api.spaces.skype.com/.default", "openid", "profile", "offline_access"],
                        redirectUri: "https://teams.microsoft.com/go",
                        codeChallenge: challenge,
                        codeChallengeMethod: "S256"
                    })];
            case 2:
                url = _b.sent();
                console.log(verifier, challenge, url);
                return [4 /*yield*/, puppeteer_1["default"].launch({
                        headless: "new"
                    })];
            case 3:
                browser = _b.sent();
                return [4 /*yield*/, browser.newPage()];
            case 4:
                page = _b.sent();
                page.setRequestInterception(true);
                page.on('request', function (request) { return __awaiter(void 0, void 0, void 0, function () {
                    var code, ci, tokenRequest, tokenData, response, r, json;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!request.url().startsWith("https://teams.microsoft.com/go?code=")) return [3 /*break*/, 6];
                                code = getQueryParam(request.url(), "code");
                                ci = getQueryParam(request.url(), "client_info");
                                console.log(request.url());
                                console.log("Housten, we got a code: " + code);
                                return [4 /*yield*/, page.close()];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, browser.close()];
                            case 2:
                                _a.sent();
                                tokenRequest = {
                                    code: code,
                                    scopes: ["https://api.spaces.skype.com/.default", "openid", "profile", "offline_access"],
                                    redirectUri: "https://teams.microsoft.com/go",
                                    codeVerifier: verifier,
                                    clientInfo: ci
                                };
                                return [4 /*yield*/, pca.acquireTokenByCode(tokenRequest)];
                            case 3:
                                tokenData = _a.sent();
                                response = { id: tokenData.idToken, access: tokenData.accessToken, expiry: Math.floor(tokenData.expiresOn.getTime() / 1000) };
                                console.log("Response:\n", response);
                                return [4 /*yield*/, fetch("https://teams.microsoft.com/api/mt/amer/beta/users/searchV2?includeDLs=false&includeBots=true&skypeTeamsInfo=true&source=searchResults&enableGuest=true&includeMTOUsers=false", {
                                        "headers": {
                                            "accept": "*/*",
                                            "accept-language": "en-US,en;q=0.9",
                                            "authorization": "Bearer ".concat(response.access),
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
                                            "cookie": "MUID=1AE6E50159A760F52A89F6735DA7669C; MC1=GUID=dcf8f32f8699445bb8a5c15df68f9ff5&HASH=dcf8&LV=202308&V=4&LU=1692476532717; _cs_c=0; at_check=true; IR_gbd=microsoft.com; IR_7593=1697753860190%7C0%7C1697753860190%7C%7C; _tt_enable_cookie=1; _ttp=aZw36Kvt8rxJZi0eIw7oLKwrZM2; AMCVS_EA76ADE95776D2EC7F000101%40AdobeOrg=1; _cs_id=eb7c20d6-2646-a8a9-fabe-3ec00f7b4393.1697753860.1.1697753860.1697753860.1613561419.1731917860487; _cs_cvars=%7B%7D; graceIncr=1; MSCC=NR; msresearch=%7B%22state%22%3A%7B%22name%22%3A%22IDLE%22%7D%2C%22userid%22%3A%221698191020276862661970848679%22%7D; fptctx2=H3ihr9e92IdW6yd1ZgQ9Sz4bj6XMGo9empP83sM5eweFT7rgF6BClkGOoMbV5lk1qCA7IPFTuqQStW7UxedESgL0mY0PZSR2qBB%252fD2ySRHypi08ZmsNip1zfmuLTBsUkTH7KpaQcUlx%252baMIejR8fXH3Bu%252fZvjok7KDEVsPF4XDtYoccrKCyu647ahNzLmBs72MjXpmmStO0z5dG%252bSd04FkmWy3X7G9LyCVFLo2iPa3LNAdcVH0qushmc8EVdV3OQPKaRD1UoTnzm8JmVJDVrs%252fLlwxsypBHd3%252byAbh2REJT1nnFZk%252bbHErsroy47fPZ4zPW7EA0Y4sac%252fd5l4%252bITig%253d%253d; mboxEdgeCluster=34; mbox=PC#f28873a6cfd4459b84a85f750c1725f0.34_0#1700865720|session#8297cc6a301642b69fbdbe606970d2e1#1698275580; AMCV_EA76ADE95776D2EC7F000101%40AdobeOrg=1585540135%7CMCIDTS%7C19655%7CMCMID%7C87913662653605234352589142141325703394%7CMCAAMLH-1698878519%7C9%7CMCAAMB-1698878519%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C-2042935117%7CMCOPTOUT-1698280919s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.0; _uetsid=fa81c0c072c611ee8ec5755b76ecb8d6; _uetvid=510a90a06ecd11eea397d109137af4ef; MUIDB=1AE6E50159A760F52A89F6735DA7669C; TSPREAUTHCOOKIE=true; clocale=en-us; deviceId=cfa355c6-89eb-4726-97f8-9e7a03460a01; firstTimeLaunch=1698273730584; DesiredAuth=msal2_dev3; TSREGIONCOOKIE=amer; platformid_asm=1415; skypetoken_asm=".concat(SKYPE, "; authtoken=Bearer%3D").concat(response.access, "%26Origin%3Dhttps%3A%2F%2Fteams.microsoft.com; clienttype=web; tenantId=1fd4673f-df96-4621-8638-a1d88c4c85d7; minimumVersionClientUpdateTries=0; ringFinder=%7B%22oid%22%3A%22a43ef9f7-f6c5-48b3-9007-6675d9ec7158%22%2C%22tid%22%3A%221fd4673f-df96-4621-8638-a1d88c4c85d7%22%7D; files-version=23092911200; sessionId=e55540d4-322f-e36c-bff4-8594a2ff0aba"),
                                            "Referer": "https://teams.microsoft.com/multi-window/?agent=web&version=23092911205",
                                            "Referrer-Policy": "strict-origin-when-cross-origin"
                                        },
                                        "body": "s-asamatham@lwsd.org",
                                        "method": "POST"
                                    })];
                            case 4:
                                r = _a.sent();
                                return [4 /*yield*/, r.json()];
                            case 5:
                                json = _a.sent();
                                console.log(json);
                                return [3 /*break*/, 8];
                            case 6: return [4 /*yield*/, request["continue"]()];
                            case 7:
                                _a.sent();
                                _a.label = 8;
                            case 8: return [2 /*return*/];
                        }
                    });
                }); });
                return [4 /*yield*/, page.goto(url + "&sso_reload=true")];
            case 5:
                _b.sent();
                // await page.setViewport({width: 1080, height: 720});
                return [4 /*yield*/, page.waitForSelector("#i0116")];
            case 6:
                // await page.setViewport({width: 1080, height: 720});
                _b.sent();
                return [4 /*yield*/, page.type("#i0116", "s-jgiri@lwsd.org")];
            case 7:
                _b.sent();
                return [4 /*yield*/, page.click("#idSIButton9")];
            case 8:
                _b.sent();
                return [4 /*yield*/, page.waitForTimeout(2700)];
            case 9:
                _b.sent();
                return [4 /*yield*/, page.waitForSelector("#i0118")];
            case 10:
                _b.sent();
                return [4 /*yield*/, page.type("#i0118", "Dogs(dogs5")];
            case 11:
                _b.sent();
                // await page.waitForTimeout(2000);
                return [4 /*yield*/, page.click("#idSIButton9")];
            case 12:
                // await page.waitForTimeout(2000);
                _b.sent();
                return [4 /*yield*/, page.waitForTimeout(1700)];
            case 13:
                _b.sent();
                return [4 /*yield*/, page.click("#idSIButton9")];
            case 14:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); })();
