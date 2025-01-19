import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
/**
 * pendingTransactionsInformation returns transactions that are pending in the pool
 */
export default class PendingTransactions extends JSONRequest {
    constructor(c: HTTPClient);
    path(): string;
    prepare(body: Uint8Array): Record<string, any>;
    max(max: number): this;
}
