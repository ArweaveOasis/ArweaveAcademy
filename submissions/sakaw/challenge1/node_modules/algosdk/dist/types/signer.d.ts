import { Transaction } from './transaction';
import Account from './types/account';
import { LogicSigAccount } from './logicsig';
import { MultisigMetadata } from './types/multisig';
/**
 * This type represents a function which can sign transactions from an atomic transaction group.
 * @param txnGroup - The atomic group containing transactions to be signed
 * @param indexesToSign - An array of indexes in the atomic transaction group that should be signed
 * @returns A promise which resolves an array of encoded signed transactions. The length of the
 *   array will be the same as the length of indexesToSign, and each index i in the array
 *   corresponds to the signed transaction from txnGroup[indexesToSign[i]]
 */
export declare type TransactionSigner = (txnGroup: Transaction[], indexesToSign: number[]) => Promise<Uint8Array[]>;
/**
 * Create a TransactionSigner that can sign transactions for the provided basic Account.
 */
export declare function makeBasicAccountTransactionSigner(account: Account): TransactionSigner;
/**
 * Create a TransactionSigner that can sign transactions for the provided LogicSigAccount.
 */
export declare function makeLogicSigAccountTransactionSigner(account: LogicSigAccount): TransactionSigner;
/**
 * Create a TransactionSigner that can sign transactions for the provided Multisig account.
 * @param msig - The Multisig account metadata
 * @param sks - An array of private keys belonging to the msig which should sign the transactions.
 */
export declare function makeMultiSigAccountTransactionSigner(msig: MultisigMetadata, sks: Uint8Array[]): TransactionSigner;
/** Represents an unsigned transactions and a signer that can authorize that transaction. */
export interface TransactionWithSigner {
    /** An unsigned transaction */
    txn: Transaction;
    /** A transaction signer that can authorize txn */
    signer: TransactionSigner;
}
/**
 * Check if a value conforms to the TransactionWithSigner structure.
 * @param value - The value to check.
 * @returns True if an only if the value has the structure of a TransactionWithSigner.
 */
export declare function isTransactionWithSigner(value: any): value is TransactionWithSigner;
