import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class LookupBlock extends JSONRequest {
    private round;
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
    constructor(c: HTTPClient, intDecoding: IntDecoding, round: number);
    /**
     * @returns `/v2/blocks/${round}`
     */
    path(): string;
    /**
     * Header only flag. When this is set to true, returned block does not contain the
     * transactions.
     */
    headerOnly(headerOnly: boolean): this;
}
