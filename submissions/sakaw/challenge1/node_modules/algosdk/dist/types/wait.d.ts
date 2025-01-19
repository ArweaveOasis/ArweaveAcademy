import Algodv2 from './client/v2/algod/algod';
/**
 * Wait until a transaction has been confirmed or rejected by the network, or
 * until 'waitRounds' number of rounds have passed.
 * @param client - An Algodv2 client
 * @param txid - The ID of the transaction to wait for.
 * @param waitRounds - The maximum number of rounds to wait for.
 * @returns A promise that, upon success, will resolve to the output of the
 *   `pendingTransactionInformation` call for the confirmed transaction.
 */
export declare function waitForConfirmation(client: Algodv2, txid: string, waitRounds: number): Promise<Record<string, any>>;
