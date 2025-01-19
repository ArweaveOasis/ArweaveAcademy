/// <reference types="node" />
import Arweave from 'arweave';
import Transaction from 'arweave/node/lib/transaction';
/**
 * Uploads the piped data to the specified transaction.
 *
 * @param createTx whether or not the passed transaction should be created on the network.
 * This can be false if we want to reseed an existing transaction,
 */
export declare function uploadTransactionAsync(tx: Transaction, arweave: Arweave, createTx?: boolean): (source: AsyncIterable<Buffer>) => Promise<void>;
