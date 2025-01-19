import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
/**
 * returns the transaction information for a specific txid of a pending transaction
 */
export default class PendingTransactionInformation extends JSONRequest {
    private txid;
    constructor(c: HTTPClient, txid: string);
    prepare(body: Uint8Array): Record<string, any>;
    path(): string;
    max(max: number): this;
}
