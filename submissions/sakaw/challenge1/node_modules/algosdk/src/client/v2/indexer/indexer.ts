import ServiceClient from '../serviceClient';
import MakeHealthCheck from './makeHealthCheck';
import LookupAssetBalances from './lookupAssetBalances';
import LookupAssetTransactions from './lookupAssetTransactions';
import LookupAccountTransactions from './lookupAccountTransactions';
import LookupBlock from './lookupBlock';
import LookupTransactionByID from './lookupTransactionByID';
import LookupAccountByID from './lookupAccountByID';
import LookupAccountAssets from './lookupAccountAssets';
import LookupAccountCreatedAssets from './lookupAccountCreatedAssets';
import LookupAccountAppLocalStates from './lookupAccountAppLocalStates';
import LookupAccountCreatedApplications from './lookupAccountCreatedApplications';
import LookupAssetByID from './lookupAssetByID';
import LookupApplications from './lookupApplications';
import LookupApplicationLogs from './lookupApplicationLogs';
import LookupApplicationBoxByIDandName from './lookupApplicationBoxByIDandName';
import SearchAccounts from './searchAccounts';
import SearchForTransactions from './searchForTransactions';
import SearchForAssets from './searchForAssets';
import SearchForApplications from './searchForApplications';
import SearchForApplicationBoxes from './searchForApplicationBoxes';
import { BaseHTTPClient } from '../../baseHTTPClient';
import {
  CustomTokenHeader,
  IndexerTokenHeader,
} from '../../urlTokenBaseHTTPClient';

/**
 * The Indexer provides a REST API interface of API calls to support searching the Algorand Blockchain.
 *
 * The Indexer REST APIs retrieve the blockchain data from a PostgreSQL compatible database that must be populated.
 *
 * This database is populated using the same indexer instance or a separate instance of the indexer which must connect to the algod process of a running Algorand node to read block data.
 *
 * This node must also be an Archival node to make searching the entire blockchain possible.
 *
 * #### Relevant Information
 * [Learn more about Indexer](https://developer.algorand.org/docs/get-details/indexer/)
 *
 * [Run Indexer in Postman OAS3](https://developer.algorand.org/docs/rest-apis/restendpoints/#algod-indexer-and-kmd-rest-endpoints)
 */
export default class IndexerClient extends ServiceClient {
  /**
   * Create an IndexerClient from
   * * either a token, baseServer, port, and optional headers
   * * or a base client server for interoperability with external dApp wallets
   *
   * #### Example
   * ```typescript
   * const token  = "";
   * const server = "http://localhost";
   * const port   = 8980;
   * const indexerClient = new algosdk.Indexer(token, server, port);
   * ```
   * @remarks
   * The above configuration is for a sandbox private network.
   * For applications on production, you are encouraged to run your own node with indexer, or use an Algorand REST API provider with a dedicated API key.
   *
   * @param tokenOrBaseClient - The API token for the Indexer API
   * @param baseServer - REST endpoint
   * @param port - Port number if specifically configured by the server
   * @param headers - Optional headers
   */
  constructor(
    tokenOrBaseClient:
      | string
      | IndexerTokenHeader
      | CustomTokenHeader
      | BaseHTTPClient,
    baseServer = 'http://127.0.0.1',
    port: string | number = 8080,
    headers: Record<string, string> = {}
  ) {
    super('X-Indexer-API-Token', tokenOrBaseClient, baseServer, port, headers);
  }

  /**
   * Returns the health object for the service.
   * Returns 200 if healthy.
   *
   * #### Example
   * ```typescript
   * const health = await indexerClient.makeHealthCheck().do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-health)
   * @category GET
   */
  makeHealthCheck() {
    return new MakeHealthCheck(this.c, this.intDecoding);
  }

  /**
   * Returns the list of accounts who hold the given asset and their balance.
   *
   * #### Example
   * ```typescript
   * const assetId = 163650;
   * const assetBalances = await indexerClient.lookupAssetBalances(assetId).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2assetsasset-idbalances)
   * @param index - The asset ID to look up.
   * @category GET
   */
  lookupAssetBalances(index: number) {
    return new LookupAssetBalances(this.c, this.intDecoding, index);
  }

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
   * @category GET
   */
  lookupAssetTransactions(index: number) {
    return new LookupAssetTransactions(this.c, this.intDecoding, index);
  }

  /**
   * Returns transactions relating to the given account.
   *
   * #### Example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const accountTxns = await indexerClient.lookupAccountTransactions(address).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-idtransactions)
   * @param account - The address of the account.
   * @category GET
   */
  lookupAccountTransactions(account: string) {
    return new LookupAccountTransactions(this.c, this.intDecoding, account);
  }

  /**
   * Returns the block for the passed round.
   *
   * #### Example
   * ```typescript
   * const targetBlock = 18309917;
   * const blockInfo = await indexerClient.lookupBlock(targetBlock).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2blocksround-number)
   * @param round - The number of the round to look up.
   * @category GET
   */
  lookupBlock(round: number) {
    return new LookupBlock(this.c, this.intDecoding, round);
  }

