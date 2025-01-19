import ServiceClient from '../serviceClient';
import * as modelsv2 from './models/types';
import AccountInformation from './accountInformation';
import AccountAssetInformation from './accountAssetInformation';
import AccountApplicationInformation from './accountApplicationInformation';
import Block from './block';
import Compile from './compile';
import Dryrun from './dryrun';
import Genesis from './genesis';
import GetAssetByID from './getAssetByID';
import GetApplicationByID from './getApplicationByID';
import GetBlockHash from './getBlockHash';
import GetApplicationBoxByName from './getApplicationBoxByName';
import GetApplicationBoxes from './getApplicationBoxes';
import HealthCheck from './healthCheck';
import PendingTransactionInformation from './pendingTransactionInformation';
import PendingTransactions from './pendingTransactions';
import PendingTransactionsByAddress from './pendingTransactionsByAddress';
import GetTransactionProof from './getTransactionProof';
import SendRawTransaction from './sendRawTransaction';
import Status from './status';
import StatusAfterBlock from './statusAfterBlock';
import SuggestedParams from './suggestedParams';
import Supply from './supply';
import Versions from './versions';
import { BaseHTTPClient } from '../../baseHTTPClient';
import {
  AlgodTokenHeader,
  CustomTokenHeader,
} from '../../urlTokenBaseHTTPClient';
import LightBlockHeaderProof from './lightBlockHeaderProof';
import StateProof from './stateproof';

/**
 * Algod client connects an application to the Algorand blockchain. The algod client requires a valid algod REST endpoint IP address and algod token from an Algorand node that is connected to the network you plan to interact with.
 *
 * Algod is the main Algorand process for handling the blockchain. Messages between nodes are processed, the protocol steps are executed, and the blocks are written to disk. The algod process also exposes a REST API server that developers can use to communicate with the node and the network. Algod uses the data directory for storage and configuration information.
 *
 * #### Relevant Information
 * [How do I obtain an algod address and token?](https://developer.algorand.org/docs/archive/build-apps/setup/?from_query=algod#how-do-i-obtain-an-algod-address-and-token)
 *
 * [Run Algod in Postman OAS3](https://developer.algorand.org/docs/rest-apis/restendpoints/?from_query=algod#algod-indexer-and-kmd-rest-endpoints)
 */
export default class AlgodClient extends ServiceClient {
  /**
   * Create an AlgodClient from
   * * either a token, baseServer, port, and optional headers
   * * or a base client server for interoperability with external dApp wallets
   *
   * #### Example
   * ```typescript
   * const token  = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
   * const server = "http://localhost";
   * const port   = 4001;
   * const algodClient = new algosdk.Algodv2(token, server, port);
   * ```
   * @remarks
   * The above configuration is for a sandbox private network.
   * For applications on production, you are encouraged to run your own node, or use an Algorand REST API provider with a dedicated API key.
   *
   * @param tokenOrBaseClient - The algod token from the Algorand node you are interacting with
   * @param baseServer - REST endpoint
   * @param port - Port number if specifically configured by the server
   * @param headers - Optional headers
   */
  constructor(
    tokenOrBaseClient:
      | string
      | AlgodTokenHeader
      | CustomTokenHeader
      | BaseHTTPClient,
    baseServer = 'http://r2.algorand.network',
    port: string | number = 4180,
    headers: Record<string, string> = {}
  ) {
    super('X-Algo-API-Token', tokenOrBaseClient, baseServer, port, headers);
  }

  /**
   * Returns OK if healthy.
   *
   * #### Example
   * ```typescript
   * const health = await algodClient.healthCheck().do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-health)
   * @category GET
   */
  healthCheck() {
    return new HealthCheck(this.c);
  }

  /**
   * Retrieves the supported API versions, binary build versions, and genesis information.
   *
   * #### Example
   * ```typescript
   * const versionsDetails = await algodClient.versionsCheck().do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-versions)
   * @category GET
   */
  versionsCheck() {
    return new Versions(this.c);
  }

