import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class LookupTransactionByID extends JSONRequest {
    private txID;
    /**
     * Returns information about the given transaction.
     *
     * #### Example
     * ```typescript
     * const txnId = "MEUOC4RQJB23CQZRFRKYEI6WBO73VTTPST5A7B3S5OKBUY6LFUDA";
     * const txnInfo = await indexerClient.lookupTransactionByID(txnId).do();
     * ```
     *
     * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2transactionstxid)
     * @param txID - The ID of the transaction to look up.
     * @category GET
     */
    constructor(c: HTTPClient, intDecoding: IntDecoding, txID: string);
    /**
     * @returns `/v2/transactions/${txID}`
     */
    path(): string;
}
