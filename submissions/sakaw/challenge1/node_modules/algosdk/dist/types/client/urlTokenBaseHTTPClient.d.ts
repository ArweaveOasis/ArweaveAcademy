import { BaseHTTPClient, BaseHTTPClientResponse, Query } from './baseHTTPClient';
export interface AlgodTokenHeader {
    'X-Algo-API-Token': string;
}
export interface IndexerTokenHeader {
    'X-Indexer-API-Token': string;
}
export interface KMDTokenHeader {
    'X-KMD-API-Token': string;
}
export interface CustomTokenHeader {
    [headerName: string]: string;
}
export declare type TokenHeader = AlgodTokenHeader | IndexerTokenHeader | KMDTokenHeader | CustomTokenHeader;
/**
 * Implementation of BaseHTTPClient that uses a URL and a token
 * and make the REST queries using fetch.
 * This is the default implementation of BaseHTTPClient.
 */
export declare class URLTokenBaseHTTPClient implements BaseHTTPClient {
    private defaultHeaders;
    private readonly baseURL;
    private readonly tokenHeader;
    constructor(tokenHeader: TokenHeader, baseServer: string, port?: string | number, defaultHeaders?: Record<string, any>);
    /**
     * Compute the URL for a path relative to the instance's address
     * @param relativePath - A path string
     * @param query - An optional key-value object of query parameters to add to the URL. If the
     *   relativePath already has query parameters on it, the additional parameters defined here will
     *   be added to the URL without modifying those (unless a key collision occurs).
     * @returns A URL string
     */
    private getURL;
    private static formatFetchResponseHeaders;
    private static checkHttpError;
    private static formatFetchResponse;
    get(relativePath: string, query?: Query<string>, requestHeaders?: Record<string, string>): Promise<BaseHTTPClientResponse>;
    post(relativePath: string, data: Uint8Array, query?: Query<string>, requestHeaders?: Record<string, string>): Promise<BaseHTTPClientResponse>;
    delete(relativePath: string, data: Uint8Array, query?: Query<string>, requestHeaders?: Record<string, string>): Promise<BaseHTTPClientResponse>;
}