  /**
   * Broadcasts a raw transaction to the network.
   *
   * #### Example
   * ```typescript
   * const { txId } = await algodClient.sendRawTransaction(signedTxns).do();
   * const result = await waitForConfirmation(algodClient, txid, 3);
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#post-v2transactions)
   *
   * @remarks
   * Often used with {@linkcode waitForConfirmation}
   * @param stxOrStxs - Signed transactions
   * @category POST
   */
  sendRawTransaction(stxOrStxs: Uint8Array | Uint8Array[]) {
    return new SendRawTransaction(this.c, stxOrStxs);
  }

  /**
   * Returns the given account's status, balance and spendable amounts.
   *
   * #### Example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const accountInfo = await algodClient.accountInformation(address).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2accountsaddress)
   * @param account - The address of the account to look up.
   * @category GET
   */
  accountInformation(account: string) {
    return new AccountInformation(this.c, this.intDecoding, account);
  }

  /**
   * Returns the given account's asset information for a specific asset.
   *
   * #### Example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const index = 60553466;
   * const accountAssetInfo = await algodClient.accountAssetInformation(address, index).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2accountsaddress)
   * @param account - The address of the account to look up.
   * @param index - The asset ID to look up.
   * @category GET
   */
  accountAssetInformation(account: string, index: number) {
    return new AccountAssetInformation(
      this.c,
      this.intDecoding,
      account,
      index
    );
  }

  /**
   * Returns the given account's application information for a specific application.
   *
   * #### Example
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const index = 60553466;
   * const accountInfo = await algodClient.accountApplicationInformation(address, index).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2accountsaddress)
   * @param account - The address of the account to look up.
   * @param index - The application ID to look up.
   * @category GET
   */
  accountApplicationInformation(account: string, index: number) {
    return new AccountApplicationInformation(
      this.c,
      this.intDecoding,
      account,
      index
    );
  }

  /**
   * Gets the block info for the given round.
   *
   * #### Example
   * ```typescript
   * const roundNumber = 18038133;
   * const block = await algodClient.block(roundNumber).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2blocksround)
   * @param roundNumber - The round number of the block to get.
   * @category GET
   */
  block(roundNumber: number) {
    return new Block(this.c, roundNumber);
  }

  /**
   * Get the block hash for the block on the given round.
   *
   * #### Example
   * ```typescript
   * const roundNumber = 18038133;
   * const block = await algodClient.getBlockHash(roundNumber).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2blocksroundhash)
   * @param roundNumber - The round number of the block to get.
   * @category GET
   */
  getBlockHash(roundNumber: number) {
    return new GetBlockHash(this.c, this.intDecoding, roundNumber);
  }

  /**
   * Returns the transaction information for a specific pending transaction.
   *
   * #### Example
   * ```typescript
   * const txId = "DRJS6R745A7GFVMXEXWP4TGVDGKW7VILFTA7HC2BR2GRLHNY5CTA";
   * const pending = await algodClient.pendingTransactionInformation(txId).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2transactionspendingtxid)
   *
   * @remarks
   * <br><br>
   * There are several cases when this might succeed:
   * - transaction committed (committed round > 0)
   * - transaction still in the pool (committed round = 0, pool error = "")
   * - transaction removed from pool due to error (committed round = 0, pool error != "")
   *
   * Or the transaction may have happened sufficiently long ago that the node no longer remembers it, and this will return an error.
   *
   * @param txid - The TxID string of the pending transaction to look up.
   * @category GET
   */
  pendingTransactionInformation(txid: string) {
    return new PendingTransactionInformation(this.c, txid);
  }

