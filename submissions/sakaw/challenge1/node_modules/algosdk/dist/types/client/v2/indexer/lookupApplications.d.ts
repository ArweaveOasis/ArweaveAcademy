import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class LookupApplications extends JSONRequest {
    private index;
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
    constructor(c: HTTPClient, intDecoding: IntDecoding, index: number);
    /**
     * @returns `/v2/applications/${index}`
     */
    path(): string;
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
    includeAll(value?: boolean): this;
}
