"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class LookupApplications extends jsonrequest_1.default {
    /**
     * Returns information about the passed application.
     *
     * #### Example
     * ```typescript
     * const appId = 60553466;
     * const appInfo = await indexerClient.lookupApplications(appId).do();
     * ```
     *
     * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2applicationsapplication-id)
     * @param index - The ID of the application to look up.
     * @category GET
     */
    constructor(c, intDecoding, index) {
        super(c, intDecoding);
        this.index = index;
        this.index = index;
    }
    /**
     * @returns `/v2/applications/${index}`
     */
    path() {
        return `/v2/applications/${this.index}`;
    }
    /**
     * Includes all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
     *
     * #### Example 1
     * ```typescript
     * const appId = 60553466;
     * const appInfo = await indexerClient
     *        .lookupApplications(appId)
     *        .includeAll(false)
     *        .do();
     * ```
     *
     * #### Example 2
     * ```typescript
     * const appId = 60553466;
     * const appInfo = await indexerClient
     *        .lookupApplications(appId)
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
exports.default = LookupApplications;
//# sourceMappingURL=lookupApplications.js.map