  /**
   * Returns the list of pending transactions in the pool, sorted by priority, in decreasing order, truncated at the end at MAX.
   * If MAX = 0, returns all pending transactions.
   *
   * #### Example 1
   * ```typescript
   * const pendingTxns = await algodClient.pendingTransactionsInformation().do();
   * ```
   *
   * #### Example 2
   * ```typescript
   * const maxTxns = 5;
   * const pendingTxns = await algodClient
   *     .pendingTransactionsInformation()
   *     .max(maxTxns)
   *     .do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2transactionspending)
   * @category GET
   */
  pendingTransactionsInformation() {
    return new PendingTransactions(this.c);
  }

  /**
   * Returns the list of pending transactions sent by the address, sorted by priority, in decreasing order, truncated at the end at MAX.
   * If MAX = 0, returns all pending transactions.
   *
   * #### Example 1
   * ```typescript
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const pendingTxnsByAddr = await algodClient.pendingTransactionByAddress(address).do();
   * ```
   *
   * #### Example 2
   * ```typescript
   * const maxTxns = 5;
   * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
   * const pendingTxns = await algodClient
   *     .pendingTransactionByAddress(address)
   *     .max(maxTxns)
   *     .do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2accountsaddresstransactionspending)
   * @param address - The address of the sender.
   * @category GET
   */
  pendingTransactionByAddress(address: string) {
    return new PendingTransactionsByAddress(this.c, address);
  }

  /**
   * Retrieves the StatusResponse from the running node.
   *
   * #### Example
   * ```typescript
   * const status = await algodClient.status().do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2status)
   * @category GET
   */
  status() {
    return new Status(this.c, this.intDecoding);
  }

  /**
   * Waits for a specific round to occur then returns the `StatusResponse` for that round.
   *
   * #### Example
   * ```typescript
   * const round = 18038133;
   * const statusAfterBlock = await algodClient.statusAfterBlock(round).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2statuswait-for-block-afterround)
   * @param round - The number of the round to wait for.
   * @category GET
   */
  statusAfterBlock(round: number) {
    return new StatusAfterBlock(this.c, this.intDecoding, round);
  }

  /**
   * Returns the common needed parameters for a new transaction.
   *
   * #### Example
   * ```typescript
   * const suggestedParams = await algodClient.getTransactionParams().do();
   * const amountInMicroAlgos = algosdk.algosToMicroalgos(2); // 2 Algos
   * const unsignedTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
   *   from: senderAddress,
   *   to: receiverAddress,
   *   amount: amountInMicroAlgos,
   *   suggestedParams: suggestedParams,
   * });
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2transactionsparams)
   *
   * @remarks
   * Often used with
   * {@linkcode makePaymentTxnWithSuggestedParamsFromObject}, {@linkcode algosToMicroalgos}
   * @category GET
   */
  getTransactionParams() {
    return new SuggestedParams(this.c);
  }

  /**
   * Returns the supply details for the specified node's ledger.
   *
   * #### Example
   * ```typescript
   * const supplyDetails = await algodClient.supply().do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2ledgersupply)
   * @category GET
   */
  supply() {
    return new Supply(this.c, this.intDecoding);
  }

  /**
   * Compiles TEAL source code to binary, returns base64 encoded program bytes and base32 SHA512_256 hash of program bytes (Address style).
   *
   * #### Example
   * ```typescript
   * const source = "TEAL SOURCE CODE";
   * const compiledSmartContract = await algodClient.compile(source).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#post-v2tealcompile)
   * @remarks
   * This endpoint is only enabled when a node's configuration file sets `EnableDeveloperAPI` to true.
   * @param source
   * @category POST
   */
  compile(source: string | Uint8Array) {
    return new Compile(this.c, source);
  }

  /**
   * Provides debugging information for a transaction (or group).
   *
   * Executes TEAL program(s) in context and returns debugging information about the execution. This endpoint is only enabled when a node's configureation file sets `EnableDeveloperAPI` to true.
   *
   * #### Example
   * ```typescript
   * const dryRunResult = await algodClient.dryrun(dr).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#post-v2tealdryrun)
   * @param dr
   * @category POST
   */
  dryrun(dr: modelsv2.DryrunRequest) {
    return new Dryrun(this.c, dr);
  }

