import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
import { Box } from './models/types';
/**
 * Given an application ID and the box name (key), return the value stored in the box.
 *
 * #### Example
 * ```typescript
 * const index = 60553466;
 * const boxName = Buffer.from("foo");
 * const boxResponse = await algodClient.getApplicationBoxByName(index, boxName).do();
 * const boxValue = boxResponse.value;
 * ```
 *
 * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2applicationsapplication-idbox)
 * @param index - The application ID to look up.
 * @category GET
 */
export default class GetApplicationBoxByName extends JSONRequest<Box, Record<string, any>> {
    private index;
    constructor(c: HTTPClient, intDecoding: IntDecoding, index: number, name: Uint8Array);
    /**
     * @returns `/v2/applications/${index}/box`
     */
    path(): string;
    prepare(body: Record<string, any>): Box;
}
