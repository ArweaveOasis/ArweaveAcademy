import HTTPClient from '../client';
import IntDecoding from '../../types/intDecoding';
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
export default class ServiceClient {
    constructor(tokenHeaderIdentifier, tokenHeaderOrStrOrBaseClient, baseServer, port, defaultHeaders = {}) {
        if (isBaseHTTPClient(tokenHeaderOrStrOrBaseClient)) {
            // we are using a base client
            this.c = new HTTPClient(tokenHeaderOrStrOrBaseClient);
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
            this.c = new HTTPClient(tokenHeader, baseServer, port, defaultHeaders);
        }
        this.intDecoding = IntDecoding.DEFAULT;
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
//# sourceMappingURL=serviceClient.js.map