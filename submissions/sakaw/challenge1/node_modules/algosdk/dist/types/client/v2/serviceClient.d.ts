import HTTPClient from '../client';
import IntDecoding from '../../types/intDecoding';
import { BaseHTTPClient } from '../baseHTTPClient';
import { TokenHeader } from '../urlTokenBaseHTTPClient';
export declare type TokenHeaderIdentifier = 'X-Indexer-API-Token' | 'X-KMD-API-Token' | 'X-Algo-API-Token' | string;
/**
 * Abstract service client to encapsulate shared AlgodClient and IndexerClient logic
 */
export default abstract class ServiceClient {
    /** @ignore */
    c: HTTPClient;
    /** @ignore */
    intDecoding: IntDecoding;
    constructor(tokenHeaderIdentifier: TokenHeaderIdentifier, tokenHeaderOrStrOrBaseClient: string | TokenHeader | BaseHTTPClient, baseServer: string, port?: string | number, defaultHeaders?: Record<string, any>);
    /**
     * Set the default int decoding method for all JSON requests this client creates.
     * @param method - \{"default" | "safe" | "mixed" | "bigint"\} method The method to use when parsing the
     *   response for request. Must be one of "default", "safe", "mixed", or "bigint". See
     *   JSONRequest.setIntDecoding for more details about what each method does.
     */
    setIntEncoding(method: IntDecoding): void;
    /**
     * Get the default int decoding method for all JSON requests this client creates.
     */
    getIntEncoding(): IntDecoding;
}
