"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class LookupTransactionByID extends jsonrequest_1.default {
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
exports.default = LookupTransactionByID;
//# sourceMappingURL=lookupTransactionByID.js.map