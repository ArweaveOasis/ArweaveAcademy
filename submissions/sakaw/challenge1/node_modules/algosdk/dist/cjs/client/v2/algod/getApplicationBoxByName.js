"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
const types_1 = require("./models/types");
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
class GetApplicationBoxByName extends jsonrequest_1.default {
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
        return types_1.Box.from_obj_for_encoding(body);
    }
}
exports.default = GetApplicationBoxByName;
//# sourceMappingURL=getApplicationBoxByName.js.map