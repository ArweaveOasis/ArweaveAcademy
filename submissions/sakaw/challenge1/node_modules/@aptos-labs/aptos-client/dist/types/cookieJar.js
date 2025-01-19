"use strict";
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
exports.CookieJar = void 0;
var CookieJar = /** @class */ (function () {
    function CookieJar(jar) {
        if (jar === void 0) { jar = new Map(); }
        this.jar = jar;
    }
    CookieJar.prototype.setCookie = function (url, cookieStr) {
        var _a;
        var key = url.origin.toLowerCase();
        if (!this.jar.has(key)) {
            this.jar.set(key, []);
        }
        var cookie = CookieJar.parse(cookieStr);
        this.jar.set(key, __spreadArray(__spreadArray([], (((_a = this.jar.get(key)) === null || _a === void 0 ? void 0 : _a.filter(function (c) { return c.name !== cookie.name; })) || []), true), [cookie], false));
    };
    CookieJar.prototype.getCookies = function (url) {
        var _a;
        var key = url.origin.toLowerCase();
        if (!this.jar.get(key)) {
            return [];
        }
        // Filter out expired cookies
        return ((_a = this.jar.get(key)) === null || _a === void 0 ? void 0 : _a.filter(function (cookie) { return !cookie.expires || cookie.expires > new Date(); })) || [];
    };
    CookieJar.parse = function (str) {
        if (typeof str !== "string") {
            throw new Error("argument str must be a string");
        }
        var parts = str.split(";").map(function (part) { return part.trim(); });
        var cookie;
        if (parts.length > 0) {
            var _a = parts[0].split("="), name_1 = _a[0], value = _a[1];
            if (!name_1 || !value) {
                throw new Error("Invalid cookie");
            }
            cookie = {
                name: name_1,
                value: value,
            };
        }
        else {
            throw new Error("Invalid cookie");
        }
        parts.slice(1).forEach(function (part) {
            var _a = part.split("="), name = _a[0], value = _a[1];
            if (!name.trim()) {
                throw new Error("Invalid cookie");
            }
            var nameLow = name.toLowerCase();
            // eslint-disable-next-line quotes
            var val = (value === null || value === void 0 ? void 0 : value.charAt(0)) === "'" || (value === null || value === void 0 ? void 0 : value.charAt(0)) === '"' ? value === null || value === void 0 ? void 0 : value.slice(1, -1) : value;
            if (nameLow === "expires") {
                cookie.expires = new Date(val);
            }
            if (nameLow === "path") {
                cookie.path = val;
            }
            if (nameLow === "samesite") {
                if (val !== "Lax" && val !== "None" && val !== "Strict") {
                    throw new Error("Invalid cookie SameSite value");
                }
                cookie.sameSite = val;
            }
            if (nameLow === "secure") {
                cookie.secure = true;
            }
        });
        return cookie;
    };
    return CookieJar;
}());
exports.CookieJar = CookieJar;
