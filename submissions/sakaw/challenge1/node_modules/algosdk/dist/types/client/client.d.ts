import * as utils from '../utils/utils';
import { BaseHTTPClient, Query } from './baseHTTPClient';
import { TokenHeader } from './urlTokenBaseHTTPClient';
export interface HTTPClientResponse {
    body: Uint8Array | any;
    text?: string;
    headers: Record<string, string>;
    status: number;
    ok: boolean;
}
/**
 * HTTPClient is a wrapper around a BaseHTTPClient
 * It takes care of setting the proper "Accept" header and of
 * decoding the JSON outputs.
 */
export default class HTTPClient {
    private bc;
    /**
     * Construct an HTTPClient from a BaseHTTPClient
     * @param bc - the BaseHTTPClient used
     */
    constructor(bc: BaseHTTPClient);
    /**
     * Construct an HTTPClient from a URL (baseServer+port) and a token
     */
    constructor(tokenHeader: TokenHeader, baseServer: string, port?: string | number, defaultHeaders?: Record<string, string>);
    /**
     * Parse JSON using either the built-in JSON.parse or utils.parseJSON
     * depending on whether jsonOptions are provided or not
     *
     * @param text - JSON data
     * @param status - Status of the response (used in case parseJSON fails)
     * @param jsonOptions - Options object to use to decode JSON responses. See
     *   utils.parseJSON for the options available.
     */
    static parseJSON(text: string, status: number, jsonOptions?: utils.JSONOptions): any;
    /**
     * Serialize the data according to the requestHeaders
     * Assumes that requestHeaders contain a key "content-type"
     * If the content-type is "application/json", data is JSON serialized
     * Otherwise, data needs to be either an UTF-8 string that is converted to an Uint8Array
     * or an Uint8Array
     * @private
     */
    private static serializeData;
    /**
     * Convert a BaseHTTPClientResponse into a full HTTPClientResponse
     * Parse the body in
     * Modifies in place res and return the result
     */
    private static prepareResponse;
    /**
     * Prepare an error with a response
     * (the type of errors BaseHTTPClient are supposed to throw)
     * by adding the status and preparing the internal response
     * @private
     */
    private static prepareResponseError;
    /**
     * Send a GET request.
     * @param relativePath - The path of the request.
     * @param query - An object containing the query parameters of the request.
     * @param requestHeaders - An object containing additional request headers to use.
     * @param jsonOptions - Options object to use to decode JSON responses. See
     *   utils.parseJSON for the options available.
     * @param parseBody - An optional boolean indicating whether the response body should be parsed
     *   or not.
     * @returns Response object.
     */
    get(relativePath: string, query?: Query<any>, requestHeaders?: Record<string, string>, jsonOptions?: utils.JSONOptions, parseBody?: boolean): Promise<HTTPClientResponse>;
    /**
     * Send a POST request.
     * If no content-type present, adds the header "content-type: application/json"
     * and data is serialized in JSON (if not empty)
     */
    post(relativePath: string, data: any, requestHeaders?: Record<string, string>, query?: Query<any>, parseBody?: boolean): Promise<HTTPClientResponse>;
    /**
     * Send a DELETE request.
     * If no content-type present, adds the header "content-type: application/json"
     * and data is serialized in JSON (if not empty)
     */
    delete(relativePath: string, data: any, requestHeaders?: Record<string, string>, parseBody?: boolean): Promise<HTTPClientResponse>;
}
