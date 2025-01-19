"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
const types_1 = require("./models/types");
class LookupApplicationBoxByIDandName extends jsonrequest_1.default {
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
        return types_1.Box.from_obj_for_encoding(body);
    }
}
exports.default = LookupApplicationBoxByIDandName;
//# sourceMappingURL=lookupApplicationBoxByIDandName.js.map