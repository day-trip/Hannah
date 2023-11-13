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
var jsdom_1 = require("jsdom");
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
var INJECT = "window.addEventListener('load', (event) => {\n  setTimeout(() => {\n      console.log('Hello World');\n      console.log(window.ko.dataFor(document.getElementById(\"ftrPrivacy\")));\n      // console.log(document.getElementById(\"i0116\"));\n      console.log(document.body.children.length);\n      console.log(document.body.children[1].children[0].attributes);\n      console.log(document.body.children[1].children[0].children[0].children.length);\n  }, 5000);\n});"; // TODO: inline JS code and go knockoutin' crazy
var pca = new msal_node_1.PublicClientApplication(config);
var cryptoProvider = new msal_node_1.CryptoProvider();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, verifier, challenge, url, dom;
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
                return [4 /*yield*/, jsdom_1.JSDOM.fromURL(url + "&sso_reload=true", {
                        runScripts: "dangerously",
                        resources: new jsdom_1.ResourceLoader({
                            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                            strictSSL: false
                        }),
                        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                        // referrer: url,
                        includeNodeLocations: true
                    })];
            case 3:
                dom = _b.sent();
                dom.window.eval(INJECT);
                setTimeout(function () {
                    fs.writeFileSync("./pirate.html", dom.serialize());
                    console.log(dom.window.console.messages);
                }, 5000);
                return [2 /*return*/];
        }
    });
}); })();
