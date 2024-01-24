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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
function getQueryParam(url, param) {
    param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + param + "=([^&#]*)");
    var results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var browserFetch = function (url, init) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, r, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                init.headers = __assign(__assign({}, (init.headers || {})), { "accept": "*/*", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"", "sec-ch-ua-mobile": "?0", "sec-ch-ua-platform": "\"Windows\"", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "sec-fetch-user": "?1", "upgrade-insecure-requests": "1", "Referrer-Policy": "strict-origin-when-cross-origin", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36" });
                if (!init.headers["Referer"] && init.source) {
                    init.headers["Referer"] = init.source;
                }
                if (!init.headers["Origin"] && init.source) {
                    init.headers["Origin"] = (new URL(init.source)).origin;
                }
                if (!init.cookie) return [3 /*break*/, 2];
                _a = init.headers;
                _b = "cookie";
                return [4 /*yield*/, init.cookie.getCookieString(init.source || url)];
            case 1:
                _a[_b] = _d.sent();
                _d.label = 2;
            case 2: return [4 /*yield*/, fetch(url, init)];
            case 3:
                r = _d.sent();
                _c = r;
                return [4 /*yield*/, r.text()];
            case 4:
                _c.content = _d.sent();
                if (init.cookie) {
                    r.headers.getSetCookie().forEach(function (cookie) {
                        init.cookie.setCookieSync(cookie, init.source || url);
                    });
                }
                return [2 /*return*/, r];
        }
    });
}); };
void (function () { return __awaiter(void 0, void 0, void 0, function () {
    var username, password, app_id, p, login_url, pp, code, r, _a, token, gwsToken, rr, apps, bim, url, bimPage, loc, redr;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                username = "s-jgiri";
                password = "Dogs)dogs5";
                app_id = 652890;
                return [4 /*yield*/, fetch("https://launchpad.classlink.com/login", {
                        "headers": {
                            "accept": "*/*",
                            "accept-language": "en-US,en;q=0.9",
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "csrf-token": "HaWdqH3R-BeFaK06gDFNFGCV1CkBKQlrcy9U",
                            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "x-requested-with": "XMLHttpRequest",
                            "cookie": "_csrf=XCk-6SV1xqWo_h97hRsvVOin; baseurl=%2Flwsd; clsession=s%3AW52kgcMZFmLD4KNxM9AhiauuBrSbtsrM.S1TsBD1SCwyJH6TBc%2BXfEnNymr30oNXD7REAuRgpmbM",
                            "Referer": "https://launchpad.classlink.com/lwsd",
                            "Referrer-Policy": "strict-origin-when-cross-origin"
                        },
                        "body": "username=s-jgiri%40lwsd.org&password=Dogs)dogs5&os=Windows&userdn=&code=lwsd&Browser=Chrome&Resolution=1536x864",
                        "method": "POST"
                    })];
            case 1:
                p = _b.sent();
                return [4 /*yield*/, p.json()];
            case 2:
                login_url = (_b.sent()).login_url;
                console.log(login_url);
                return [4 /*yield*/, fetch(login_url, {
                        "headers": {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                            "accept-language": "en-US,en;q=0.9",
                            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "same-origin",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1",
                            "cookie": "_csrf=XCk-6SV1xqWo_h97hRsvVOin; baseurl=%2Flwsd; clsession=s%3AW52kgcMZFmLD4KNxM9AhiauuBrSbtsrM.S1TsBD1SCwyJH6TBc%2BXfEnNymr30oNXD7REAuRgpmbM",
                            "Referer": "https://launchpad.classlink.com/lwsd",
                            "Referrer-Policy": "strict-origin-when-cross-origin"
                        },
                        "method": "GET",
                    })];
            case 3:
                pp = _b.sent();
                code = getQueryParam(pp.url, "code");
                console.log("Code", code);
                return [4 /*yield*/, fetch("https://applications.apis.classlink.com/exchangeCode?code=".concat(code, "&response_type=code"), {
                        headers: {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "en-US,en;q=0.9",
                            "content-type": "application/json",
                            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-site"
                        },
                        referrerPolicy: "same-origin",
                        method: "GET"
                    })];
            case 4:
                r = _b.sent();
                return [4 /*yield*/, r.json()];
            case 5:
                _a = _b.sent(), token = _a.token, gwsToken = _a.gwsToken;
                console.log(token, gwsToken);
                return [4 /*yield*/, fetch("https://applications.apis.classlink.com/v1/applicationsPageLoad?", {
                        headers: {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "en-US,en;q=0.9",
                            "authorization": "Bearer ".concat(token),
                            "content-type": "application/json",
                            "if-none-match": "W/\"9389-mdhboWO9EE3j3d78IOUGYKEs+7U\"",
                            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-site"
                        },
                        referrerPolicy: "same-origin",
                        method: "GET"
                    })];
            case 6:
                rr = _b.sent();
                return [4 /*yield*/, rr.json()];
            case 7:
                apps = (_b.sent()).apps;
                bim = apps.find(function (x) { return x.id === app_id; });
                url = bim.url[0];
                console.log("Visiting:", url);
                return [4 /*yield*/, fetch(url, {
                        "headers": {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                            "accept-language": "en-US,en;q=0.9",
                            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "none",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1",
                            "Referer": "https://myapps.classlink.com/home",
                        },
                        referrerPolicy: "strict-origin-when-cross-origin",
                        method: "GET",
                        redirect: "manual",
                    })];
            case 8:
                bimPage = _b.sent();
                loc = bimPage.headers.get("Location");
                console.log(loc);
                return [4 /*yield*/, fetch(loc, {
                        "headers": {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                            "accept-language": "en-US,en;q=0.9",
                            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "document",
                            "sec-fetch-mode": "navigate",
                            "sec-fetch-site": "none",
                            "sec-fetch-user": "?1",
                            "upgrade-insecure-requests": "1",
                            "cookie": "_csrf=XCk-6SV1xqWo_h97hRsvVOin; baseurl=%2Flwsd; clsession=s%3AW52kgcMZFmLD4KNxM9AhiauuBrSbtsrM.S1TsBD1SCwyJH6TBc%2BXfEnNymr30oNXD7REAuRgpmbM",
                        },
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "method": "GET",
                        redirect: "manual",
                    })];
            case 9:
                redr = _b.sent();
                console.log(redr.headers.get("Location"));
                return [2 /*return*/];
        }
    });
}); })();
