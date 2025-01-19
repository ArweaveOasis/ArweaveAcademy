"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class LookupAssetByID extends jsonrequest_1.default {
    /**
     * Returns asset information of the queried asset.
     *
     * #### Example
     * ```typescript
     * const assetId = 163650;
     * const assetInfo = await indexerClient.lookupAssetByID(assetId).do();
     * ```
     *
     * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2assetsasset-id)
     * @param index - The asset ID to look up.
     */
    constructor(c, intDecoding, index) {
        super(c, intDecoding);
        this.index = index;
        this.index = index;
    }
    /**
     * @returns `/v2/assets/${index}`
     */
    path() {
        return `/v2/assets/${this.index}`;
    }
    /**
     * Includes all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
     *
     * #### Example 1
     * ```typescript
     * const assetId = 163650;
     * const assetInfo = await indexerClient
     *        .lookupAssetByID(assetId)
     *        .includeAll(false)
     *        .do();
     * ```
     *
     * #### Example 2
     * ```typescript
     * const assetId = 163650;
     * const assetInfo = await indexerClient
     *        .lookupAssetByID(assetId)
     *        .includeAll()
     *        .do();
     * ```
     *
     * @param value - default true when called without passing a value
     * @category query
     */
    includeAll(value = true) {
        this.query['include-all'] = value;
        return this;
    }
}
exports.default = LookupAssetByID;
//# sourceMappingURL=lookupAssetByID.js.map