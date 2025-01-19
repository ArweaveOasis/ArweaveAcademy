/// <reference types="node" />
import * as txnBuilder from './transaction';
import { EncodedLogicSig, EncodedLogicSigAccount, EncodedMultisig } from './types/transactions/encoded';
import { MultisigMetadata } from './types/multisig';
interface LogicSigStorageStructure {
    logic: Uint8Array;
    args: Uint8Array[];
    sig?: Uint8Array;
    msig?: EncodedMultisig;
}
/** sanityCheckProgram performs heuristic program validation:
 * check if passed in bytes are Algorand address or is B64 encoded, rather than Teal bytes
 *
 * @param program - Program bytes to check
 */
export declare function sanityCheckProgram(program: Uint8Array): void;
/**
 LogicSig implementation
 */
export declare class LogicSig implements LogicSigStorageStructure {
    tag: Buffer;
    logic: Uint8Array;
    args: Uint8Array[];
    sig?: Uint8Array;
    msig?: EncodedMultisig;
    constructor(program: Uint8Array, programArgs?: Array<Uint8Array | Buffer> | null);
    get_obj_for_encoding(): EncodedLogicSig;
    static from_obj_for_encoding(encoded: EncodedLogicSig): LogicSig;
    /**
     * Performs signature verification
     * @param publicKey - Verification key (derived from sender address or escrow address)
     */
    verify(publicKey: Uint8Array): boolean;
    /**
     * Compute hash of the logic sig program (that is the same as escrow account address) as string address
     * @returns String representation of the address
     */
    address(): string;
    /**
     * Creates signature (if no msig provided) or multi signature otherwise
     * @param secretKey - Secret key to sign with
     * @param msig - Multisig account as \{version, threshold, addrs\}
     */
    sign(secretKey: Uint8Array, msig?: MultisigMetadata): void;
    /**
     * Appends a signature to multi signature
     * @param secretKey - Secret key to sign with
     */
    appendToMultisig(secretKey: Uint8Array): void;
    signProgram(secretKey: Uint8Array): Uint8Array;
    singleSignMultisig(secretKey: Uint8Array, msig: EncodedMultisig): [sig: Uint8Array, index: number];
    toByte(): Uint8Array;
    static fromByte(encoded: ArrayLike<any>): LogicSig;
}
/**
 * Represents an account that can sign with a LogicSig program.
 */
export declare class LogicSigAccount {
    lsig: LogicSig;
    sigkey?: Uint8Array;
    /**
     * Create a new LogicSigAccount. By default this will create an escrow
     * LogicSig account. Call `sign` or `signMultisig` on the newly created
     * LogicSigAccount to make it a delegated account.
     *
     * @param program - The compiled TEAL program which contains the logic for
     *   this LogicSig.
     * @param args - An optional array of arguments for the program.
     */
    constructor(program: Uint8Array, args?: Array<Uint8Array | Buffer> | null);
    get_obj_for_encoding(): EncodedLogicSigAccount;
    static from_obj_for_encoding(encoded: EncodedLogicSigAccount): LogicSigAccount;
    /**
     * Encode this object into msgpack.
     */
    toByte(): Uint8Array;
    /**
     * Decode a msgpack object into a LogicSigAccount.
     * @param encoded - The encoded LogicSigAccount.
     */
    static fromByte(encoded: ArrayLike<any>): LogicSigAccount;
    /**
     * Check if this LogicSigAccount has been delegated to another account with a
     * signature.
     *
     * Note this function only checks for the presence of a delegation signature.
     * To verify the delegation signature, use `verify`.
     */
    isDelegated(): boolean;
    /**
     * Verifies this LogicSig's program and signatures.
     * @returns true if and only if the LogicSig program and signatures are valid.
     */
    verify(): boolean;
    /**
     * Get the address of this LogicSigAccount.
     *
     * If the LogicSig is delegated to another account, this will return the
     * address of that account.
     *
     * If the LogicSig is not delegated to another account, this will return an
     *  escrow address that is the hash of the LogicSig's program code.
     */
    address(): string;
    /**
     * Turns this LogicSigAccount into a delegated LogicSig. This type of LogicSig
     * has the authority to sign transactions on behalf of another account, called
     * the delegating account. Use this function if the delegating account is a
     * multisig account.
     *
     * @param msig - The multisig delegating account
     * @param secretKey - The secret key of one of the members of the delegating
     *   multisig account. Use `appendToMultisig` to add additional signatures
     *   from other members.
     */
    signMultisig(msig: MultisigMetadata, secretKey: Uint8Array): void;
    /**
     * Adds an additional signature from a member of the delegating multisig
     * account.
     *
     * @param secretKey - The secret key of one of the members of the delegating
     *   multisig account.
     */
    appendToMultisig(secretKey: Uint8Array): void;
    /**
     * Turns this LogicSigAccount into a delegated LogicSig. This type of LogicSig
     * has the authority to sign transactions on behalf of another account, called
     * the delegating account. If the delegating account is a multisig account,
     * use `signMultisig` instead.
     *
     * @param secretKey - The secret key of the delegating account.
     */
    sign(secretKey: Uint8Array): void;
}
/**
 * makeLogicSig creates LogicSig object from program and arguments
 *
 * @deprecated Use new LogicSigAccount(...) instead
 *
 * @param program - Program to make LogicSig from
 * @param args - Arguments as array of Uint8Array
 * @returns LogicSig object
 */
export declare function makeLogicSig(program: Uint8Array, args?: Uint8Array[]): LogicSig;
/**
 * signLogicSigTransactionObject takes a transaction and a LogicSig object and
 * returns a signed transaction.
 *
 * @param txn - The transaction to sign.
 * @param lsigObject - The LogicSig object that will sign the transaction.
 *
 * @returns Object containing txID and blob representing signed transaction.
 */
export declare function signLogicSigTransactionObject(txn: txnBuilder.Transaction, lsigObject: LogicSig | LogicSigAccount): {
    txID: string;
    blob: Uint8Array;
};
/**
 * signLogicSigTransaction takes a transaction and a LogicSig object and returns
 * a signed transaction.
 *
 * @param txn - The transaction to sign.
 * @param lsigObject - The LogicSig object that will sign the transaction.
 *
 * @returns Object containing txID and blob representing signed transaction.
 * @throws error on failure
 */
export declare function signLogicSigTransaction(txn: txnBuilder.TransactionLike, lsigObject: LogicSig | LogicSigAccount): {
    txID: string;
    blob: Uint8Array;
};
/**
 * logicSigFromByte accepts encoded logic sig bytes and attempts to call logicsig.fromByte on it,
 * returning the result
 */
export declare function logicSigFromByte(encoded: Uint8Array): LogicSig;
/**
 * tealSign creates a signature compatible with ed25519verify opcode from program hash
 * @param sk - uint8array with secret key
 * @param data - buffer with data to sign
 * @param programHash - string representation of teal program hash (= contract address for LogicSigs)
 */
export declare function tealSign(sk: Uint8Array, data: Uint8Array | Buffer, programHash: string): Uint8Array;
/**
 * tealSignFromProgram creates a signature compatible with ed25519verify opcode from raw program bytes
 * @param sk - uint8array with secret key
 * @param data - buffer with data to sign
 * @param program - buffer with teal program
 */
export declare function tealSignFromProgram(sk: Uint8Array, data: Uint8Array | Buffer, program: Uint8Array): Uint8Array;
export {};
