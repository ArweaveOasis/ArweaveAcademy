import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
/**
 * returns all transactions for a PK [addr] in the [first, last] rounds range.
 */
export default class PendingTransactionsByAddress extends JSONRequest {
    private address;
    constructor(c: HTTPClient, address: string);
    prepare(body: Uint8Array): Record<string, any>;
    path(): string;
    max(max: number): this;
}
