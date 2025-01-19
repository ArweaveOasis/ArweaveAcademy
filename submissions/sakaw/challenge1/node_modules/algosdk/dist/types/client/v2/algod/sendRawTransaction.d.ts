import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
/**
 * Sets the default header (if not previously set) for sending a raw
 * transaction.
 * @param headers - A headers object
 */
export declare function setSendTransactionHeaders(headers?: {}): {};
/**
 * broadcasts the passed signed txns to the network
 */
export default class SendRawTransaction extends JSONRequest {
    private txnBytesToPost;
    constructor(c: HTTPClient, stxOrStxs: Uint8Array | Uint8Array[]);
    path(): string;
    do(headers?: {}): Promise<any>;
}
