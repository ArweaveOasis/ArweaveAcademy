import * as txnBuilder from './transaction';
import { EncodedTransaction } from './types/transactions';
import { MultisigMetadata } from './types/multisig';
import { EncodedMultisig } from './types/transactions/encoded';
/**
 Utilities for manipulating multisig transaction blobs.
 */
export declare const MULTISIG_MERGE_LESSTHANTWO_ERROR_MSG = "Not enough multisig transactions to merge. Need at least two";
export declare const MULTISIG_MERGE_MISMATCH_ERROR_MSG = "Cannot merge txs. txIDs differ";
export declare const MULTISIG_MERGE_MISMATCH_AUTH_ADDR_MSG = "Cannot merge txs. Auth addrs differ";
export declare const MULTISIG_MERGE_WRONG_PREIMAGE_ERROR_MSG = "Cannot merge txs. Multisig preimages differ";
export declare const MULTISIG_MERGE_SIG_MISMATCH_ERROR_MSG = "Cannot merge txs. subsigs are mismatched.";
export declare const MULTISIG_NO_MUTATE_ERROR_MSG = "Cannot mutate a multisig field as it would invalidate all existing signatures.";
export declare const MULTISIG_USE_PARTIAL_SIGN_ERROR_MSG = "Cannot sign a multisig transaction using `signTxn`. Use `partialSignTxn` instead.";
export declare const MULTISIG_SIGNATURE_LENGTH_ERROR_MSG = "Cannot add multisig signature. Signature is not of the correct length.";
interface MultisigMetadataWithPks extends Omit<MultisigMetadata, 'addrs'> {
    pks: Uint8Array[];
}
/**
 * createMultisigTransaction creates a raw, unsigned multisig transaction blob.
 * @param txn - the actual transaction.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param pks - ordered list of public keys in this multisig
 * @returns encoded multisig blob
 */
export declare function createMultisigTransaction(txn: txnBuilder.Transaction, { version, threshold, addrs }: MultisigMetadata): Uint8Array;
/**
 * MultisigTransaction is a Transaction that also supports creating partially-signed multisig transactions.
 */
export declare class MultisigTransaction extends txnBuilder.Transaction {
    /**
     * Override inherited method to throw an error, as mutating transactions are prohibited in this context
     */
    addLease(): void;
    /**
     * Override inherited method to throw an error, as mutating transactions are prohibited in this context
     */
    addRekey(): void;
    /**
     * Override inherited method to throw an error, as traditional signing is not allowed
     */
    signTxn(sk: Uint8Array): Uint8Array;
    /**
     * partialSignTxn partially signs this transaction and returns a partially-signed multisig transaction,
     * encoded with msgpack as a typed array.
     * @param version - multisig version
     * @param threshold - multisig threshold
     * @param pks - multisig public key list, order is important.
     * @param sk - an Algorand secret key to sign with.
     * @returns an encoded, partially signed multisig transaction.
     */
    partialSignTxn({ version, threshold, pks }: MultisigMetadataWithPks, sk: Uint8Array): Uint8Array;
    /**
     * partialSignWithMultisigSignature partially signs this transaction with an external raw multisig signature and returns
     * a partially-signed multisig transaction, encoded with msgpack as a typed array.
     * @param metadata - multisig metadata
     * @param signerAddr - address of the signer
     * @param signature - raw multisig signature
     * @returns an encoded, partially signed multisig transaction.
     */
    partialSignWithMultisigSignature(metadata: MultisigMetadataWithPks, signerAddr: string, signature: Uint8Array): Uint8Array;
    static from_obj_for_encoding(txnForEnc: EncodedTransaction): MultisigTransaction;
}
/**
 * mergeMultisigTransactions takes a list of multisig transaction blobs, and merges them.
 * @param multisigTxnBlobs - a list of blobs representing encoded multisig txns
 * @returns typed array msg-pack encoded multisig txn
 */
export declare function mergeMultisigTransactions(multisigTxnBlobs: Uint8Array[]): Uint8Array;
export declare function verifyMultisig(toBeVerified: Uint8Array, msig: EncodedMultisig, publicKey: Uint8Array): boolean;
/**
 * signMultisigTransaction takes a raw transaction (see signTransaction), a multisig preimage, a secret key, and returns
 * a multisig transaction, which is a blob representing a transaction and multisignature account preimage. The returned
 * multisig txn can accumulate additional signatures through mergeMultisigTransactions or appendSignMultisigTransaction.
 * @param txn - object with either payment or key registration fields
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - a list of Algorand addresses representing possible signers for this multisig. Order is important.
 * @param sk - Algorand secret key. The corresponding pk should be in the pre image.
 * @returns object containing txID, and blob of partially signed multisig transaction (with multisig preimage information)
 * If the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 */
export declare function signMultisigTransaction(txn: txnBuilder.TransactionLike, { version, threshold, addrs }: MultisigMetadata, sk: Uint8Array): {
    txID: string;
    blob: Uint8Array;
};
/**
 * appendSignMultisigTransaction takes a multisig transaction blob, and appends our signature to it.
 * While we could derive public key preimagery from the partially-signed multisig transaction,
 * we ask the caller to pass it back in, to ensure they know what they are signing.
 * @param multisigTxnBlob - an encoded multisig txn. Supports non-payment txn types.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - a list of Algorand addresses representing possible signers for this multisig. Order is important.
 * @param sk - Algorand secret key
 * @returns object containing txID, and blob representing encoded multisig txn
 */
export declare function appendSignMultisigTransaction(multisigTxnBlob: Uint8Array, { version, threshold, addrs }: MultisigMetadata, sk: Uint8Array): {
    txID: string;
    blob: Uint8Array;
};
/**
 * appendMultisigTransactionSignature takes a multisig transaction blob, and appends a given raw signature to it.
 * This makes it possible to compile a multisig signature using only raw signatures from external methods.
 * @param multisigTxnBlob - an encoded multisig txn. Supports non-payment txn types.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - a list of Algorand addresses representing possible signers for this multisig. Order is important.
 * @param signerAddr - address of the signer
 * @param signature - raw multisig signature
 * @returns object containing txID, and blob representing encoded multisig txn
 */
export declare function appendSignRawMultisigSignature(multisigTxnBlob: Uint8Array, { version, threshold, addrs }: MultisigMetadata, signerAddr: string, signature: Uint8Array): {
    txID: string;
    blob: Uint8Array;
};
/**
 * multisigAddress takes multisig metadata (preimage) and returns the corresponding human readable Algorand address.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - list of Algorand addresses
 */
export declare function multisigAddress({ version, threshold, addrs, }: MultisigMetadata): string;
export {};
