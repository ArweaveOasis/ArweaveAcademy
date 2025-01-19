// src/index.node.ts
import got from "got";

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
    const response = await got(request);
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
export {
  aptosClient as default
};
//# sourceMappingURL=index.node.mjs.map