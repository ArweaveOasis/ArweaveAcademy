import JSONRequest from '../jsonrequest';
import { base64StringFunnel } from './lookupAccountTransactions';

/**
 * Returns information about indexed transactions.
 *
 * #### Example
 * ```typescript
 * const txns = await indexerClient.searchForTransactions().do();
 * ```
 *
 * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2transactions)
 * @category GET
 */
export default class SearchForTransactions extends JSONRequest {
  /**
   * @returns `/v2/transactions`
   */
  // eslint-disable-next-line class-methods-use-this
  path() {
    return '/v2/transactions';
  }

  /**
   * Specifies a prefix which must be contained in the note field.
   *
   * #### Example
   * ```typescript
   * const notePrefixBase64Encoded = "Y3JlYXRl";
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .notePrefix(notePrefixBase64Encoded)
   *        .do();
   * ```
   *
   * @param prefix - base64 string or uint8array
   * @category query
   */
  notePrefix(prefix: Uint8Array | string) {
    this.query['note-prefix'] = base64StringFunnel(prefix);
    return this;
  }

  /**
   * Type of transaction to filter with.
   *
   * #### Example
   * ```typescript
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .txType("keyreg")
   *        .do();
   * ```
   *
   * @param type - one of `pay`, `keyreg`, `acfg`, `axfer`, `afrz`, `appl`, `stpf`
   * @category query
   */
  txType(type: string) {
    this.query['tx-type'] = type;
    return this;
  }

  /**
   * Type of signature to filter with.
   * - sig: Standard
   * - msig: MultiSig
   * - lsig: LogicSig
   *
   * #### Example
   * ```typescript
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .sigType("sig")
   *        .do();
   * ```
   *
   * @param type - one of `sig`, `msig`, `lsig`
   * @category query
   */
  sigType(type: string) {
    this.query['sig-type'] = type;
    return this;
  }

  /**
   * Lookup the specific transaction by ID.
   *
   * #### Example
   * ```typescript
   * const txId = "MEUOC4RQJB23CQZRFRKYEI6WBO73VTTPST5A7B3S5OKBUY6LFUDA";
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .txid(txId)
   *        .do();
   * ```
   * @remarks Alternatively, use `indexerClient.lookupTransactionByID(txnId).do()`
   * @param txid
   * @category query
   */
  txid(txid: string) {
    this.query.txid = txid;
    return this;
  }

  /**
   * Include results for the specified round.
   *
   * #### Example
   * ```typescript
   * const targetBlock = 18309917;
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .round(targetBlock)
   *        .do();
   * ```
   * @remarks Alternatively, use `indexerClient.lookupBlock(targetBlock).do()`
   * @param round
   * @category query
   */
  round(round: number) {
    this.query.round = round;
    return this;
  }

  /**
   * Include results at or after the specified min-round.
   *
   * #### Example
   * ```typescript
   * const minRound = 18309917;
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .minRound(minRound)
   *        .do();
   * ```
   *
   * @param round
   * @category query
   */
  minRound(round: number) {
    this.query['min-round'] = round;
    return this;
  }

  /**
   * Include results at or before the specified max-round.
   *
   * #### Example
   * ```typescript
   * const maxRound = 18309917;
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .maxRound(maxRound)
   *        .do();
   * ```
   *
   * @param round
   * @category query
   */
  maxRound(round: number) {
    this.query['max-round'] = round;
    return this;
  }

  /**
   * Asset ID to filter with.
   *
   * #### Example
   * ```typescript
   * const assetID = 163650;
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .assetID(assetID)
   *        .do();
   * ```
   * @remarks Alternatively, use `indexerClient.lookupAssetTransactions(assetId).do()`
   * @param id
   * @category query
   */
  assetID(id: number) {
    this.query['asset-id'] = id;
    return this;
  }

  /**
   * Maximum number of results to return.
   *
   * #### Example
   * ```typescript
   * const maxResults = 25;
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .limit(maxResults)
   *        .do();
   * ```
   *
   * @param limit
   * @category query
   */
  limit(limit: number) {
    this.query.limit = limit;
    return this;
  }

  /**
   * Include results before the given time.
   *
   * #### Example
   * ```typescript
   * const beforeTime = "2022-02-02T20:20:22.02Z";
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .beforeTime(beforeTime)
   *        .do();
   * ```
   *
   * @param before - rfc3339 string
   * @category query
   */
  beforeTime(before: string) {
    this.query['before-time'] = before;
    return this;
  }

