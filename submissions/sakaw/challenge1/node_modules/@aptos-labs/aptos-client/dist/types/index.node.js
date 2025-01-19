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
var got_1 = require("got");
var cookieJar_1 = require("./cookieJar");
var cookieJar = new cookieJar_1.CookieJar();
function aptosClient(requestOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var params, method, url, headers, body, request, response, error_1, gotError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = requestOptions.params, method = requestOptions.method, url = requestOptions.url, headers = requestOptions.headers, body = requestOptions.body;
                    request = {
                        http2: true,
                        searchParams: convertBigIntToString(params),
                        method: method,
                        url: url,
                        responseType: "json",
                        headers: headers,
                        hooks: {
                            beforeRequest: [
                                function (options) {
                                    var cookies = cookieJar.getCookies(new URL(options.url));
                                    if ((cookies === null || cookies === void 0 ? void 0 : cookies.length) > 0 && options.headers) {
                                        /* eslint-disable no-param-reassign */
                                        options.headers.cookie = cookies.map(function (cookie) { return "".concat(cookie.name, "=").concat(cookie.value); }).join("; ");
                                    }
                                },
                            ],
                            afterResponse: [
                                function (response) {
                                    if (Array.isArray(response.headers["set-cookie"])) {
                                        response.headers["set-cookie"].forEach(function (c) {
                                            cookieJar.setCookie(new URL(response.url), c);
                                        });
                                    }
                                    return response;
                                },
                            ],
                        },
                    };
                    if (body) {
                        if (body instanceof Uint8Array) {
                            request.body = Buffer.from(body);
                        }
                        else {
                            request.body = Buffer.from(JSON.stringify(body));
                        }
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, got_1.default)(request)];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, parseResponse(response)];
                case 3:
                    error_1 = _a.sent();
                    gotError = error_1;
                    if (gotError.response) {
                        return [2 /*return*/, parseResponse(gotError.response)];
                    }
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = aptosClient;
function parseResponse(response) {
    return {
        status: response.statusCode,
        statusText: response.statusMessage || "",
        data: response.body,
        config: response.request.options,
        request: response.request,
        response: response,
        headers: response.headers,
    };
}
/**
 * got supports only - string | number | boolean | null | undefined as searchParam value,
 * so if we have bigint type, convert it to string
 */
function convertBigIntToString(obj) {
    var result = {};
    if (!obj)
        return result;
    Object.entries(obj).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof value === "bigint") {
                result[key] = String(value);
            }
            else {
                result[key] = value;
            }
        }
    });
    return result;
}
