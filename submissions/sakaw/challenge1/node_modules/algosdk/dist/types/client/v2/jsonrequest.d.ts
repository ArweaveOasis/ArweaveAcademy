import HTTPClient from '../client';
import IntDecoding from '../../types/intDecoding';
/**
 * Base abstract class for JSON requests.
 *
 * Data: The type returned from the `do()` method
 *
 * Body: The structure of the response's body
 */
export default abstract class JSONRequest<Data = Record<string, any>, Body = Data | Uint8Array> {
    c: HTTPClient;
    query: Record<string, any>;
    intDecoding: IntDecoding;
    /**
     * @param client - HTTPClient object.
     * @param intDecoding - The method to use
     *   for decoding integers from this request's response. See the setIntDecoding method for more
     *   details.
     */
    constructor(client: HTTPClient, intDecoding?: IntDecoding);
    /**
     * @returns The path of this request.
     * @category JSONRequest
     */
    abstract path(): string;
    /**
     * Prepare a JSON response before returning it.
     *
     * Use this method to change and restructure response
     * data as needed after receiving it from the `do()` method.
     * @param body - Response body received
     * @category JSONRequest
     */
    prepare(body: Body): Data;
    /**
     * Execute the request.
     * @param headers - Additional headers to send in the request. Optional.
     * @returns A promise which resolves to the parsed response data.
     * @category JSONRequest
     */
    do(headers?: Record<string, any>): Promise<Data>;
    /**
     * Execute the request, but do not process the response data in any way.
     * @param headers - Additional headers to send in the request. Optional.
     * @returns A promise which resolves to the raw response data, exactly as returned by the server.
     * @category JSONRequest
     */
    doRaw(headers?: Record<string, any>): Promise<Uint8Array>;
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
    setIntDecoding(method: IntDecoding): this;
}
