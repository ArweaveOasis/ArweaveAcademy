import JSONRequest from '../jsonrequest';
import { Box } from './models/types';
export default class LookupApplicationBoxByIDandName extends JSONRequest {
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
    constructor(c, intDecoding, index, boxName) {
        super(c, intDecoding);
        this.index = index;
        this.index = index;
        // Encode query in base64 format and append the encoding prefix.
        const encodedName = Buffer.from(boxName).toString('base64');
        this.query.name = encodeURI(`b64:${encodedName}`);
    }
    /**
     * @returns `/v2/applications/${index}/box`
     */
    path() {
        return `/v2/applications/${this.index}/box`;
    }
    // eslint-disable-next-line class-methods-use-this
    prepare(body) {
        return Box.from_obj_for_encoding(body);
    }
}
//# sourceMappingURL=lookupApplicationBoxByIDandName.js.map