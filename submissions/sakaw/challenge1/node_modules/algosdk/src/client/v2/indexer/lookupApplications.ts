import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';

export default class LookupApplications extends JSONRequest {
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
  constructor(c: HTTPClient, intDecoding: IntDecoding, private index: number) {
    super(c, intDecoding);
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