  /**
   * Returns information about the given transaction.
   *
   * #### Example
   * ```typescript
   * const txnId = "MEUOC4RQJB23CQZRFRKYEI6WBO73VTTPST5A7B3S5OKBUY6LFUDA";
   * const txnInfo = await indexerClient.lookupTransactionByID(txnId).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2transactionstxid)
   * @param txID - The ID of the transaction to look up.
   * @category GET
   */
  lookupTransactionByID(txID: string) {
    return new LookupTransactionByID(this.c, this.intDecoding, txID);
  }

  /**
   * Returns information about the given account.
   *
   * #### Example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const accountInfo = await indexerClient.lookupAccountByID(address).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-id)
   * @param account - The address of the account to look up.
   * @category GET
   */
  lookupAccountByID(account: string) {
    return new LookupAccountByID(this.c, this.intDecoding, account);
  }

  /**
   * Returns asset about the given account.
   *
   * #### Example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const accountAssets = await indexerClient.lookupAccountAssets(address).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-idassets)
   * @param account - The address of the account to look up.
   * @category GET
   */
  lookupAccountAssets(account: string) {
    return new LookupAccountAssets(this.c, this.intDecoding, account);
  }

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
  lookupAccountCreatedAssets(account: string) {
    return new LookupAccountCreatedAssets(this.c, this.intDecoding, account);
  }

  /**
   * Returns application local state about the given account.
   *
   * #### Example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const accountAppLocalStates = await indexerClient.lookupAccountAppLocalStates(address).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-idapps-local-state)
   * @param account - The address of the account to look up.
   * @category GET
   */
  lookupAccountAppLocalStates(account: string) {
    return new LookupAccountAppLocalStates(this.c, this.intDecoding, account);
  }

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
  lookupAccountCreatedApplications(account: string) {
    return new LookupAccountCreatedApplications(
      this.c,
      this.intDecoding,
      account
    );
  }

  /**
   * Returns information about the passed asset.
   *
   * #### Example
   * ```typescript
   * const assetId = 163650;
   * const assetInfo = await indexerClient.lookupAssetByID(assetId).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2assetsasset-id)
   * @param index - The ID of the asset ot look up.
   * @category GET
   */
  lookupAssetByID(index: number) {
    return new LookupAssetByID(this.c, this.intDecoding, index);
  }

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
  lookupApplications(index: number) {
    return new LookupApplications(this.c, this.intDecoding, index);
  }

  /**
   * Returns log messages generated by the passed in application.
   *
   * #### Example
   * ```typescript
   * const appId = 60553466;
   * const appLogs = await indexerClient.lookupApplicationLogs(appId).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2applicationsapplication-idlogs)
   * @param appID - The ID of the application which generated the logs.
   * @category GET
   */
  lookupApplicationLogs(appID: number) {
    return new LookupApplicationLogs(this.c, this.intDecoding, appID);
  }

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
  searchAccounts() {
    return new SearchAccounts(this.c, this.intDecoding);
  }

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
  searchForTransactions() {
    return new SearchForTransactions(this.c, this.intDecoding);
  }

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
  searchForAssets() {
    return new SearchForAssets(this.c, this.intDecoding);
  }

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
  searchForApplications() {
    return new SearchForApplications(this.c, this.intDecoding);
  }

  /**
   * Returns information about indexed application boxes.
   *
   * #### Example
   * ```typescript
   * const maxResults = 20;
   * const appID = 1234;
   *
   * const responsePage1 = await indexerClient
   *        .searchForApplicationBoxes(appID)
   *        .limit(maxResults)
   *        .do();
   * const boxNamesPage1 = responsePage1.boxes.map(box => box.name);
   *
   * const responsePage2 = await indexerClient
   *        .searchForApplicationBoxes(appID)
   *        .limit(maxResults)
   *        .nextToken(responsePage1.nextToken)
   *        .do();
   * const boxNamesPage2 = responsePage2.boxes.map(box => box.name);
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2applicationsapplication-idboxes)
   * @param appID - The ID of the application with boxes.
   * @category GET
   */
  searchForApplicationBoxes(appID: number) {
    return new SearchForApplicationBoxes(this.c, this.intDecoding, appID);
  }

  /**
   * Returns information about the application box given its name.
   *
   * #### Example
   * ```typescript
   * const boxName = Buffer.from("foo");
   * const boxResponse = await indexerClient
   *        .LookupApplicationBoxByIDandName(1234, boxName)
   *        .do();
   * const boxValue = boxResponse.value;
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-v2applicationsapplication-idbox)
   * @param appID - The ID of the application with boxes.
   * @category GET
   */
  lookupApplicationBoxByIDandName(appID: number, boxName: Uint8Array) {
    return new LookupApplicationBoxByIDandName(
      this.c,
      this.intDecoding,
      appID,
      boxName
    );
  }
}
