import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class LookupAccountCreatedApplications extends JSONRequest {
    private account;
    /**
     * Returns application information created by the given account.
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const accountCreatedApps = await indexerClient.lookupAccountCreatedApplications(address).do();
     * ```
     *
     * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-idcreated-applications)
     * @param account - The address of the account to look up.
     * @category GET
     */
    constructor(c: HTTPClient, intDecoding: IntDecoding, account: string);
    /**
     * @returns `/v2/accounts/${account}/created-applications`
     */
    path(): string;
    /**
     * Add a limit for filter.
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const maxResults = 20;
     * const accountAssets = await indexerClient
     *        .lookupAccountCreatedApplications(address)
     *        .limit(maxResults)
     *        .do();
     * ```
     *
     * @param limit - maximum number of results to return.
     * @category query
     */
    limit(limit: number): this;
    /**
     * Specify round to filter with.
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const targetBlock = 18309917;
     * const accountAssets = await indexerClient
     *        .lookupAccountCreatedApplications(address)
     *        .round(targetBlock)
     *        .do();
     * ```
     * @param round
     * @category query
     */
    round(round: number): this;
    /**
     * Specify the next page of results.
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const maxResults = 20;
     *
     * const accountAssetsPage1 = await indexerClient
     *        .lookupAccountCreatedApplications(address)
     *        .limit(maxResults)
     *        .do();
     *
     * const accountAssetsPage2 = await indexerClient
     *        .lookupAccountCreatedApplications(address)
     *        .limit(maxResults)
     *        .next(accountAssetsPage1["next-token"])
     *        .do();
     * ```
     * @param nextToken - provided by the previous results.
     * @category query
     */
    nextToken(nextToken: string): this;
    /**
     * Include all items including closed accounts, deleted applications, destroyed assets, opted-out asset holdings, and closed-out application localstates
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const accountAssets = await indexerClient
     *        .lookupAccountCreatedApplications(address)
     *        .includeAll(false)
     *        .do();
     * ```
     * @param value
     * @category query
     */
    includeAll(value?: boolean): this;
    /**
     * Specify an applicationID to search for.
     *
     * #### Example
     * ```typescript
     * const applicationID = 163650;
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const accountApplications = await indexerClient
     *        .lookupAccountAppLocalStates(address)
     *        .applicationID(applicationID)
     *        .do();
     * ```
     * @param index - the applicationID
     * @category query
     */
    applicationID(index: number): this;
}
