import JSONRequest from '../jsonrequest';
/**
 * Returns information about indexed assets.
 *
 * #### Example
 * ```typescript
 * const assets = await indexerClient.searchForAssets().do();
 * ```
 *
 * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2assets)
 * @category GET
 */
export default class SearchForAssets extends JSONRequest {
    /**
     * @returns `/v2/assets`
     */
    // eslint-disable-next-line class-methods-use-this
    path() {
        return '/v2/assets';
    }
    /**
     * Limit results for pagination.
     *
     * #### Example
     * ```typescript
     * const maxResults = 20;
     * const assets = await indexerClient
     *        .searchForAssets()
     *        .limit(maxResults)
     *        .do();
     * ```
     *
     * @param limit - maximum number of results to return.
     * @category query
     */
    limit(limit) {
        this.query.limit = limit;
        return this;
    }
    /**
     * Filter just assets with the given creator address.
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const assets = await indexerClient
     *        .searchForAssets()
     *        .creator(address)
     *        .do();
     * ```
     *
     * @param creator
     * @category query
     */
    creator(creator) {
        this.query.creator = creator;
        return this;
    }
    /**
     * Filter just assets with the given name.
     *
     * #### Example
     * ```typescript
     * const name = "Test Token";
     * const assets = await indexerClient
     *        .searchForAssets()
     *        .name(name)
     *        .do();
     * ```
     *
     * @param name
     * @category query
     */
    name(name) {
        this.query.name = name;
        return this;
    }
    /**
     * Filter just assets with the given unit.
     *
     * #### Example
     * ```typescript
     * const unit = "test";
     * const assets = await indexerClient
     *        .searchForAssets()
     *        .unit(unit)
     *        .do();
     * ```
     *
     * @param unit
     * @category query
     */
    unit(unit) {
        this.query.unit = unit;
        return this;
    }
    /**
     * Asset ID for filter, as int.
     *
     * #### Example
     * ```typescript
     * const assetId = 163650;
     * const assets = await indexerClient
     *        .searchForAssets()
     *        .index(assetId)
     *        .do();
     * ```
     * @remarks Alternatively, use `indexerClient.lookupAssetByID(assetId).do();`
     * @param index
     * @category query
     */
    index(index) {
        this.query['asset-id'] = index;
        return this;
    }
    /**
     * Specify the next page of results.
     *
     * #### Example
     * ```typescript
     * const maxResults = 20;
     *
     * const assetsPage1 = await indexerClient
     *        .searchForAssets()
     *        .limit(maxResults)
     *        .do();
     *
     * const assetsPage2 = await indexerClient
     *        .searchForAssets()
     *        .limit(maxResults)
     *        .nextToken(assetsPage1["next-token"])
     *        .do();
     * ```
     * @param nextToken - provided by the previous results.
     * @category query
     */
    nextToken(nextToken) {
        this.query.next = nextToken;
        return this;
    }
    /**
     * Includes all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
     *
     * #### Example 1
     * ```typescript
     * const assets = await indexerClient
     *        .searchForAssets()
     *        .includeAll(false)
     *        .do();
     * ```
     *
     * #### Example 2
     * ```typescript
     * const assets = await indexerClient
     *        .searchForAssets()
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
//# sourceMappingURL=searchForAssets.js.map