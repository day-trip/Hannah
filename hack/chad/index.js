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
var p = require("puppeteer");
var canvas_1 = require("canvas");
var fs = require("fs");
void (function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, _a, cc, tt, x, canvas, ctx, image, i, out;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, p.launch({ headless: false })];
            case 1:
                browser = _b.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _b.sent();
                return [4 /*yield*/, page.setViewport({ width: 1280, height: 800 })];
            case 3:
                _b.sent();
                return [4 /*yield*/, page.goto("https://launchpad.classlink.com/lwsd")];
            case 4:
                _b.sent();
                return [4 /*yield*/, page.waitForSelector("body")];
            case 5:
                _b.sent();
                return [4 /*yield*/, page.waitForTimeout(1000)];
            case 6:
                _b.sent();
                return [4 /*yield*/, page.evaluate(function () {
                        var clickable = Array.from(document.querySelectorAll("[onclick], a[href]"));
                        var typeable = Array.from(document.querySelectorAll("input, textarea"));
                        return [clickable.map(function (c) {
                                var _a = c.getBoundingClientRect(), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                                if (x < 0 || x > 1280 || y < 0 || y > 800) {
                                    return undefined;
                                }
                                var yy = y;
                                if (height > 30) {
                                    yy += height / 2;
                                    yy -= 15;
                                }
                                return [x + width + 5, yy];
                            }).filter(function (x) { return !!x; }), typeable.map(function (t) {
                                var _a = t.getBoundingClientRect(), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                                if (x < 0 || x > 1280 || y < 0 || y > 800) {
                                    return undefined;
                                }
                                var yy = y;
                                if (height > 30) {
                                    yy += height / 2;
                                    yy -= 15;
                                }
                                return [x + width + 5, yy];
                            }).filter(function (x) { return !!x; })];
                    })];
            case 7:
                _a = _b.sent(), cc = _a[0], tt = _a[1];
                return [4 /*yield*/, page.screenshot({ type: "png", encoding: "binary" })];
            case 8:
                x = _b.sent();
                return [4 /*yield*/, page.close()];
            case 9:
                _b.sent();
                return [4 /*yield*/, browser.close()];
            case 10:
                _b.sent();
                canvas = (0, canvas_1.createCanvas)(1280, 800);
                ctx = canvas.getContext("2d");
                return [4 /*yield*/, (0, canvas_1.loadImage)(x)];
            case 11:
                image = _b.sent();
                ctx.drawImage(image, 0, 0, 1280, 800);
                ctx.fillStyle = "black";
                i = 0;
                cc.forEach(function (_a) {
                    var x = _a[0], y = _a[1];
                    ctx.fillRect(x, y, 30, 30);
                    ctx.fillStyle = "white";
                    ctx.fillText(String(i), x + 10, y + 10);
                    ctx.fillStyle = "black";
                    i++;
                });
                tt.forEach(function (_a) {
                    var x = _a[0], y = _a[1];
                    ctx.fillRect(x, y, 30, 30);
                    ctx.fillStyle = "white";
                    ctx.fillText(String(i), x + 10, y + 10);
                    ctx.fillStyle = "black";
                    i++;
                });
                out = fs.createWriteStream("output.png");
                canvas.createPNGStream().pipe(out);
                return [4 /*yield*/, new Promise(function (resolve) {
                        out.on('finish', resolve);
                    })];
            case 12:
                _b.sent();
                console.log("Done!");
                return [2 /*return*/];
        }
    });
}); })();
