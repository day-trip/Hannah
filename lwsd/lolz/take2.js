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
var _this = this;
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
(function () { return __awaiter(_this, void 0, void 0, function () {
    var r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch("https://login.microsoftonline.com/common/login", {
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
                        "Referrer-Policy": "strict-origin-when-cross-origin"
                    },
                    "body": "i13=0&login=s-jgiri%40lwsd.org&loginfmt=s-jgiri%40lwsd.org&type=11&LoginOptions=3&lrt=&lrtPartition=&hisRegion=&hisScaleUnit=&passwd=Dogs%28dogs5&ps=2&psRNGCDefaultType=&psRNGCEntropy=&psRNGCSLK=&canary=bxMm85HnTEdKOoGROr%2B3Hy%2B5H5b%2BwVYjQuOCWvmo7tc%3D3%3A1%3ACANARY%3AYITw6ux5J5Wq0X0L6I546XpmC%2BunLRjDSBFnP3J7lTo%3D&ctx=rQQIARAAhZHPa9NgGMebZqtddVvZwAn-oJQhojZN0jZrC1PXruuy9cc6u7WpyEjfvGnTJnmzvOnPsZuI7LSjbCcFLz3NXSZe9LzTEAXZXyADQUTQk9oiXpUHvjxf-B6ez_N1OViKiVD0TZKl6Oh0CAYA5ADtY8uM7Auy4ZAvLAXLvpkQhDPh_gSCnDnhch8k3k092ufuHT3-KU39KqR6xLWqZRk46vdbUNQwpSnARBjJFgWQ5q-gVwRxQhCfCKJnnwYcG2YhhL4ILANfMMyFfBEpyPqC0gwj05xIi0Hu1D6enWtYVXYgyFS68Mw-hqEKgbUhAoAauvXV7pRNsaJB3dojDdhZMkpxnuNrajVdq3fSeb6dysdq6W7CysyXlFKcDgoFvpXKg3amW2ll5xe0UjJHpzs85jVGlZIJJatjRSyE6FJxqSoEVo0yG1qDxZjK15ACtPW6WFxShUBOkYv0bI-88pdYNBQKGyKAmML1jgEHyIfkKDIroq50RUtBOj4m4_-K-ykJymJDtTzIgLoieQwTyYoKPUiWVUWHA2aI8UeSOBkizoYuOu3uyUs2j-3GdZqMOp0ut23gfgwRz4f77RRefLusXl3mj3Y2n-3dvUMcD_sbnFoMLWfpitnScnUh3FkszDXjUkEyjPuxGEjUNaRUmCaTU9BsJMrsOohdx-ShY8RJum1eMr7CHDvGNSyqVA1TZRO1MDS_OIgn52yvR_7T_FMX0XPdqi9EGolKe7FWWteE5TVmLWwZ-bmSuhkRNhuRVmspJXRjsP9qExy4iJPzxOmFsMsBVFHR8AS15f3Dv2GhOtS90S1vW8MbAAy2pqg2IPZGH3j7V3ofbm9vvx21_Rjbf7_z5sPL758Xz8ZvJ3NpdrW5XkUaU00KOaacSUGuZi7Q_Eo9r5cz1SQulzpCmmvkZg_ctt81&hpgrequestid=d758099e-190b-4ad5-8a23-35722d082e00&flowToken=AQABAAEAAAAmoFfGtYxvRrNriQdPKIZ-mDjGA_QGjXQnMu-vU-omvm5mHkM7JxTifu5RXVHSucDOlId3WO49tJ2BbAl9IiFbJuoOiyLFfavjp-9IDThWjyF1prgRTY9LS6iIfqa_3wddcmU_GVgf6FzBF4YRqY2v83Ap5Gtd-CaAcHN7n4GaSRuIWwUMg5v0JbOwnNelfkItttvbW5LnDZo2WGl6QW34tW3P45x1UhGB6fO7OY5VysdCzPk4VQZOWrAu3wS3l2gSbnFpzs9dHMpJ7vvkI_WFsOREWXlByXpwTpYW6zqRSgAWWj7b7bE-oNNjT3v_4GN6_097UmdG2onS25Ygy5mORJlVvGwfkpZL7j3eme9C6cvAqSbijDkszdb26nO6l0axpo_-ZABSbKpLQzX2gEqUvejwJNdAt6Fc0JAKqWYF_wpCKYb9j_zz0njjINplVPFo5lPszZqZO5VyEGPDn7n1oKY61-Rz9MhcQJP2mQfreyaMVcAhswMQ3M3xUeHZOnpM5Gwh48UMCiUXeYC7HpWZS8j7DRLSlJ5Cv6lW1aKGIdlsv7H83BdQeTaNH5MC_7H-NppfImt5vIW8eLSajcvReJJsq7VFB63po31Ynp3WaoU0VGcy68cGE6aGhFafH_NCSzbRa2g296yBarp9NNxSOJf_2vFUyY8GOiP_L0720CAA&PPSX=&NewUser=1&FoundMSAs=&fspost=0&i21=0&CookieDisclosure=0&IsFidoSupported=1&isSignupPost=0&i19=52809",
                    "method": "POST"
                })];
            case 1:
                r = _a.sent();
                console.log(r.status);
                console.log(r.statusText);
                console.log(r.headers.getSetCookie());
                return [2 /*return*/];
        }
    });
}); })();
