import JSONRequest from '../jsonrequest';
export default class LookupTransactionByID extends JSONRequest {
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
    constructor(c, intDecoding, txID) {
        super(c, intDecoding);
        this.txID = txID;
        this.txID = txID;
    }
    /**
     * @returns `/v2/transactions/${txID}`
     */
    path() {
        return `/v2/transactions/${this.txID}`;
    }
}
//# sourceMappingURL=lookupTransactionByID.js.map