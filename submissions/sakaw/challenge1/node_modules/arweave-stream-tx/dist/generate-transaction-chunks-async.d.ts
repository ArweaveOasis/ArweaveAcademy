/// <reference types="node" />
import Transaction from 'arweave/node/lib/transaction';
/**
 * Generates the Arweave transaction chunk information from the piped data stream.
 */
export declare function generateTransactionChunksAsync(): (source: AsyncIterable<Buffer>) => Promise<NonNullable<Transaction['chunks']>>;
