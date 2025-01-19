import JSONRequest from '../jsonrequest';

/**
 * Returns information about indexed applications.
 *
 * #### Example
 * ```typescript
 * const apps = await indexerClient.searchForApplications().do();
 * ```
 *
 * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2applications)
 * @category GET
 */
export default class SearchForApplications extends JSONRequest {
  /**
   * @returns `/v2/applications`
   */
  // eslint-disable-next-line class-methods-use-this
  path() {
    return '/v2/applications';
  }

  /**
   * Application ID for filter, as int
   *
   * #### Example
   * ```typescript
   * const appId = 60553466;
   * const apps = await indexerClient
   *        .searchForApplications()
   *        .index(appId)
   *        .do();
   * ```
   * @remarks Alternatively, use `indexerClient.lookupApplications(appId).do()`
   * @param index
   * @category query
   */
  index(index: number) {
    this.query['application-id'] = index;
    return this;
  }

  /**
   * Creator for filter, as string
   *
   * #### Example
   * ```typescript
   * const creator = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const apps = await indexerClient
   *        .searchForApplications()
   *        .creator(creator)
   *        .do();
   * ```
   * @param creator
   * @category query
   */
  creator(creator: string) {
    this.query.creator = creator;
    return this;
  }

  /**
   * Specify the next page of results.
   *
   * #### Example
   * ```typescript
   * const maxResults = 20;
   *
   * const appsPage1 = await indexerClient
   *        .searchForApplications()
   *        .limit(maxResults)
   *        .do();
   *
   * const appsPage2 = await indexerClient
   *        .searchForApplications()
   *        .limit(maxResults)
   *        .nextToken(appsPage1["next-token"])
   *        .do();
   * ```
   * @param nextToken - provided by the previous results.
   * @category query
   */
  nextToken(next: string) {
    this.query.next = next;
    return this;
  }

  /**
   * Limit results for pagination.
   *
   * #### Example
   * ```typescript
   * const maxResults = 20;
   * const apps = await indexerClient
   *        .searchForApplications()
   *        .limit(maxResults)
   *        .do();
   * ```
   *
   * @param limit - maximum number of results to return.
   * @category query
   */
  limit(limit: number) {
    this.query.limit = limit;
    return this;
  }

  /**
   * Includes all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
   *
   * #### Example 1
   * ```typescript
   * const apps = await indexerClient
   *        .searchForApplications()
   *        .includeAll(false)
   *        .do();
   * ```
   *
   * #### Example 2
   * ```typescript
   * const apps = await indexerClient
   *        .searchForApplications()
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
