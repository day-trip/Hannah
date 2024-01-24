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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var ivm = require("isolated-vm");
var BIMAssignment = /** @class */ (function () {
    function BIMAssignment(data, security, parent) {
        this.data = data;
        this.security = security;
        this.parent = parent;
    }
    BIMAssignment.prototype.getQuestionResponse = function (question) {
        if (question.type === "graphplotting") {
            var actions = [];
            for (var _i = 0, _a = question.validation.valid_response.value; _i < _a.length; _i++) {
                var x = _a[_i];
                var id = x.id, type = x.type, rest = __rest(x, ["id", "type"]);
                var args = type === "polygon" ? Object.values(rest.subElementsIds).join(", ") : Object.values(rest.coords).join(",");
                actions.push("".concat(type, "(").concat(args, ") << id: '").concat(id, "', ").concat(type === "polygon" ? "recursionDepthHigh: 13, recursionDepthLow: 8" : "snaptogrid: true, snapsizex: 1, snapsizey: 1", " >>"));
            }
            return ["object", {
                    "actions": actions.join(";") + ";",
                    "undo": question.validation.valid_response.value.map(function (x) { return "remove(".concat(x.id, ")"); }).join(";") + ";",
                    "composition": question.validation.valid_response.value,
                }];
        }
        if (question.type === "clozedropdown" || question.type === "mcq") {
            return ["array", question.validation.valid_response.value];
        }
        if (question.type === "clozeformula") {
            return ["array", [question.validation.valid_response.value]];
        }
        if (question.type === "formulaV2") {
            return ["string", question.validation.valid_response.value];
        }
        throw new Error("The question type ".concat(question.type, " is unknown!"));
    };
    BIMAssignment.prototype.DO_NOT_CALL_THIS = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, questions, body, response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.data.data.request.config.metadata.items.map(function (x) { return (__assign(__assign({}, x), { attempt_status: "fully_attempted" })); });
                        questions = this.data.data.apiActivity.items.flatMap(function (x) { return x.questions; });
                        body = {
                            "submit": false, //
                            "state": this.data.data.request.state, //
                            "user_id": this.security.user_id, //
                            "activity_id": this.data.data.request.activity_id, //
                            "activity_name": this.data.data.request.name, //
                            "course_id": "none", //
                            "session_id": this.parent.session_id, //
                            "metadata": {
                                "items": items, //
                                "items_api_version": "v1.120.2", //
                                "activity_template_id": this.data.data.request.activity_template_id, //
                                "current_time": 5935,
                                "current_reading_time": false,
                                "max_time": 0,
                                "current_item_reference": items[1].reference, //
                                "features": {},
                                "user_agent": "Mozilla/5.0+(Windows+NT+10.0;+Win64;+x64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+Chrome/120.0.0.0+Safari/537.36",
                                "last_item_reference": items[0].reference, //
                                "question_types": this.data.data.apiActivity.metadata.question_types, //
                                "existing_session": true, //
                                "current_item_position": 9, //
                                "current_sheet_position": 1 //
                            },
                            "init_metadata": { "id": "a8cefa0d-c2dc-4636-92eb-07b9e034103c", "time": 1704922279, "deviceTime": false },
                            "questionResponses": questions.map(function (question) {
                                var _a = _this.getQuestionResponse(question), type = _a[0], data = _a[1];
                                return {
                                    id: "0258_".concat(_this.security.user_id, "_").concat(question.response_id),
                                    response: {
                                        "value": data,
                                        "type": type,
                                        "apiVersion": "v2.203.2",
                                        "revision": 1,
                                        "metadata": {
                                            "check_ans_count": 1
                                        }
                                    }
                                };
                            }),
                            "metricsContext": ["itemsapi", "assessapi"] //
                        };
                        return [4 /*yield*/, this.parent.request("update", "https://questions.learnosity.com/latest/questionresponses?", { "consumer_key": "8EO6ataGL8M5Tuxx", "domain": "www.bigideasmath.com", "timestamp": this.data.data.apiActivity.questionsApiActivity.timestamp, "user_id": "USRstudent37941401101061", "signature": this.data.data.apiActivity.questionsApiActivity.signature }, body, "usrequest", false)];
                    case 1:
                        response = _a.sent();
                        console.log(response);
                        return [2 /*return*/];
                }
            });
        });
    };
    return BIMAssignment;
}());
var BigIdeasMath = /** @class */ (function () {
    function BigIdeasMath(session, key) {
        this.session_id = session;
        this.consumer_key = key;
    }
    BigIdeasMath.from = function (as) {
        var cookies = Object.fromEntries(as.headers.getSetCookie().map(function (x) { return ([x.split(";")[0].split("=")[0], x.split(";")[0].split("=")[1]]); }));
        var session = cookies["BIM.SESSION.ID"];
        console.log("Session:", session);
        return new BigIdeasMath(session, "8EO6ataGL8M5Tuxx"); // LWSD consumer key???
    };
    BigIdeasMath.prototype.request = function (method, url, security, request, key, timestamp) {
        if (key === void 0) { key = "request"; }
        if (timestamp === void 0) { timestamp = true; }
        return __awaiter(this, void 0, void 0, function () {
            var formData, queryString, r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new FormData();
                        formData.append('action', method);
                        formData.append('security', JSON.stringify(security));
                        formData.append(key, JSON.stringify(request));
                        if (timestamp) {
                            formData.append('requestTimestamp', String(Date.now()));
                        }
                        queryString = Array.from(formData.entries()).map(function (pair) { return pair[0] + '=' + encodeURIComponent(String(pair[1])); }).join('&').replace("%20", "+");
                        return [4 /*yield*/, fetch("".concat(url, "?&a=").concat(method, "&c=").concat(this.consumer_key, "&s=").concat(request.session_id), {
                                headers: {
                                    "accept": "*/*",
                                    "accept-language": "en-US,en;q=0.9",
                                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                    "Referer": "https://items.learnosity.com/v2023.1.LTS/xdomain",
                                    "Referrer-Policy": "strict-origin-when-cross-origin"
                                },
                                body: queryString,
                                method: "POST"
                            })];
                    case 1:
                        r = _a.sent();
                        return [2 /*return*/, r.json()];
                }
            });
        });
    };
    BigIdeasMath.prototype.getActivity = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, r, security, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.activityInit(request)];
                    case 1:
                        _a = _b.sent(), r = _a.request, security = _a.security;
                        return [4 /*yield*/, this.request("get", "https://items.learnosity.com/v2023.1.LTS/activity", security, r)];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, new BIMAssignment(response, security, this)];
                }
            });
        });
    };
    BigIdeasMath.prototype.activityInit = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://www.bigideasmath.com/MRL/rest/learnosity/assignment-init?assignmentId=".concat(request.id), {
                            headers: {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "en-US,en;q=0.9",
                                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "cookie": "BIM.SESSION.ID=".concat(this.session_id, ";"),
                                "Referer": "https://www.bigideasmath.com/MRL/public/app/",
                                "Referrer-Policy": "strict-origin-when-cross-origin"
                            },
                            method: "GET"
                        })];
                    case 1:
                        r = _a.sent();
                        return [4 /*yield*/, r.json()];
                    case 2: return [2 /*return*/, (_a.sent()).learnosity];
                }
            });
        });
    };
    return BigIdeasMath;
}());
var Skyward = /** @class */ (function () {
    function Skyward(data) {
        this.data = data;
    }
    Skyward.create = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Skyward(data)];
            });
        });
    };
    Skyward.prototype.getQueryString = function () {
        var formData = new FormData();
        formData.append('dwd', this.data.dwd);
        formData.append('wfaacl', this.data.wfaacl);
        formData.append('encses', this.data.encses);
        formData.append('nameid', this.data.nameid);
        formData.append('duserid', this.data.username);
        formData.append('hAnon', 'bjlbYpAByijcxUsV');
        formData.append('web-data-recid', this.data.web_data_recid);
        formData.append('wfaacl-recid', this.data.wfaacl_recid);
        formData.append('User-Type', this.data.user_type);
        formData.append('enc', this.data.enc);
        return Array.from(formData.entries()).map(function (pair) { return pair[0] + '=' + encodeURIComponent(String(pair[1])); }).join('&');
    };
    Skyward.prototype.getAttribute = function ($, field) {
        return $("label:contains('".concat(field + ":", "')")).parent().next().html();
    };
    Skyward.prototype.getStudentInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rr, html, $, gender, student_id, birthday, family_id, box, table, address, pgt, pgn, table2, pgpp, pgp, raw, guardians;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://www2.saas.wa-k12.net/scripts/cgiip.exe/WService=wlkwashs71/sfstudentinfo001.w", {
                            "headers": {
                                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                                "accept-language": "en-US,en;q=0.9",
                                "cache-control": "max-age=0",
                                "content-type": "application/x-www-form-urlencoded",
                                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "document",
                                "sec-fetch-mode": "navigate",
                                "sec-fetch-site": "same-origin",
                                "sec-fetch-user": "?1",
                                "upgrade-insecure-requests": "1",
                                "Referer": "https://www2.saas.wa-k12.net/scripts/cgiip.exe/WService=wlkwashs71/fwemnu01.w",
                                "Referrer-Policy": "strict-origin-when-cross-origin"
                            },
                            "body": this.getQueryString(),
                            "method": "POST"
                        })];
                    case 1:
                        rr = _a.sent();
                        return [4 /*yield*/, rr.text()];
                    case 2:
                        html = _a.sent();
                        $ = cheerio.load(html);
                        gender = this.getAttribute($, "Gender").toLowerCase();
                        student_id = Number.parseInt(this.getAttribute($, "Other ID"));
                        birthday = Date.parse(this.getAttribute($, "Age (Birthday)").split("(")[1].split(")")[0]);
                        family_id = Number.parseInt(this.getAttribute($, "Family ID"));
                        box = $("div").filter(function (_, e) { return $(e).css('display') === 'none'; }).first().children().first();
                        table = box.children("div.sf_gridTableWrap").children().first().children().first().children().toArray();
                        address = $(table[1]).children().first().children().first().html().replace("\n", " ");
                        pgt = $(table[2]).children().first().children().first().children().first().children().first().children("tbody").children("tr").toArray();
                        pgn = box.children("div.sfTag").text().split("(")[0].trimEnd();
                        table2 = $($(table[1]).children("td").toArray()[2]).children("div").first().children("div").first().children("table").first().children("tbody").toArray();
                        pgpp = $($(table2[2]).children().first().children().toArray()[1]).children().first().text().split(" EXT. ");
                        console.log(pgpp);
                        pgp = pgpp[0] + " (" + pgpp[1] + ")";
                        raw = pgt.map(function (p) { return $(p).children("td").toArray().map(function (c) { return $(c).html(); }); }).map(function (_a) {
                            var first = _a[0], rest = _a.slice(1);
                            var text = $(first).text().split("(");
                            return __spreadArray([text[0].trimEnd(), text[1].split(")")[0].toLowerCase()], rest, true);
                        });
                        guardians = raw.map(function (_a) {
                            var name = _a[0], role = _a[1], p1 = _a[2], p2 = _a[3], email = _a[4], work = _a[5];
                            return ({
                                name: name,
                                role: role,
                                phone: [p1, p2, pgn === name ? pgp : undefined].map(function (x) { return x === "&nbsp;" ? undefined : x; }).filter(function (x) { return !!x; }),
                                email: email === "&nbsp;" ? undefined : email,
                                work: work === "&nbsp;" ? undefined : work,
                            });
                        });
                        return [2 /*return*/, {
                                address: address,
                                gender: gender,
                                student_id: student_id,
                                birthday: birthday,
                                guardians: guardians,
                                family_id: family_id,
                            }];
                }
            });
        });
    };
    return Skyward;
}());
var Classlink = /** @class */ (function () {
    function Classlink() {
    }
    Classlink.getQueryParam = function (url, param) {
        param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + param + "=([^&#]*)");
        var results = regex.exec(url);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    Classlink.session = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var csrf, clsession, p, login_url, pp, code, r, _a, token, gwsToken;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        csrf = "HDmLCUPL6i2B-vOXFfDdd3FL";
                        clsession = "s%3A-CAPaYlIt5WHyJ5nWv4b4I2hu6N6pX4J.V%2BwtoVVxsREhCk92GovocNIs9ZQyHRGLmw7WZf9jTPE";
                        return [4 /*yield*/, fetch("https://launchpad.classlink.com/login", {
                                headers: {
                                    "accept": "*/*",
                                    "accept-language": "en-US,en;q=0.9",
                                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                    "csrf-token": "PhQ1Q6d0-bn51TisrLhopvODe2at6fjqQ25s",
                                    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                    "x-requested-with": "XMLHttpRequest",
                                    "cookie": "_csrf=".concat(csrf, "; baseurl=%2Flwsd; clsession=").concat(clsession),
                                    "Referer": "https://launchpad.classlink.com/lwsd",
                                    "Referrer-Policy": "strict-origin-when-cross-origin"
                                },
                                body: "username=".concat(encodeURIComponent(username), "&password=").concat(encodeURIComponent(password), "&os=Windows&userdn=&code=lwsd&Browser=Chrome&Resolution=1536x864"),
                                method: "POST"
                            })];
                    case 1:
                        p = _b.sent();
                        return [4 /*yield*/, p.json()];
                    case 2:
                        login_url = (_b.sent()).login_url;
                        console.log(login_url);
                        return [4 /*yield*/, fetch(login_url, {
                                headers: {
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
                                    "cookie": "_csrf=".concat(csrf, "; baseurl=%2Flwsd; clsession=").concat(clsession),
                                    "Referer": "https://launchpad.classlink.com/lwsd",
                                    "Referrer-Policy": "strict-origin-when-cross-origin"
                                },
                                method: "GET",
                            })];
                    case 3:
                        pp = _b.sent();
                        code = Classlink.getQueryParam(pp.url, "code");
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
                        return [4 /*yield*/, ClasslinkSession.create(csrf, clsession, token, gwsToken)];
                    case 6: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    return Classlink;
}());
var ClasslinkSession = /** @class */ (function () {
    function ClasslinkSession(csrf, clsession, token, gToken) {
        this.csrf = csrf;
        this.clsession = clsession;
        this.token = token;
        this.gToken = gToken;
    }
    ClasslinkSession.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rr, apps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://applications.apis.classlink.com/v1/applicationsPageLoad?", {
                            headers: {
                                "accept": "application/json, text/plain, */*",
                                "accept-language": "en-US,en;q=0.9",
                                "authorization": "Bearer ".concat(this.token),
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
                    case 1:
                        rr = _a.sent();
                        return [4 /*yield*/, rr.json()];
                    case 2:
                        apps = (_a.sent()).apps;
                        this.apps = apps.flatMap(function (app) { return app.apps || []; });
                        return [2 /*return*/];
                }
            });
        });
    };
    ClasslinkSession.create = function (csrf, clsession, token, gToken) {
        return __awaiter(this, void 0, void 0, function () {
            var cs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cs = new ClasslinkSession(csrf, clsession, token, gToken);
                        return [4 /*yield*/, cs.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, cs];
                }
            });
        });
    };
    ClasslinkSession.prototype.extractHTMLConfig = function (html) {
        return __awaiter(this, void 0, void 0, function () {
            var $, script, isolate, context, jail;
            return __generator(this, function (_a) {
                $ = cheerio.load(html);
                script = $('head script').html();
                isolate = new ivm.Isolate({ memoryLimit: 128 });
                context = isolate.createContextSync();
                jail = context.global;
                jail.setSync('global', jail.derefInto());
                return [2 /*return*/, new Promise(function (resolve) {
                        jail.setSync("complete", function (x) {
                            resolve(x);
                        });
                        context.evalSync(script + ";complete(IdConfig);");
                    })];
            });
        });
    };
    ClasslinkSession.prototype.getCrypto = function () {
        // @ts-ignore
        var CryptoJS = CryptoJS || function (c) { function r() { } var t = {}, e = t.lib = {}, i = e.Base = { extend: function (t) { r.prototype = this; var e = new r; return t && e.mixIn(t), e.hasOwnProperty("init") || (e.init = function () { e.$super.init.apply(this, arguments); }), (e.init.prototype = e).$super = this, e; }, create: function () { var t = this.extend(); return t.init.apply(t, arguments), t; }, init: function () { }, mixIn: function (t) { for (var e in t)
                t.hasOwnProperty(e) && (this[e] = t[e]); t.hasOwnProperty("toString") && (this.toString = t.toString); }, clone: function () { return this.init.prototype.extend(this); } }, a = e.WordArray = i.extend({ init: function (t, e) { t = this.words = t || [], this.sigBytes = null != e ? e : 4 * t.length; }, toString: function (t) { return (t || o).stringify(this); }, concat: function (t) { var e = this.words, r = t.words, i = this.sigBytes; if (t = t.sigBytes, this.clamp(), i % 4)
                for (var n = 0; n < t; n++)
                    e[i + n >>> 2] |= (r[n >>> 2] >>> 24 - n % 4 * 8 & 255) << 24 - (i + n) % 4 * 8;
            else if (65535 < r.length)
                for (n = 0; n < t; n += 4)
                    e[i + n >>> 2] = r[n >>> 2];
            else
                e.push.apply(e, r); return this.sigBytes += t, this; }, clamp: function () { var t = this.words, e = this.sigBytes; t[e >>> 2] &= 4294967295 << 32 - e % 4 * 8, t.length = c.ceil(e / 4); }, clone: function () { var t = i.clone.call(this); return t.words = this.words.slice(0), t; }, random: function (t) { for (var e = [], r = 0; r < t; r += 4)
                e.push(4294967296 * c.random() | 0); return new a.init(e, t); } }), n = t.enc = {}, o = n.Hex = { stringify: function (t) { var e = t.words; t = t.sigBytes; for (var r = [], i = 0; i < t; i++) {
                var n = e[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                r.push((n >>> 4).toString(16)), r.push((15 & n).toString(16));
            } return r.join(""); }, parse: function (t) { for (var e = t.length, r = [], i = 0; i < e; i += 2)
                r[i >>> 3] |= parseInt(t.substr(i, 2), 16) << 24 - i % 8 * 4; return new a.init(r, e / 2); } }, s = n.Latin1 = { stringify: function (t) { var e = t.words; t = t.sigBytes; for (var r = [], i = 0; i < t; i++)
                r.push(String.fromCharCode(e[i >>> 2] >>> 24 - i % 4 * 8 & 255)); return r.join(""); }, parse: function (t) { for (var e = t.length, r = [], i = 0; i < e; i++)
                r[i >>> 2] |= (255 & t.charCodeAt(i)) << 24 - i % 4 * 8; return new a.init(r, e); } }, f = n.Utf8 = { stringify: function (t) { try {
                return decodeURIComponent(escape(s.stringify(t)));
            }
            catch (t) {
                throw Error("Malformed UTF-8 data");
            } }, parse: function (t) { return s.parse(unescape(encodeURIComponent(t))); } }, h = e.BufferedBlockAlgorithm = i.extend({ reset: function () { this._data = new a.init, this._nDataBytes = 0; }, _append: function (t) { "string" == typeof t && (t = f.parse(t)), this._data.concat(t), this._nDataBytes += t.sigBytes; }, _process: function (t) { var e = this._data, r = e.words, i = e.sigBytes, n = this.blockSize, o = i / (4 * n); if (t = (o = t ? c.ceil(o) : c.max((0 | o) - this._minBufferSize, 0)) * n, i = c.min(4 * t, i), t) {
                for (var s = 0; s < t; s += n)
                    this._doProcessBlock(r, s);
                s = r.splice(0, t), e.sigBytes -= i;
            } return new a.init(s, i); }, clone: function () { var t = i.clone.call(this); return t._data = this._data.clone(), t; }, _minBufferSize: 0 }); e.Hasher = h.extend({ cfg: i.extend(), init: function (t) { this.cfg = this.cfg.extend(t), this.reset(); }, reset: function () { h.reset.call(this), this._doReset(); }, update: function (t) { return this._append(t), this._process(), this; }, finalize: function (t) { return t && this._append(t), this._doFinalize(); }, blockSize: 16, _createHelper: function (r) { return function (t, e) { return new r.init(e).finalize(t); }; }, _createHmacHelper: function (r) { return function (t, e) { return new u.HMAC.init(r, e).finalize(t); }; } }); var u = t.algo = {}; return t; }(Math);
        !function () { var a = CryptoJS.lib.WordArray; CryptoJS.enc.Base64 = { stringify: function (t) { var e = t.words, r = t.sigBytes, i = this._map; t.clamp(), t = []; for (var n = 0; n < r; n += 3)
                for (var o = (e[n >>> 2] >>> 24 - n % 4 * 8 & 255) << 16 | (e[n + 1 >>> 2] >>> 24 - (n + 1) % 4 * 8 & 255) << 8 | e[n + 2 >>> 2] >>> 24 - (n + 2) % 4 * 8 & 255, s = 0; s < 4 && n + .75 * s < r; s++)
                    t.push(i.charAt(o >>> 6 * (3 - s) & 63)); if (e = i.charAt(64))
                for (; t.length % 4;)
                    t.push(e); return t.join(""); }, parse: function (t) { var e = t.length, r = this._map; !(i = r.charAt(64)) || -1 != (i = t.indexOf(i)) && (e = i); for (var i = [], n = 0, o = 0; o < e; o++)
                if (o % 4) {
                    var s = r.indexOf(t.charAt(o - 1)) << o % 4 * 2, c = r.indexOf(t.charAt(o)) >>> 6 - o % 4 * 2;
                    i[n >>> 2] |= (s | c) << 24 - n % 4 * 8, n++;
                } return a.create(i, n); }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" }; }(), function (o) { function m(t, e, r, i, n, o, s) { return ((t = t + (e & r | ~e & i) + n + s) << o | t >>> 32 - o) + e; } function z(t, e, r, i, n, o, s) { return ((t = t + (e & i | r & ~i) + n + s) << o | t >>> 32 - o) + e; } function C(t, e, r, i, n, o, s) { return ((t = t + (e ^ r ^ i) + n + s) << o | t >>> 32 - o) + e; } function w(t, e, r, i, n, o, s) { return ((t = t + (r ^ (e | ~i)) + n + s) << o | t >>> 32 - o) + e; } for (var t = CryptoJS, e = (i = t.lib).WordArray, r = i.Hasher, i = t.algo, D = [], n = 0; n < 64; n++)
            D[n] = 4294967296 * o.abs(o.sin(n + 1)) | 0; i = i.MD5 = r.extend({ _doReset: function () { this._hash = new e.init([1732584193, 4023233417, 2562383102, 271733878]); }, _doProcessBlock: function (t, e) { for (var r = 0; r < 16; r++) {
                var i = t[n = e + r];
                t[n] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8);
            } r = this._hash.words; var n = t[e + 0], o = (i = t[e + 1], t[e + 2]), s = t[e + 3], c = t[e + 4], a = t[e + 5], f = t[e + 6], h = t[e + 7], u = t[e + 8], p = t[e + 9], d = t[e + 10], l = t[e + 11], y = t[e + 12], _ = t[e + 13], v = t[e + 14], g = t[e + 15], B = m(B = r[0], k = r[1], x = r[2], S = r[3], n, 7, D[0]), S = m(S, B, k, x, i, 12, D[1]), x = m(x, S, B, k, o, 17, D[2]), k = m(k, x, S, B, s, 22, D[3]); B = m(B, k, x, S, c, 7, D[4]), S = m(S, B, k, x, a, 12, D[5]), x = m(x, S, B, k, f, 17, D[6]), k = m(k, x, S, B, h, 22, D[7]), B = m(B, k, x, S, u, 7, D[8]), S = m(S, B, k, x, p, 12, D[9]), x = m(x, S, B, k, d, 17, D[10]), k = m(k, x, S, B, l, 22, D[11]), B = m(B, k, x, S, y, 7, D[12]), S = m(S, B, k, x, _, 12, D[13]), x = m(x, S, B, k, v, 17, D[14]), B = z(B, k = m(k, x, S, B, g, 22, D[15]), x, S, i, 5, D[16]), S = z(S, B, k, x, f, 9, D[17]), x = z(x, S, B, k, l, 14, D[18]), k = z(k, x, S, B, n, 20, D[19]), B = z(B, k, x, S, a, 5, D[20]), S = z(S, B, k, x, d, 9, D[21]), x = z(x, S, B, k, g, 14, D[22]), k = z(k, x, S, B, c, 20, D[23]), B = z(B, k, x, S, p, 5, D[24]), S = z(S, B, k, x, v, 9, D[25]), x = z(x, S, B, k, s, 14, D[26]), k = z(k, x, S, B, u, 20, D[27]), B = z(B, k, x, S, _, 5, D[28]), S = z(S, B, k, x, o, 9, D[29]), x = z(x, S, B, k, h, 14, D[30]), B = C(B, k = z(k, x, S, B, y, 20, D[31]), x, S, a, 4, D[32]), S = C(S, B, k, x, u, 11, D[33]), x = C(x, S, B, k, l, 16, D[34]), k = C(k, x, S, B, v, 23, D[35]), B = C(B, k, x, S, i, 4, D[36]), S = C(S, B, k, x, c, 11, D[37]), x = C(x, S, B, k, h, 16, D[38]), k = C(k, x, S, B, d, 23, D[39]), B = C(B, k, x, S, _, 4, D[40]), S = C(S, B, k, x, n, 11, D[41]), x = C(x, S, B, k, s, 16, D[42]), k = C(k, x, S, B, f, 23, D[43]), B = C(B, k, x, S, p, 4, D[44]), S = C(S, B, k, x, y, 11, D[45]), x = C(x, S, B, k, g, 16, D[46]), B = w(B, k = C(k, x, S, B, o, 23, D[47]), x, S, n, 6, D[48]), S = w(S, B, k, x, h, 10, D[49]), x = w(x, S, B, k, v, 15, D[50]), k = w(k, x, S, B, a, 21, D[51]), B = w(B, k, x, S, y, 6, D[52]), S = w(S, B, k, x, s, 10, D[53]), x = w(x, S, B, k, d, 15, D[54]), k = w(k, x, S, B, i, 21, D[55]), B = w(B, k, x, S, u, 6, D[56]), S = w(S, B, k, x, g, 10, D[57]), x = w(x, S, B, k, f, 15, D[58]), k = w(k, x, S, B, _, 21, D[59]), B = w(B, k, x, S, c, 6, D[60]), S = w(S, B, k, x, l, 10, D[61]), x = w(x, S, B, k, o, 15, D[62]), k = w(k, x, S, B, p, 21, D[63]); r[0] = r[0] + B | 0, r[1] = r[1] + k | 0, r[2] = r[2] + x | 0, r[3] = r[3] + S | 0; }, _doFinalize: function () { var t = this._data, e = t.words, r = 8 * this._nDataBytes, i = 8 * t.sigBytes; e[i >>> 5] |= 128 << 24 - i % 32; var n = o.floor(r / 4294967296); for (e[15 + (i + 64 >>> 9 << 4)] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8), e[14 + (i + 64 >>> 9 << 4)] = 16711935 & (r << 8 | r >>> 24) | 4278255360 & (r << 24 | r >>> 8), t.sigBytes = 4 * (e.length + 1), this._process(), e = (t = this._hash).words, r = 0; r < 4; r++)
                i = e[r], e[r] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8); return t; }, clone: function () { var t = r.clone.call(this); return t._hash = this._hash.clone(), t; } }), t.MD5 = r._createHelper(i), t.HmacMD5 = r._createHmacHelper(i); }(Math), function () { var t, e = CryptoJS, r = (t = e.lib).Base, f = t.WordArray, i = (t = e.algo).EvpKDF = r.extend({ cfg: r.extend({ keySize: 4, hasher: t.MD5, iterations: 1 }), init: function (t) { this.cfg = this.cfg.extend(t); }, compute: function (t, e) { for (var r = (s = this.cfg).hasher.create(), i = f.create(), n = i.words, o = s.keySize, s = s.iterations; n.length < o;) {
                c && r.update(c);
                var c = r.update(t).finalize(e);
                r.reset();
                for (var a = 1; a < s; a++)
                    c = r.finalize(c), r.reset();
                i.concat(c);
            } return i.sigBytes = 4 * o, i; } }); e.EvpKDF = function (t, e, r) { return i.create(r).compute(t, e); }; }(), CryptoJS.lib.Cipher || function () { var t = (p = CryptoJS).lib, e = t.Base, s = t.WordArray, r = t.BufferedBlockAlgorithm, i = p.enc.Base64, n = p.algo.EvpKDF, o = t.Cipher = r.extend({ cfg: e.extend(), createEncryptor: function (t, e) { return this.create(this._ENC_XFORM_MODE, t, e); }, createDecryptor: function (t, e) { return this.create(this._DEC_XFORM_MODE, t, e); }, init: function (t, e, r) { this.cfg = this.cfg.extend(r), this._xformMode = t, this._key = e, this.reset(); }, reset: function () { r.reset.call(this), this._doReset(); }, process: function (t) { return this._append(t), this._process(); }, finalize: function (t) { return t && this._append(t), this._doFinalize(); }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function (i) { return { encrypt: function (t, e, r) { return ("string" == typeof e ? d : u).encrypt(i, t, e, r); }, decrypt: function (t, e, r) { return ("string" == typeof e ? d : u).decrypt(i, t, e, r); } }; } }); t.StreamCipher = o.extend({ _doFinalize: function () { return this._process(!0); }, blockSize: 1 }); function c(t, e, r) { var i = this._iv; i ? this._iv = void 0 : i = this._prevBlock; for (var n = 0; n < r; n++)
            t[e + n] ^= i[n]; } var a = p.mode = {}, f = (t.BlockCipherMode = e.extend({ createEncryptor: function (t, e) { return this.Encryptor.create(t, e); }, createDecryptor: function (t, e) { return this.Decryptor.create(t, e); }, init: function (t, e) { this._cipher = t, this._iv = e; } })).extend(); f.Encryptor = f.extend({ processBlock: function (t, e) { var r = this._cipher, i = r.blockSize; c.call(this, t, e, i), r.encryptBlock(t, e), this._prevBlock = t.slice(e, e + i); } }), f.Decryptor = f.extend({ processBlock: function (t, e) { var r = this._cipher, i = r.blockSize, n = t.slice(e, e + i); r.decryptBlock(t, e), c.call(this, t, e, i), this._prevBlock = n; } }), a = a.CBC = f, f = (p.pad = {}).Pkcs7 = { pad: function (t, e) { for (var r, i = (r = (r = 4 * e) - t.sigBytes % r) << 24 | r << 16 | r << 8 | r, n = [], o = 0; o < r; o += 4)
                n.push(i); r = s.create(n, r), t.concat(r); }, unpad: function (t) { t.sigBytes -= 255 & t.words[t.sigBytes - 1 >>> 2]; } }, t.BlockCipher = o.extend({ cfg: o.cfg.extend({ mode: a, padding: f }), reset: function () { o.reset.call(this); var t = (e = this.cfg).iv, e = e.mode; if (this._xformMode == this._ENC_XFORM_MODE)
                var r = e.createEncryptor;
            else
                r = e.createDecryptor, this._minBufferSize = 1; this._mode = r.call(e, this, t && t.words); }, _doProcessBlock: function (t, e) { this._mode.processBlock(t, e); }, _doFinalize: function () { var t = this.cfg.padding; if (this._xformMode == this._ENC_XFORM_MODE) {
                t.pad(this._data, this.blockSize);
                var e = this._process(!0);
            }
            else
                e = this._process(!0), t.unpad(e); return e; }, blockSize: 4 }); var h = t.CipherParams = e.extend({ init: function (t) { this.mixIn(t); }, toString: function (t) { return (t || this.formatter).stringify(this); } }), u = (a = (p.format = {}).OpenSSL = { stringify: function (t) { var e = t.ciphertext; return ((t = t.salt) ? s.create([1398893684, 1701076831]).concat(t).concat(e) : e).toString(i); }, parse: function (t) { var e = (t = i.parse(t)).words; if (1398893684 == e[0] && 1701076831 == e[1]) {
                var r = s.create(e.slice(2, 4));
                e.splice(0, 4), t.sigBytes -= 16;
            } return h.create({ ciphertext: t, salt: r }); } }, t.SerializableCipher = e.extend({ cfg: e.extend({ format: a }), encrypt: function (t, e, r, i) { i = this.cfg.extend(i); var n = t.createEncryptor(r, i); return e = n.finalize(e), n = n.cfg, h.create({ ciphertext: e, key: r, iv: n.iv, algorithm: t, mode: n.mode, padding: n.padding, blockSize: t.blockSize, formatter: i.format }); }, decrypt: function (t, e, r, i) { return i = this.cfg.extend(i), e = this._parse(e, i.format), t.createDecryptor(r, i).finalize(e.ciphertext); }, _parse: function (t, e) { return "string" == typeof t ? e.parse(t, this) : t; } })), p = (p.kdf = {}).OpenSSL = { execute: function (t, e, r, i) { return i = i || s.random(8), t = n.create({ keySize: e + r }).compute(t, i), r = s.create(t.words.slice(e), 4 * r), t.sigBytes = 4 * e, h.create({ key: t, iv: r, salt: i }); } }, d = t.PasswordBasedCipher = u.extend({ cfg: u.cfg.extend({ kdf: p }), encrypt: function (t, e, r, i) { return r = (i = this.cfg.extend(i)).kdf.execute(r, t.keySize, t.ivSize), i.iv = r.iv, (t = u.encrypt.call(this, t, e, r.key, i)).mixIn(r), t; }, decrypt: function (t, e, r, i) { return i = this.cfg.extend(i), e = this._parse(e, i.format), r = i.kdf.execute(r, t.keySize, t.ivSize, e.salt), i.iv = r.iv, u.decrypt.call(this, t, e, r.key, i); } }); }(), function () { for (var t = CryptoJS, e = t.lib.BlockCipher, r = t.algo, s = [], i = [], n = [], o = [], c = [], a = [], f = [], h = [], u = [], p = [], d = [], l = 0; l < 256; l++)
            d[l] = l < 128 ? l << 1 : l << 1 ^ 283; var y = 0, _ = 0; for (l = 0; l < 256; l++) {
            var v = (v = _ ^ _ << 1 ^ _ << 2 ^ _ << 3 ^ _ << 4) >>> 8 ^ 255 & v ^ 99;
            s[y] = v;
            var g = d[i[v] = y], B = d[g], S = d[B], x = 257 * d[v] ^ 16843008 * v;
            n[y] = x << 24 | x >>> 8, o[y] = x << 16 | x >>> 16, c[y] = x << 8 | x >>> 24, a[y] = x, x = 16843009 * S ^ 65537 * B ^ 257 * g ^ 16843008 * y, f[v] = x << 24 | x >>> 8, h[v] = x << 16 | x >>> 16, u[v] = x << 8 | x >>> 24, p[v] = x, y ? (y = g ^ d[d[d[S ^ g]]], _ ^= d[d[_]]) : y = _ = 1;
        } var k = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]; r = r.AES = e.extend({ _doReset: function () { for (var t = (r = this._key).words, e = r.sigBytes / 4, r = 4 * ((this._nRounds = e + 6) + 1), i = this._keySchedule = [], n = 0; n < r; n++)
                if (n < e)
                    i[n] = t[n];
                else {
                    var o = i[n - 1];
                    n % e ? 6 < e && 4 == n % e && (o = s[o >>> 24] << 24 | s[o >>> 16 & 255] << 16 | s[o >>> 8 & 255] << 8 | s[255 & o]) : (o = s[(o = o << 8 | o >>> 24) >>> 24] << 24 | s[o >>> 16 & 255] << 16 | s[o >>> 8 & 255] << 8 | s[255 & o], o ^= k[n / e | 0] << 24), i[n] = i[n - e] ^ o;
                } for (t = this._invKeySchedule = [], e = 0; e < r; e++)
                n = r - e, o = e % 4 ? i[n] : i[n - 4], t[e] = e < 4 || n <= 4 ? o : f[s[o >>> 24]] ^ h[s[o >>> 16 & 255]] ^ u[s[o >>> 8 & 255]] ^ p[s[255 & o]]; }, encryptBlock: function (t, e) { this._doCryptBlock(t, e, this._keySchedule, n, o, c, a, s); }, decryptBlock: function (t, e) { var r = t[e + 1]; t[e + 1] = t[e + 3], t[e + 3] = r, this._doCryptBlock(t, e, this._invKeySchedule, f, h, u, p, i), r = t[e + 1], t[e + 1] = t[e + 3], t[e + 3] = r; }, _doCryptBlock: function (t, e, r, i, n, o, s, c) { for (var a = this._nRounds, f = t[e] ^ r[0], h = t[e + 1] ^ r[1], u = t[e + 2] ^ r[2], p = t[e + 3] ^ r[3], d = 4, l = 1; l < a; l++) {
                var y = i[f >>> 24] ^ n[h >>> 16 & 255] ^ o[u >>> 8 & 255] ^ s[255 & p] ^ r[d++], _ = i[h >>> 24] ^ n[u >>> 16 & 255] ^ o[p >>> 8 & 255] ^ s[255 & f] ^ r[d++], v = i[u >>> 24] ^ n[p >>> 16 & 255] ^ o[f >>> 8 & 255] ^ s[255 & h] ^ r[d++];
                p = i[p >>> 24] ^ n[f >>> 16 & 255] ^ o[h >>> 8 & 255] ^ s[255 & u] ^ r[d++], f = y, h = _, u = v;
            } y = (c[f >>> 24] << 24 | c[h >>> 16 & 255] << 16 | c[u >>> 8 & 255] << 8 | c[255 & p]) ^ r[d++], _ = (c[h >>> 24] << 24 | c[u >>> 16 & 255] << 16 | c[p >>> 8 & 255] << 8 | c[255 & f]) ^ r[d++], v = (c[u >>> 24] << 24 | c[p >>> 16 & 255] << 16 | c[f >>> 8 & 255] << 8 | c[255 & h]) ^ r[d++], p = (c[p >>> 24] << 24 | c[f >>> 16 & 255] << 16 | c[h >>> 8 & 255] << 8 | c[255 & u]) ^ r[d++], t[e] = y, t[e + 1] = _, t[e + 2] = v, t[e + 3] = p; }, keySize: 8 }); t.AES = e._createHelper(r); }();
        return CryptoJS;
    };
    ClasslinkSession.prototype.browserSSO = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var r, html, _a, gwstokenMd5, appResponse, userauth, ua, cjs;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("https://launchpad.classlink.com/browsersso/".concat(id), {
                            headers: {
                                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                                "accept-language": "en-US,en;q=0.9",
                                "cache-control": "max-age=0",
                                "if-none-match": "W/\"1c82-+Mz8GHNQXBUltWQxB9WG6se9JZA\"",
                                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "\"Windows\"",
                                "sec-fetch-dest": "document",
                                "sec-fetch-mode": "navigate",
                                "sec-fetch-site": "none",
                                "sec-fetch-user": "?1",
                                "upgrade-insecure-requests": "1",
                                "cookie": "_csrf=".concat(this.csrf, "; clsession=").concat(this.clsession, "; baseurl=%2Flwsd")
                            },
                            referrerPolicy: "strict-origin-when-cross-origin",
                            method: "GET"
                        })];
                    case 1:
                        r = _b.sent();
                        return [4 /*yield*/, r.text()];
                    case 2:
                        html = _b.sent();
                        return [4 /*yield*/, this.extractHTMLConfig(html)];
                    case 3:
                        _a = _b.sent(), gwstokenMd5 = _a.gwstokenMd5, appResponse = _a.appResponse;
                        userauth = appResponse.userauth[0];
                        ua = {};
                        cjs = this.getCrypto();
                        ["username", "password"].map(function (key) {
                            try {
                                ua[key] = cjs.AES.decrypt(userauth[key], gwstokenMd5).toString(cjs.enc.Utf8);
                            }
                            catch (e) {
                            }
                        });
                        return [2 /*return*/, ua];
                }
            });
        });
    };
    ClasslinkSession.prototype.loadApp = function (appId) {
        return __awaiter(this, void 0, void 0, function () {
            var app, url, bimPage, loc, redr, oauth, f, _a, username, password, formData, queryString, r, result, _b, dwd, web_data_recid, wfaacl_recid, wfaacl, nameid, usr, user_type, _, __, ___, ____, _____, ______, enc, encses, _______, ________, data;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        app = this.apps.find(function (x) { return x.id === appId; });
                        if (!(appId === "bim" || appId === 652890)) return [3 /*break*/, 4];
                        url = app.url[0];
                        console.log("Visiting:", url);
                        return [4 /*yield*/, fetch(url, {
                                headers: {
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
                    case 1:
                        bimPage = _c.sent();
                        loc = bimPage.headers.get("Location");
                        console.log(loc);
                        return [4 /*yield*/, fetch(loc, {
                                headers: {
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
                                    "cookie": "_csrf=".concat(this.csrf, "; baseurl=%2Flwsd; clsession=").concat(this.clsession),
                                },
                                referrerPolicy: "strict-origin-when-cross-origin",
                                method: "GET",
                                redirect: "manual",
                            })];
                    case 2:
                        redr = _c.sent();
                        oauth = redr.headers.get("Location");
                        console.log("Final:", oauth);
                        return [4 /*yield*/, fetch(oauth, {
                                headers: {
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
                                    "Referer": loc,
                                },
                                referrerPolicy: "strict-origin-when-cross-origin",
                                method: "GET",
                                redirect: "manual",
                            })];
                    case 3:
                        f = _c.sent();
                        return [2 /*return*/, BigIdeasMath.from(f)];
                    case 4:
                        if (!(appId === "skyward" || appId === 1820046)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.browserSSO(1820046)];
                    case 5:
                        _a = _c.sent(), username = _a.username, password = _a.password;
                        formData = new FormData();
                        formData.append('requestAction', 'eel');
                        formData.append('codeType', 'tryLogin');
                        formData.append('codeValue', username);
                        formData.append('login', username);
                        formData.append('password', password);
                        queryString = Array.from(formData.entries()).map(function (pair) { return pair[0] + '=' + encodeURIComponent(String(pair[1])); }).join('&');
                        return [4 /*yield*/, fetch("https://www2.saas.wa-k12.net/scripts/cgiip.exe/WService=wlkwashs71/skyporthttp.w", {
                                "headers": {
                                    "accept": "*/*",
                                    "accept-language": "en-US,en;q=0.9",
                                    "content-type": "application/x-www-form-urlencoded",
                                    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                    "Referer": "https://www2.saas.wa-k12.net/scripts/cgiip.exe/WService=wlkwashs71/fwemnu01.w",
                                    "Referrer-Policy": "strict-origin-when-cross-origin"
                                },
                                "body": queryString,
                                "method": "POST"
                            })];
                    case 6:
                        r = _c.sent();
                        return [4 /*yield*/, r.text()];
                    case 7:
                        result = _c.sent();
                        _b = result.split("<li>")[1].split("</li>")[0].split("^"), dwd = _b[0], web_data_recid = _b[1], wfaacl_recid = _b[2], wfaacl = _b[3], nameid = _b[4], usr = _b[5], user_type = _b[6], _ = _b[7], __ = _b[8], ___ = _b[9], ____ = _b[10], _____ = _b[11], ______ = _b[12], enc = _b[13], encses = _b[14], _______ = _b[15], ________ = _b[16];
                        data = { dwd: dwd, web_data_recid: web_data_recid, wfaacl_recid: wfaacl_recid, wfaacl: wfaacl, nameid: nameid, username: usr, user_type: user_type, enc: enc, encses: encses };
                        return [4 /*yield*/, Skyward.create(data)];
                    case 8: return [2 /*return*/, _c.sent()];
                    case 9: throw Error("".concat(appId, ": Unimplemented!"));
                }
            });
        });
    };
    return ClasslinkSession;
}());
void (function () { return __awaiter(void 0, void 0, void 0, function () {
    var session, skyward, x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Classlink.session("s-jgiri", "Dogs)dogs5")];
            case 1:
                session = _a.sent();
                return [4 /*yield*/, session.loadApp("skyward")];
            case 2:
                skyward = (_a.sent());
                return [4 /*yield*/, skyward.getStudentInfo()];
            case 3:
                x = _a.sent();
                console.log(JSON.stringify(x, null, 4));
                return [2 /*return*/];
        }
    });
}); })();