  /**
   * Include results after the given time.
   *
   * #### Example
   * ```typescript
   * const afterTime = "2022-10-21T00:00:11.55Z";
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .afterTime(afterTime)
   *        .do();
   * ```
   *
   * @param after - rfc3339 string
   * @category query
   */
  afterTime(after: string) {
    this.query['after-time'] = after;
    return this;
  }

  /**
   * Filtered results should have an amount greater than this value, as int, representing microAlgos, unless an asset-id is provided, in which case units are in the asset's units.
   *
   * #### Example 1
   * ```typescript
   * const minBalance = 300000;
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .currencyGreaterThan(minBalance - 1)
   *        .do();
   * ```
   *
   * #### Example 2
   * ```typescript
   * const assetID = 163650;
   * const minBalance = 300000;
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .assetID(assetID)
   *        .currencyGreaterThan(minBalance - 1)
   *        .do();
   * ```
   * @remarks
   * If you are looking for transactions with the currency amount greater than 0, simply construct the query without `currencyGreaterThan` because it doesn't accept `-1`, and passing the `0` `currency-greater-than` value would exclude transactions with a 0 amount.
   *
   * @param greater
   * @category query
   */
  currencyGreaterThan(greater: number) {
    this.query['currency-greater-than'] = greater;
    return this;
  }

  /**
   * Filtered results should have an amount less than this value, as int, representing microAlgos, unless an asset-id is provided, in which case units are in the asset's units.
   *
   * #### Example 1
   * ```typescript
   * const maxBalance = 500000;
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .currencyLessThan(maxBalance + 1)
   *        .do();
   * ```
   *
   * #### Example 2
   * ```typescript
   * const assetID = 163650;
   * const maxBalance = 500000;
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .assetID(assetID)
   *        .currencyLessThan(maxBalance + 1)
   *        .do();
   * ```
   *
   * @param lesser
   * @category query
   */
  currencyLessThan(lesser: number) {
    this.query['currency-less-than'] = lesser;
    return this;
  }

  /**
   * Combined with address, defines what address to filter on, as string.
   *
   * #### Example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const role = "freeze-target";
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .address(address)
   *        .addressRole(role)
   *        .do();
   * ```
   *
   * @param role - one of `sender`, `receiver`, `freeze-target`
   * @category query
   */
  addressRole(role: string) {
    this.query['address-role'] = role;
    return this;
  }

  /**
   * Only include transactions with this address in one of the transaction fields.
   *
   * #### Example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .address(address)
   *        .do();
   * ```
   * @remarks Alternatively, use `indexerClient.lookupAccountTransactions(address).do()`
   * @param address
   * @category query
   */
  address(address: string) {
    this.query.address = address;
    return this;
  }

  /**
   * Whether or not to consider the `close-to` field as a receiver when filtering transactions, as bool. Set to `true` to ignore `close-to`.
   *
   * #### Example
   * ```typescript
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .excludeCloseTo(true)
   *        .do();
   * ```
   *
   * @param exclude
   * @category query
   */
  excludeCloseTo(exclude: boolean) {
    this.query['exclude-close-to'] = exclude;
    return this;
  }

  /**
   * The next page of results.
   *
   * #### Example
   * ```typescript
   * const maxResults = 25;
   *
   * const txnsPage1 = await indexerClient
   *        .searchForTransactions()
   *        .limit(maxResults)
   *        .do();
   *
   * const txnsPage2 = await indexerClient
   *        .searchForTransactions()
   *        .limit(maxResults)
   *        .nextToken(txnsPage1["next-token"])
   *        .do();
   * ```
   *
   * @param nextToken - provided by the previous results
   * @category query
   */
  nextToken(nextToken: string) {
    this.query.next = nextToken;
    return this;
  }

  /**
   * Whether or not to include rekeying transactions.
   *
   * #### Example
   * ```typescript
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .rekeyTo(false)
   *        .do();
   * ```
   *
   * @param rekeyTo
   * @category query
   */
  rekeyTo(rekeyTo: boolean) {
    this.query['rekey-to'] = rekeyTo;
    return this;
  }

  /**
   * Filter for this application.
   *
   * #### Example
   * ```typescript
   * const appId = 60553466;
   * const txns = await indexerClient
   *        .searchForTransactions()
   *        .applicationID(appId)
   *        .do();
   * ```
   *
   * @param applicationID
   * @category query
   */
  applicationID(applicationID: number) {
    this.query['application-id'] = applicationID;
    return this;
  }
}
