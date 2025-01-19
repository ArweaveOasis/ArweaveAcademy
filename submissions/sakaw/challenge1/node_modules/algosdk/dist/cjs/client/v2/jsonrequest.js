"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const intDecoding_1 = __importDefault(require("../../types/intDecoding"));
/**
 * Base abstract class for JSON requests.
 *
 * Data: The type returned from the `do()` method
 *
 * Body: The structure of the response's body
 */
class JSONRequest {
    /**
     * @param client - HTTPClient object.
     * @param intDecoding - The method to use
     *   for decoding integers from this request's response. See the setIntDecoding method for more
     *   details.
     */
    constructor(client, intDecoding) {
        this.c = client;
        this.query = {};
        this.intDecoding = intDecoding || intDecoding_1.default.DEFAULT;
    }
    /**
     * Prepare a JSON response before returning it.
     *
     * Use this method to change and restructure response
     * data as needed after receiving it from the `do()` method.
     * @param body - Response body received
     * @category JSONRequest
     */
    // eslint-disable-next-line class-methods-use-this
    prepare(body) {
        return body;
    }
    /**
     * Execute the request.
     * @param headers - Additional headers to send in the request. Optional.
     * @returns A promise which resolves to the parsed response data.
     * @category JSONRequest
     */
    async do(headers = {}) {
        const jsonOptions = {};
        if (this.intDecoding !== 'default') {
            jsonOptions.intDecoding = this.intDecoding;
        }
        const res = await this.c.get(this.path(), this.query, headers, jsonOptions);
        return this.prepare(res.body);
    }
    /**
     * Execute the request, but do not process the response data in any way.
     * @param headers - Additional headers to send in the request. Optional.
     * @returns A promise which resolves to the raw response data, exactly as returned by the server.
     * @category JSONRequest
     */
    async doRaw(headers = {}) {
        const res = await this.c.get(this.path(), this.query, headers, {}, false);
        return res.body;
    }
    /**
     * Configure how integers in this request's JSON response will be decoded.
     *
     * The options are:
     * * "default": Integers will be decoded according to JSON.parse, meaning they will all be
     *   Numbers and any values greater than Number.MAX_SAFE_INTEGER will lose precision.
     * * "safe": All integers will be decoded as Numbers, but if any values are greater than
     *   Number.MAX_SAFE_INTEGER an error will be thrown.
     * * "mixed": Integers will be decoded as Numbers if they are less than or equal to
     *   Number.MAX_SAFE_INTEGER, otherwise they will be decoded as BigInts.
     * * "bigint": All integers will be decoded as BigInts.
     *
     * @param method - The method to use when parsing the
     *   response for this request. Must be one of "default", "safe", "mixed", or "bigint".
     * @category JSONRequest
     */
    setIntDecoding(method) {
        if (method !== 'default' &&
            method !== 'safe' &&
            method !== 'mixed' &&
            method !== 'bigint')
            throw new Error(`Invalid method for int decoding: ${method}`);
        this.intDecoding = method;
        return this;
    }
}
exports.default = JSONRequest;
//# sourceMappingURL=jsonrequest.js.map