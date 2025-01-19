"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
/**
 * Returns information about indexed accounts.
 *
 * #### Example
 * ```typescript
 * const accounts = await indexerClient.searchAccounts().do();
 * ```
 *
 * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accounts)
 * @category GET
 */
class SearchAccounts extends jsonrequest_1.default {
    /**
     * @returns `/v2/accounts`
     */
    // eslint-disable-next-line class-methods-use-this
    path() {
        return '/v2/accounts';
    }
    /**
     * Filtered results should have an amount greater than this value, as int, representing microAlgos, unless an asset-id is provided, in which case units are in the asset's units.
     *
     * #### Example 1
     * ```typescript
     * const minBalance = 300000;
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .currencyGreaterThan(minBalance - 1)
     *        .do();
     * ```
     *
     * #### Example 2
     * ```typescript
     * const assetID = 163650;
     * const minBalance = 300000;
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .assetID(assetID)
     *        .currencyGreaterThan(minBalance - 1)
     *        .do();
     * ```
     * @remarks
     * If you are looking for accounts with the currency amount greater than 0, simply construct the query without `currencyGreaterThan` because it doesn't accept `-1`, and passing the `0` `currency-greater-than` value would exclude accounts with a 0 amount.
     *
     * @param greater
     * @category query
     */
    currencyGreaterThan(greater) {
        this.query['currency-greater-than'] = greater;
        return this;
    }
    /**
     * Filtered results should have an amount less than this value, as int, representing microAlgos, unless an asset-id is provided, in which case units are in the asset's units.
     *
     * #### Example 1
     * ```typescript
     * const maxBalance = 500000;
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .currencyLessThan(maxBalance + 1)
     *        .do();
     * ```
     *
     * #### Example 2
     * ```typescript
     * const assetID = 163650;
     * const maxBalance = 500000;
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .assetID(assetID)
     *        .currencyLessThan(maxBalance + 1)
     *        .do();
     * ```
     *
     * @param lesser
     * @category query
     */
    currencyLessThan(lesser) {
        this.query['currency-less-than'] = lesser;
        return this;
    }
    /**
     * Maximum number of results to return.
     *
     * #### Example
     * ```typescript
     * const maxResults = 25;
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .limit(maxResults)
     *        .do();
     * ```
     *
     * @param limit
     * @category query
     */
    limit(limit) {
        this.query.limit = limit;
        return this;
    }
    /**
     * Asset ID to filter with.
     *
     * #### Example
     * ```typescript
     * const assetID = 163650;
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .assetID(assetID)
     *        .do();
     * ```
     *
     * @param id
     * @category query
     */
    assetID(id) {
        this.query['asset-id'] = id;
        return this;
    }
    /**
     * The next page of results.
     *
     * #### Example
     * ```typescript
     * const maxResults = 25;
     *
     * const accountsPage1 = await indexerClient
     *        .searchAccounts()
     *        .limit(maxResults)
     *        .do();
     *
     * const accountsPage2 = await indexerClient
     *        .searchAccounts()
     *        .limit(maxResults)
     *        .nextToken(accountsPage1["next-token"])
     *        .do();
     * ```
     *
     * @param nextToken - provided by the previous results
     * @category query
     */
    nextToken(nextToken) {
        this.query.next = nextToken;
        return this;
    }
    /**
     * Include results for the specified round.
     *
     * #### Example
     * ```typescript
     * const targetBlock = 18309917;
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .round(targetBlock)
     *        .do();
     * ```
     * @remarks For performance reasons, this parameter may be disabled on some configurations.
     * @param round
     * @category query
     */
    round(round) {
        this.query.round = round;
        return this;
    }
    /**
     * Include accounts that use this spending key.
     *
     * #### Example
     * ```typescript
     * const authAddr = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .authAddr(authAddr)
     *        .do();
     * ```
     *
     * @param authAddr
     */
    authAddr(authAddr) {
        this.query['auth-addr'] = authAddr;
        return this;
    }
    /**
     * Filter for this application.
     *
     * #### Example
     * ```typescript
     * const appId = 60553466;
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .applicationID(appId)
     *        .do();
     * ```
     *
     * @param applicationID
     * @category query
     */
    applicationID(applicationID) {
        this.query['application-id'] = applicationID;
        return this;
    }
    /**
     * Includes all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
     *
     * #### Example 1
     * ```typescript
     * const assetId = 163650;
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .includeAll(false)
     *        .do();
     * ```
     *
     * #### Example 2
     * ```typescript
     * const assetId = 163650;
     * const accounts = await indexerClient
     *        .searchAccounts()
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
    /**
     * Exclude additional items such as asset holdings, application local data stored for this account, asset parameters created by this account, and application parameters created by this account.
     *
     * #### Example 1
     * ```typescript
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .exclude("all")
     *        .do();
     * ```
     *
     * #### Example 2
     * ```typescript
     * const accounts = await indexerClient
     *        .searchAccounts()
     *        .exclude("assets,created-assets")
     *        .do();
     * ```
     * @remarks By default, it behaves as exclude=none
     * @param exclude - Array of `all`, `assets`, `created-assets`, `apps-local-state`, `created-apps`, `none`
     * @category query
     */
    exclude(exclude) {
        this.query.exclude = exclude;
        return this;
    }
}
exports.default = SearchAccounts;
//# sourceMappingURL=searchAccounts.js.map