import JSONRequest from '../jsonrequest';
export default class LookupAccountCreatedAssets extends JSONRequest {
    /**
     * Returns asset information created by the given account.
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const accountCreatedAssets = await indexerClient.lookupAccountCreatedAssets(address).do();
     * ```
     *
     * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-idcreated-assets)
     * @param account - The address of the account to look up.
     * @category GET
     */
    constructor(c, intDecoding, account) {
        super(c, intDecoding);
        this.account = account;
        this.account = account;
    }
    /**
     * @returns `/v2/accounts/${account}/created-assets`
     */
    path() {
        return `/v2/accounts/${this.account}/created-assets`;
    }
    /**
     * Add a limit for filter.
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const maxResults = 20;
     * const accountAssets = await indexerClient
     *        .lookupAccountCreatedAssets(address)
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
     * Specify round to filter with.
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const targetBlock = 18309917;
     * const accountAssets = await indexerClient
     *        .lookupAccountCreatedAssets(address)
     *        .round(targetBlock)
     *        .do();
     * ```
     * @param round
     * @category query
     */
    round(round) {
        this.query.round = round;
        return this;
    }
    /**
     * Specify the next page of results.
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const maxResults = 20;
     *
     * const accountAssetsPage1 = await indexerClient
     *        .lookupAccountCreatedAssets(address)
     *        .limit(maxResults)
     *        .do();
     * ```
     *
     * const accountAssetsPage2 = await indexerClient
     *        .lookupAccountCreatedAssets(address)
     *        .limit(maxResults)
     *        .next(accountAssetsPage1["next-token"])
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
     * Include all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const accountAssets = await indexerClient
     *        .lookupAccountCreatedAssets(address)
     *        .includeAll(false)
     *        .do();
     * ```
     * @param value
     * @category query
     */
    includeAll(value = true) {
        this.query['include-all'] = value;
        return this;
    }
    /**
     * Specify an assetID to search for.
     *
     * #### Example
     * ```typescript
     * const assetID = 163650;
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const assetAssets = await indexerClient
     *        .lookupAccountCreatedAssets(address)
     *        .assetID(assetID)
     *        .do();
     * ```
     * @param index - the assetID
     * @category query
     */
    assetID(index) {
        this.query['asset-id'] = index;
        return this;
    }
}
//# sourceMappingURL=lookupAccountCreatedAssets.js.map