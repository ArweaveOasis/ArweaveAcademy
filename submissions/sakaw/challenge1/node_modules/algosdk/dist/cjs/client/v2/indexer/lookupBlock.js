"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class LookupBlock extends jsonrequest_1.default {
    /**
     * Returns the block for the passed round.
     *
     * #### Example
     * ```typescript
     * const targetBlock = 18309917;
     * const blockInfo = await indexerClient.lookupBlock(targetBlock).do();
     * ```
     *
     * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2blocksround-number)
     * @param round - The number of the round to look up.
     * @category GET
     */
    constructor(c, intDecoding, round) {
        super(c, intDecoding);
        this.round = round;
        this.round = round;
    }
    /**
     * @returns `/v2/blocks/${round}`
     */
    path() {
        return `/v2/blocks/${this.round}`;
    }
    /**
     * Header only flag. When this is set to true, returned block does not contain the
     * transactions.
     */
    headerOnly(headerOnly) {
        this.query['header-only'] = headerOnly;
        return this;
    }
}
exports.default = LookupBlock;
//# sourceMappingURL=lookupBlock.js.map