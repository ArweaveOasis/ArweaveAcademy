import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import IntDecoding from '../../../types/intDecoding';
export default class LookupAssetTransactions extends JSONRequest {
    private index;
    /**
     * Returns transactions relating to the given asset.
     *
     * #### Example
     * ```typescript
     * const assetId = 163650;
     * const assetTxns = await indexerClient.lookupAssetTransactions(assetId).do();
     * ```
     *
     * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2assetsasset-idtransactions)
     * @param index - The asset ID to look up.
     */
    constructor(c: HTTPClient, intDecoding: IntDecoding, index: number);
    /**
     * @returns `/v2/assets/${index}/transactions`
     */
    path(): string;
    /**
     * Specifies a prefix which must be contained in the note field.
     *
     * #### Example
     * ```typescript
     * const notePrefixBase64Encoded = "Y3JlYXRl";
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .notePrefix(notePrefixBase64Encoded)
     *        .do();
     * ```
     *
     * @param prefix - base64 string or uint8array
     * @category query
     */
    notePrefix(prefix: Uint8Array | string): this;
    /**
     * Type of transaction to filter with.
     *
     * #### Example
     * ```typescript
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .txType("axfer")
     *        .do();
     * ```
     *
     * @param type - one of `pay`, `keyreg`, `acfg`, `axfer`, `afrz`, `appl`
     * @category query
     */
    txType(type: string): this;
    /**
     * Type of signature to filter with.
     * - sig: Standard
     * - msig: MultiSig
     * - lsig: LogicSig
     *
     * #### Example
     * ```typescript
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .sigType("lsig")
     *        .do();
     * ```
     *
     * @param type - one of `sig`, `msig`, `lsig`
     * @category query
     */
    sigType(type: string): this;
    /**
     * Lookup the specific transaction by ID.
     *
     * #### Example
     * ```typescript
     * const txId = "MEUOC4RQJB23CQZRFRKYEI6WBO73VTTPST5A7B3S5OKBUY6LFUDA";
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .txid(txId)
     *        .do();
     * ```
     *
     * @param txid
     * @category query
     */
    txid(txid: string): this;
    /**
     * Include results for the specified round.
     *
     * #### Example
     * ```typescript
     * const targetBlock = 18309917;
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .round(targetBlock)
     *        .do();
     * ```
     *
     * @param round
     * @category query
     */
    round(round: number): this;
    /**
     * Include results at or after the specified min-round.
     *
     * #### Example
     * ```typescript
     * const minRound = 18309917;
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .minRound(minRound)
     *        .do();
     * ```
     *
     * @param round
     * @category query
     */
    minRound(round: number): this;
    /**
     * Include results at or before the specified max-round.
     *
     * #### Example
     * ```typescript
     * const maxRound = 18309917;
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .maxRound(maxRound)
     *        .do();
     * ```
     *
     * @param round
     * @category query
     */
    maxRound(round: number): this;
    /**
     * @deprecated Redundant query parameter. Asset ID is already passed into the method.
     */
    assetID(id: number): this;
    /**
     * Maximum number of results to return.
     *
     * #### Example
     * ```typescript
     * const maxResults = 25;
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .limit(maxResults)
     *        .do();
     * ```
     *
     * @param limit
     * @category query
     */
    limit(limit: number): this;
    /**
     * Include results before the given time.
     *
     * #### Example
     * ```typescript
     * const beforeTime = "2022-02-02T20:20:22.02Z";
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .beforeTime(beforeTime)
     *        .do();
     * ```
     *
     * @param before - rfc3339 string
     * @category query
     */
    beforeTime(before: string): this;
    /**
     * Include results after the given time.
     *
     * #### Example
     * ```typescript
     * const afterTime = "2022-10-21T00:00:11.55Z";
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .afterTime(afterTime)
     *        .do();
     * ```
     *
     * @param after - rfc3339 string
     * @category query
     */
    afterTime(after: string): this;
    /**
     * Filtered results should have an amount greater than this value, as int, representing asset units.
     *
     * #### Example
     * ```typescript
     * const minBalance = 300000;
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .currencyGreaterThan(minBalance - 1)
     *        .do();
     * ```
     *
     * @remarks
     * If you are looking for transactions with the currency amount greater than 0, simply construct the query without `currencyGreaterThan` because it doesn't accept `-1`, and passing the `0` `currency-greater-than` value would exclude transactions with a 0 amount.
     *
     * @param greater
     * @category query
     */
    currencyGreaterThan(greater: number): this;
    /**
     * Filtered results should have an amount less than this value, as int, representing asset units.
     *
     * #### Example
     * ```typescript
     * const maxBalance = 500000;
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .currencyLessThan(maxBalance + 1)
     *        .do();
     * ```
     *
     * @param lesser
     * @category query
     */
    currencyLessThan(lesser: number): this;
    /**
     * Combined with address, defines what address to filter on, as string.
     *
     * #### Example
     * ```typescript
     * const assetId = 163650;
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const role = "sender";
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .address(address)
     *        .addressRole(role)
     *        .do();
     * ```
     *
     * @param role - one of `sender`, `receiver`, `freeze-target`
     * @category query
     */
    addressRole(role: string): this;
    /**
     * Only include transactions with this address in one of the transaction fields.
     *
     * #### Example
     * ```typescript
     * const assetId = 163650;
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .address(address)
     *        .do();
     * ```
     *
     * @param address
     * @category query
     */
    address(address: string): this;
    /**
     * Whether or not to consider the `close-to` field as a receiver when filtering transactions, as bool. Set to `true` to ignore `close-to`.
     *
     * #### Example
     * ```typescript
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .excludeCloseTo(true)
     *        .do();
     * ```
     *
     * @param exclude
     * @category query
     */
    excludeCloseTo(exclude: boolean): this;
    /**
     * The next page of results.
     *
     * #### Example
     * ```typescript
     * const maxResults = 25;
     * const assetId = 163650;
     *
     * const assetTxnsPage1 = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .limit(maxResults)
     *        .do();
     *
     * const assetTxnsPage2 = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .limit(maxResults)
     *        .nextToken(assetTxnsPage1["next-token"])
     *        .do();
     * ```
     *
     * @param nextToken - provided by the previous results.
     * @category query
     */
    nextToken(nextToken: string): this;
    /**
     * Whether or not to include rekeying transactions.
     *
     * #### Example
     * ```typescript
     * const assetId = 163650;
     * const assetTxns = await indexerClient
     *        .lookupAssetTransactions(assetId)
     *        .rekeyTo(false)
     *        .do();
     * ```
     *
     * @param rekeyTo
     * @category query
     */
    rekeyTo(rekeyTo: boolean): this;
}
