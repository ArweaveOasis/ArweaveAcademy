import JSONRequest from '../jsonrequest';
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
export default class GetApplicationBoxByName extends JSONRequest {
    constructor(c, intDecoding, index, name) {
        super(c, intDecoding);
        this.index = index;
        this.index = index;
        // Encode name in base64 format and append the encoding prefix.
        const encodedName = Buffer.from(name).toString('base64');
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
//# sourceMappingURL=getApplicationBoxByName.js.map