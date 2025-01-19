"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLTokenBaseHTTPClient = void 0;
const cross_fetch_1 = require("cross-fetch");
class URLTokenBaseHTTPError extends Error {
    constructor(message, response) {
        super(message);
        this.response = response;
        this.name = 'URLTokenBaseHTTPError';
        this.response = response;
    }
}
/**
 * Implementation of BaseHTTPClient that uses a URL and a token
 * and make the REST queries using fetch.
 * This is the default implementation of BaseHTTPClient.
 */
class URLTokenBaseHTTPClient {
    constructor(tokenHeader, baseServer, port, defaultHeaders = {}) {
        this.defaultHeaders = defaultHeaders;
        // Append a trailing slash so we can use relative paths. Without the trailing
        // slash, the last path segment will be replaced by the relative path. See
        // usage in `addressWithPath`.
        const fixedBaseServer = baseServer.endsWith('/')
            ? baseServer
            : `${baseServer}/`;
        const baseServerURL = new URL(fixedBaseServer);
        if (typeof port !== 'undefined') {
            baseServerURL.port = port.toString();
        }
        if (baseServerURL.protocol.length === 0) {
            throw new Error('Invalid base server URL, protocol must be defined.');
        }
        this.baseURL = baseServerURL;
        this.tokenHeader = tokenHeader;
    }
    /**
     * Compute the URL for a path relative to the instance's address
     * @param relativePath - A path string
     * @param query - An optional key-value object of query parameters to add to the URL. If the
     *   relativePath already has query parameters on it, the additional parameters defined here will
     *   be added to the URL without modifying those (unless a key collision occurs).
     * @returns A URL string
     */
    getURL(relativePath, query) {
        let fixedRelativePath;
        if (relativePath.startsWith('./')) {
            fixedRelativePath = relativePath;
        }
        else if (relativePath.startsWith('/')) {
            fixedRelativePath = `.${relativePath}`;
        }
        else {
            fixedRelativePath = `./${relativePath}`;
        }
        const address = new URL(fixedRelativePath, this.baseURL);
        if (query) {
            for (const [key, value] of Object.entries(query)) {
                address.searchParams.set(key, value);
            }
        }
        return address.toString();
    }
    static formatFetchResponseHeaders(headers) {
        const headersObj = {};
        headers.forEach((key, value) => {
            headersObj[key] = value;
        });
        return headersObj;
    }
    static async checkHttpError(res) {
        if (res.ok) {
            return;
        }
        let body = null;
        let bodyErrorMessage = null;
        try {
            body = new Uint8Array(await res.arrayBuffer());
            const decoded = JSON.parse(Buffer.from(body).toString());
            if (decoded.message) {
                bodyErrorMessage = decoded.message;
            }
        }
        catch (_) {
            // ignore any error that happened while we are parsing the error response
        }
        let message = `Network request error. Received status ${res.status} (${res.statusText})`;
        if (bodyErrorMessage) {
            message += `: ${bodyErrorMessage}`;
        }
        throw new URLTokenBaseHTTPError(message, {
            body,
            status: res.status,
            headers: URLTokenBaseHTTPClient.formatFetchResponseHeaders(res.headers),
        });
    }
    static async formatFetchResponse(res) {
        await this.checkHttpError(res);
        return {
            body: new Uint8Array(await res.arrayBuffer()),
            status: res.status,
            headers: URLTokenBaseHTTPClient.formatFetchResponseHeaders(res.headers),
        };
    }
    async get(relativePath, query, requestHeaders = {}) {
        // Expand headers for use in fetch
        const headers = {
            ...this.tokenHeader,
            ...this.defaultHeaders,
            ...requestHeaders,
        };
        const res = await (0, cross_fetch_1.fetch)(this.getURL(relativePath, query), {
            mode: 'cors',
            headers,
        });
        return URLTokenBaseHTTPClient.formatFetchResponse(res);
    }
    async post(relativePath, data, query, requestHeaders = {}) {
        // Expand headers for use in fetch
        const headers = {
            ...this.tokenHeader,
            ...this.defaultHeaders,
            ...requestHeaders,
        };
        const res = await (0, cross_fetch_1.fetch)(this.getURL(relativePath, query), {
            method: 'POST',
            mode: 'cors',
            body: data,
            headers,
        });
        return URLTokenBaseHTTPClient.formatFetchResponse(res);
    }
    async delete(relativePath, data, query, requestHeaders = {}) {
        // Expand headers for use in fetch
        const headers = {
            ...this.tokenHeader,
            ...this.defaultHeaders,
            ...requestHeaders,
        };
        const res = await (0, cross_fetch_1.fetch)(this.getURL(relativePath, query), {
            method: 'DELETE',
            mode: 'cors',
            body: data,
            headers,
        });
        return URLTokenBaseHTTPClient.formatFetchResponse(res);
    }
}
exports.URLTokenBaseHTTPClient = URLTokenBaseHTTPClient;
//# sourceMappingURL=urlTokenBaseHTTPClient.js.map