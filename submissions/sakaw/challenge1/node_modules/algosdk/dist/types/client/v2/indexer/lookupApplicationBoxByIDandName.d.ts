import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
import { Box } from './models/types';
export default class LookupApplicationBoxByIDandName extends JSONRequest<Box, Record<string, any>> {
    private index;
    /**
     * Returns information about indexed application boxes.
     *
     * #### Example
     * ```typescript
     * const boxName = Buffer.from("foo");
     * const boxResponse = await indexerClient
     *        .LookupApplicationBoxByIDandName(1234, boxName)
     *        .do();
     * const boxValue = boxResponse.value;
     * ```
     *
     * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2applicationsapplication-idbox)
     * @oaram index - application index.
     * @category GET
     */
    constructor(c: HTTPClient, intDecoding: IntDecoding, index: number, boxName: Uint8Array);
    /**
     * @returns `/v2/applications/${index}/box`
     */
    path(): string;
    prepare(body: Record<string, any>): Box;
}
