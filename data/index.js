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
var fs = require("fs/promises");
var schools = [
    'Keller Elementary',
    'Juanita Elementary',
    'Twain Elementary',
    'Rush Elementary',
    'McAuliffe Elementary',
    'Bell Elementary',
    'Alcott Elementary',
    'Kirk Elementary',
    'Einstein Elementary',
    'Rockwell Elementary',
    'Rose Hill Elementary',
    'Franklin Elementary',
    'Dickinson Elementary',
    'Thoreau Elementary',
    'Summer School',
    'Sandburg Elementary',
    'Redmond Elementary',
    'Baker Elementary',
    'Barton Elementary',
    'Smith Elementary',
    'Muir Elementary',
    'Carson Elementary',
    'Wilder Elementary',
    'Mead Elementary',
    'Special Services',
    'Lakeview Elementary',
    'Rosa Parks Elementary',
    'Audubon Elementary',
    'Mann Elementary',
    'Discovery Elementary',
    'Frost Elementary',
    'Blackwell Elementary',
    'Community School',
    'Explorer Elementary',
    'Emerson K-12',
    'Contractual School',
    'Environmental',
    'Timberline Middle School',
    'Redmond Middle School',
    'Rose Hill Middle School',
    'Finn Hill Middle School',
    'Kamiakin Middle School',
    'Evergreen Middle School',
    'Kirkland Middle School',
    'Inglewood Middle School',
    'International',
    'Stella Schola',
    'Northstar Middle School',
    'Renaissance',
    'Eastlake High School',
    'WaNIC Summer School',
    'Redmond High School',
    'Lake Washington High School',
    'STEM School',
    'Emerson High School',
    'WaNIC Skill Center',
    'WANIC Skill Center',
    'WANIC Summer School',
    'Futures School'
];
function titleCase(input) {
    try {
        return input
            .toLowerCase()
            .replace(/(?:^|\s)\w/g, function (match) { return match.toUpperCase(); });
    }
    catch (e) {
        console.log(typeof input);
        return "#ERR!";
    }
}
void (function () { return __awaiter(void 0, void 0, void 0, function () {
    var df, firstName, lastName, school;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, danfo.readCSV("./exportUsers_2023-12-16.csv")];
            case 1:
                df = _a.sent();
                df = df.query(df["userType"].eq("Member"));
                df = df.drop({ columns: ["mail", "userType", "accountEnabled", "streetAddress", "usageLocation", "state", "country", "city", "postalCode", "ageGroup", "invitationState", "identityIssuer", "mobilePhone", "consentProvidedForMinor", "legalAgeGroupClassification", "creationType", "directorySynced", "alternateEmailAddress", "companyName", "createdDateTime", "telephoneNumber", "officeLocation", "displayName"] });
                df = df.asType("jobTitle", "int32");
                df = df.dropNa({ axis: 1 });
                df = df.rename({ userPrincipalName: "email", givenName: "firstName", surname: "lastName", jobTitle: "grade", department: "school" });
                df = df.sortValues("grade");
                firstName = df["firstName"].values;
                lastName = df["lastName"].values;
                df = df.drop({ columns: ["firstName", "lastName"] });
                df = df.addColumn("fullName", firstName.map(function (x, i) { return titleCase(String(x)) + " " + titleCase(String(lastName[i])); }));
                school = df.column("school");
                df = df.drop({ columns: "school" });
                df = df.addColumn("school", school.map(Object.fromEntries(schools.map(function (school, index) { return ([school, index]); }))));
                df = df.asType("school", "int32");
                df = df.dropNa({ axis: 1 });
                return [4 /*yield*/, fs.writeFile("./users_2023_12_16.csv", danfo.toCSV(df))];
            case 2:
                _a.sent();
                return [4 /*yield*/, danfo.readCSV("./exportGroup_2023-12-18.csv")];
            case 3:
                df = _a.sent();
                df = df.query(df["groupType"].eq("Microsoft 365"));
                df = df.drop({ columns: ["groupType", "membershipType", "securityEnabled", "source", "mailEnabled", "isAssignableToRole", "onPremisesSyncEnabled"] });
                return [4 /*yield*/, fs.writeFile("./groups_2023_12_18.csv", danfo.toCSV(df))];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
