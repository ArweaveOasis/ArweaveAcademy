"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../client"));
const intDecoding_1 = __importDefault(require("../../types/intDecoding"));
/**
 * Convert a token string to a token header
 * @param token - The token string
 * @param headerIdentifier - An identifier for the token header
 */
function convertTokenStringToTokenHeader(token = '', headerIdentifier) {
    const tokenHeader = {};
    tokenHeader[headerIdentifier] = token;
    return tokenHeader;
}
function isBaseHTTPClient(tbc) {
    return typeof tbc.get === 'function';
}
/**
 * Abstract service client to encapsulate shared AlgodClient and IndexerClient logic
 */
class ServiceClient {
    constructor(tokenHeaderIdentifier, tokenHeaderOrStrOrBaseClient, baseServer, port, defaultHeaders = {}) {
        if (isBaseHTTPClient(tokenHeaderOrStrOrBaseClient)) {
            // we are using a base client
            this.c = new client_1.default(tokenHeaderOrStrOrBaseClient);
        }
        else {
            // Accept token header as string or object
            // - workaround to allow backwards compatibility for multiple headers
            let tokenHeader;
            if (typeof tokenHeaderOrStrOrBaseClient === 'string') {
                tokenHeader = convertTokenStringToTokenHeader(tokenHeaderOrStrOrBaseClient, tokenHeaderIdentifier);
            }
            else {
                tokenHeader = tokenHeaderOrStrOrBaseClient;
            }
            this.c = new client_1.default(tokenHeader, baseServer, port, defaultHeaders);
        }
        this.intDecoding = intDecoding_1.default.DEFAULT;
    }
    /**
     * Set the default int decoding method for all JSON requests this client creates.
     * @param method - \{"default" | "safe" | "mixed" | "bigint"\} method The method to use when parsing the
     *   response for request. Must be one of "default", "safe", "mixed", or "bigint". See
     *   JSONRequest.setIntDecoding for more details about what each method does.
     */
    setIntEncoding(method) {
        this.intDecoding = method;
    }
    /**
     * Get the default int decoding method for all JSON requests this client creates.
     */
    getIntEncoding() {
        return this.intDecoding;
    }
}
exports.default = ServiceClient;
//# sourceMappingURL=serviceClient.js.map