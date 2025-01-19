"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.node.ts
var index_node_exports = {};
__export(index_node_exports, {
  default: () => aptosClient
});
module.exports = __toCommonJS(index_node_exports);
var import_got = __toESM(require("got"));

// src/cookieJar.ts
var CookieJar = class _CookieJar {
  constructor(jar = /* @__PURE__ */ new Map()) {
    this.jar = jar;
  }
  setCookie(url, cookieStr) {
    var _a;
    const key = url.origin.toLowerCase();
    if (!this.jar.has(key)) {
      this.jar.set(key, []);
    }
    const cookie = _CookieJar.parse(cookieStr);
    this.jar.set(key, [...((_a = this.jar.get(key)) == null ? void 0 : _a.filter((c) => c.name !== cookie.name)) || [], cookie]);
  }
  getCookies(url) {
    var _a;
    const key = url.origin.toLowerCase();
    if (!this.jar.get(key)) {
      return [];
    }
    return ((_a = this.jar.get(key)) == null ? void 0 : _a.filter((cookie) => !cookie.expires || cookie.expires > /* @__PURE__ */ new Date())) || [];
  }
  static parse(str) {
    if (typeof str !== "string") {
      throw new Error("argument str must be a string");
    }
    const parts = str.split(";").map((part) => part.trim());
    let cookie;
    if (parts.length > 0) {
      const [name, value] = parts[0].split("=");
      if (!name || !value) {
        throw new Error("Invalid cookie");
      }
      cookie = {
        name,
        value
      };
    } else {
      throw new Error("Invalid cookie");
    }
    parts.slice(1).forEach((part) => {
      const [name, value] = part.split("=");
      if (!name.trim()) {
        throw new Error("Invalid cookie");
      }
      const nameLow = name.toLowerCase();
      const val = (value == null ? void 0 : value.charAt(0)) === "'" || (value == null ? void 0 : value.charAt(0)) === '"' ? value == null ? void 0 : value.slice(1, -1) : value;
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
  }
};

// src/index.node.ts
var cookieJar = new CookieJar();
async function aptosClient(requestOptions) {
  const { params, method, url, headers, body } = requestOptions;
  const request = {
    http2: true,
    searchParams: convertBigIntToString(params),
    method,
    url,
    responseType: "json",
    headers,
    hooks: {
      beforeRequest: [
        (options) => {
          const cookies = cookieJar.getCookies(new URL(options.url));
          if ((cookies == null ? void 0 : cookies.length) > 0 && options.headers) {
            options.headers.cookie = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
          }
        }
      ],
      afterResponse: [
        (response) => {
          if (Array.isArray(response.headers["set-cookie"])) {
            response.headers["set-cookie"].forEach((c) => {
              cookieJar.setCookie(new URL(response.url), c);
            });
          }
          return response;
        }
      ]
    }
  };
  if (body) {
    if (body instanceof Uint8Array) {
      request.body = Buffer.from(body);
    } else {
      request.body = Buffer.from(JSON.stringify(body));
    }
  }
  try {
    const response = await (0, import_got.default)(request);
    return parseResponse(response);
  } catch (error) {
    const gotError = error;
    if (gotError.response) {
      return parseResponse(gotError.response);
    }
    throw error;
  }
}
function parseResponse(response) {
  return {
    status: response.statusCode,
    statusText: response.statusMessage || "",
    data: response.body,
    config: response.request.options,
    request: response.request,
    response,
    headers: response.headers
  };
}
function convertBigIntToString(obj) {
  const result = {};
  if (!obj)
    return result;
  Object.entries(obj).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof value === "bigint") {
        result[key] = String(value);
      } else {
        result[key] = value;
      }
    }
  });
  return result;
}
//# sourceMappingURL=index.node.js.map