  /**
   * Given an asset ID, return asset information including creator, name, total supply and
   * special addresses.
   *
   * #### Example
   * ```typescript
   * const asset_id = 163650;
   * const asset = await algodClient.getAssetByID(asset_id).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2assetsasset-id)
   * @param index - The asset ID to look up.
   * @category GET
   */
  getAssetByID(index: number) {
    return new GetAssetByID(this.c, this.intDecoding, index);
  }

  /**
   * Given an application ID, return the application information including creator, approval
   * and clear programs, global and local schemas, and global state.
   *
   * #### Example
   * ```typescript
   * const index = 60553466;
   * const app = await algodClient.getApplicationByID(index).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2applicationsapplication-id)
   * @param index - The application ID to look up.
   * @category GET
   */
  getApplicationByID(index: number) {
    return new GetApplicationByID(this.c, this.intDecoding, index);
  }

  /**
   * Given an application ID and the box name (key), return the value stored in the box.
   *
   * #### Example
   * ```typescript
   * const index = 60553466;
   * const boxName = Buffer.from("foo");
   * const boxResponse = await algodClient.getApplicationBoxByName(index, boxName).do();
   * const boxValue = boxResponse.value;
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2applicationsapplication-idbox)
   * @param index - The application ID to look up.
   * @category GET
   */
  getApplicationBoxByName(index: number, boxName: Uint8Array) {
    return new GetApplicationBoxByName(
      this.c,
      this.intDecoding,
      index,
      boxName
    );
  }

  /**
   * Given an application ID, return all the box names associated with the app.
   *
   * #### Example
   * ```typescript
   * const index = 60553466;
   * const boxesResponse = await algodClient.getApplicationBoxes(index).max(3).do();
   * const boxNames = boxesResponse.boxes.map(box => box.name);
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2applicationsapplication-idboxes)
   * @param index - The application ID to look up.
   * @category GET
   */
  getApplicationBoxes(index: number) {
    return new GetApplicationBoxes(this.c, this.intDecoding, index);
  }

  /**
   * Returns the entire genesis file.
   *
   * #### Example
   * ```typescript
   * const genesis = await algodClient.genesis().do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-genesis)
   * @category GET
   */
  genesis() {
    return new Genesis(this.c, this.intDecoding);
  }

  /**
   * Returns a Merkle proof for a given transaction in a block.
   *
   * #### Example
   * ```typescript
   * const round = 18038133;
   * const txId = "MEUOC4RQJB23CQZRFRKYEI6WBO73VTTPST5A7B3S5OKBUY6LFUDA";
   * const proof = await algodClient.getTransactionProof(round, txId).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2/#get-v2blocksroundtransactionstxidproof)
   * @param round - The round in which the transaction appears.
   * @param txID - The transaction ID for which to generate a proof.
   * @category GET
   */
  getTransactionProof(round: number, txID: string) {
    return new GetTransactionProof(this.c, this.intDecoding, round, txID);
  }

  /**
   * Gets a proof for a given light block header inside a state proof commitment.
   *
   * #### Example
   * ```typescript
   * const round = 11111111;
   * const lightBlockHeaderProof = await algodClient.getLightBlockHeaderProof(round).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2#get-v2blocksroundlightheaderproof)
   * @param round
   */
  getLightBlockHeaderProof(round: number) {
    return new LightBlockHeaderProof(this.c, this.intDecoding, round);
  }

  /**
   * Gets a state proof that covers a given round.
   *
   * #### Example
   * ```typescript
   * const round = 11111111;
   * const stateProof = await algodClient.getStateProof(round).do();
   * ```
   *
   * [Response data schema details](https://developer.algorand.org/docs/rest-apis/algod/v2#get-v2stateproofsround)
   * @param round
   */
  getStateProof(round: number) {
    return new StateProof(this.c, this.intDecoding, round);
  }
}
