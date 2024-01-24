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
var danfo = require("danfojs-node");
var _ = require("lodash");
var fs = require("fs/promises");
var Queue = /** @class */ (function () {
    function Queue(batches, cooldown) {
        this.tasks = [];
        this.running = 0;
        this.batches = batches;
        this.cooldown = cooldown;
    }
    Queue.prototype.enqueue = function (task) {
        this.tasks.push(task);
        void this.process();
    };
    Queue.prototype.process = function () {
        return __awaiter(this, void 0, void 0, function () {
            var task;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.running < this.batches && this.tasks.length > 0)) return [3 /*break*/, 5];
                        task = this.tasks.shift();
                        if (!task) return [3 /*break*/, 5];
                        this.running++;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 5]);
                        return [4 /*yield*/, task()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, _this.cooldown); })];
                    case 4:
                        _a.sent();
                        this.running--;
                        void this.process();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Queue;
}());
var TOKEN = "Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6InM2cWIzeTF4d0lJWU1DOUZWS0o0VTN5REtxOW5oRVdfMFdXTlMtWVFtdmMiLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20vIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMWZkNDY3M2YtZGY5Ni00NjIxLTg2MzgtYTFkODhjNGM4NWQ3LyIsImlhdCI6MTcwMzA5OTMxNiwibmJmIjoxNzAzMDk5MzE2LCJleHAiOjE3MDMxMDQ5NTMsImFjY3QiOjAsImFjciI6IjEiLCJhY3JzIjpbInVybjp1c2VyOnJlZ2lzdGVyc2VjdXJpdHlpbmZvIl0sImFpbyI6IkFUUUF5LzhWQUFBQXZvdDFsWDUwQXZyVnI2QkRRYVJrc1QwNEQ1N2VoUUU3UEZleUtTN3dMc1NxaE5mYlpteEk4bFdiMnRJd0doTW0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6Ik1pY3Jvc29mdF9BQURfVXNlcnNBbmRUZW5hbnRzIiwiYXBwaWQiOiJmOTg4NWU2ZS02Zjc0LTQ2YjMtYjU5NS0zNTAxNTdhMjc1NDEiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkdJUkkiLCJnaXZlbl9uYW1lIjoiSkFJIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjYwMzo4MDBjOjRjNDA6NGIyYTo5MTFkOjg1YWM6YjNkNzo4MjVhIiwibmFtZSI6IkdJUkksIEpBSSIsIm9pZCI6ImE0M2VmOWY3LWY2YzUtNDhiMy05MDA3LTY2NzVkOWVjNzE1OCIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xMTk1ODQwOTkxLTE2MjMwODg5NzAtMTEzNjI2Mzg2MC0zNzExMzkiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzdGRkU5Q0U4MTk4MyIsInJoIjoiMC5BVmdBUDJmVUg1YmZJVWFHT0tIWWpFeUYxd01BQUFBQUFBQUF3QUFBQUFBQUFBRHlBTlEuIiwic2NwIjoiQWRtaW5pc3RyYXRpdmVVbml0LlJlYWRXcml0ZS5BbGwgQXVkaXRMb2cuUmVhZC5BbGwgRGlyZWN0b3J5LkFjY2Vzc0FzVXNlci5BbGwgRGlyZWN0b3J5LldyaXRlLlJlc3RyaWN0ZWQgZW1haWwgb3BlbmlkIE9yZ2FuaXphdGlvbi5SZWFkLkFsbCBQb2xpY3kuUmVhZFdyaXRlLkF1dGhvcml6YXRpb24gcHJvZmlsZSBVc2VyLkVuYWJsZURpc2FibGVBY2NvdW50LkFsbCBVc2VyLlJlYWRXcml0ZS5BbGwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJTUTZwU1Q2aVdXZlN6MTJDd1BweERsSENwVG9wcTZ0MEwwaTBTTlVmRmNzIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiMWZkNDY3M2YtZGY5Ni00NjIxLTg2MzgtYTFkODhjNGM4NWQ3IiwidW5pcXVlX25hbWUiOiJzLWpnaXJpQGx3c2Qub3JnIiwidXBuIjoicy1qZ2lyaUBsd3NkLm9yZyIsInV0aSI6IlZlQkNTaXE5Z0VxMVY2R2sxaGJkQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoiTE5BU0V5RXZpNmxmVGFIT3dJMEgwTXZjU3FZSlVwUng0MU5NeFNyYXVLMCJ9LCJ4bXNfdGNkdCI6MTM0MjU0MDc5MH0.iuYLyD2-r-EwO1NFrbvVCfp-C27pT-R650pWwhc24u621RCgmibLhtfLhJns6lmXecGVjFoRVRPekhHKtsfeRg36uTPY4ZZ7eW1KwXmV17DGog8dOrNAk-5RwuTyuSGOX177w3dZ57OiNA0QIspo78GcsmU3nmomUujJClqjbIuX4nzXmlKjS0c3p5XWJbVBe_sXSTAf6wfr-o5zZpJbtJr9vHMnOxepGMqUOrOsxbB4VyxrUDbHHoxUk5AbECAAmVsaQQ9eoUqfNen8vSBFULgb_44ogwJAvJ9No8upnDAFdQ_WWNUtdW9Qr5w-0xZ0E7lP081AzFh7Q48kHPBiGA";
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var processBatch = function (batch) { return __awaiter(void 0, void 0, void 0, function () {
    var mapping, r, json, _i, _a, picture, imageBuffer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mapping = {};
                return [4 /*yield*/, fetch("https://graph.microsoft.com/beta/$batch", {
                        "headers": {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "en-US,en;q=0.9",
                            "authorization": TOKEN,
                            "content-type": "application/json",
                            "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "cross-site",
                            "x-ms-client-request-id": "c9bb8b1a-9bc4-4766-8fb4-885023ce09a5",
                            "x-ms-client-session-id": "da5cd5972b1b4c6e9893d6fba6335f97",
                            "x-ms-command-name": "Common - GetPhotos",
                            "Referer": "https://sandbox-87-2.reactblade.portal.azure.net/",
                            "Referrer-Policy": "strict-origin-when-cross-origin"
                        },
                        body: JSON.stringify({
                            "requests": batch.map(function (bid) {
                                var id = generateUUID();
                                mapping[id] = bid;
                                return {
                                    "id": id,
                                    "method": "GET",
                                    "url": "/users/".concat(bid, "/photo/$value"),
                                    "headers": {
                                        "x-ms-command-name": "Shared - GetUserPhoto",
                                        "x-ms-client-request-id": generateUUID(),
                                        "x-ms-client-session-id": "c4cfc6591d9b4fca947a680a02655f3b"
                                    }
                                };
                            })
                        }),
                        method: "POST"
                    })];
            case 1:
                r = _b.sent();
                return [4 /*yield*/, r.json()];
            case 2:
                json = _b.sent();
                if (!json.responses) {
                    throw TypeError("Wrong access key - API failed!");
                }
                _i = 0, _a = json.responses;
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                picture = _a[_i];
                if (!picture.body.startsWith("/9j")) {
                    return [3 /*break*/, 5];
                }
                imageBuffer = Buffer.from(picture.body, 'base64');
                return [4 /*yield*/, fs.writeFile("pictures/".concat(mapping[picture.id], ".jpg"), imageBuffer)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/];
        }
    });
}); };
void (function () { return __awaiter(void 0, void 0, void 0, function () {
    var df, ids, batches, queue, _i, batches_1, batch;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, danfo.readCSV("./users_2023_12_16.csv")];
            case 1:
                df = _a.sent();
                ids = df["id"].values;
                batches = _.chunk(ids, 20);
                queue = new Queue(2, 2);
                for (_i = 0, batches_1 = batches; _i < batches_1.length; _i++) {
                    batch = batches_1[_i];
                    queue.enqueue(processBatch.bind(null, batch));
                }
                return [2 /*return*/];
        }
    });
}); })();
