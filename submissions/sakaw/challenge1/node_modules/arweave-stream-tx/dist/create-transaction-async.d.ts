/// <reference types="node" />
import Arweave from 'arweave';
import { CreateTransactionInterface } from 'arweave/node/common';
import Transaction from 'arweave/node/lib/transaction';
import { JWKInterface } from 'arweave/node/lib/wallet';
/**
 * Creates an Arweave transaction from the piped data stream.
 */
export declare function createTransactionAsync(attributes: Partial<Omit<CreateTransactionInterface, 'data'>>, arweave: Arweave, jwk: JWKInterface | null | undefined): (source: AsyncIterable<Buffer>) => Promise<Transaction>;
