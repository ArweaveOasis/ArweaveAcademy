/// <reference types="node" />
import { OnApplicationComplete, TransactionParams, TransactionType, BoxReference } from './types/transactions/base';
import AnyTransaction, { EncodedTransaction, EncodedMultisig, EncodedLogicSig } from './types/transactions';
import { Address } from './types/address';
export declare const ALGORAND_MIN_TX_FEE = 1000;
/**
 * A modified version of the transaction params. Represents the internal structure that the Transaction class uses
 * to store inputted transaction objects.
 */
interface TransactionStorageStructure extends Omit<TransactionParams, 'from' | 'to' | 'genesisHash' | 'closeRemainderTo' | 'voteKey' | 'selectionKey' | 'stateProofKey' | 'assetManager' | 'assetReserve' | 'assetFreeze' | 'assetClawback' | 'assetRevocationTarget' | 'freezeAccount' | 'appAccounts' | 'suggestedParams' | 'reKeyTo'> {
    from: string | Address;
    to: string | Address;
    fee: number;
    amount: number | bigint;
    firstRound: number;
    lastRound: number;
    note?: Uint8Array;
    genesisID: string;
    genesisHash: string | Buffer;
    lease?: Uint8Array;
    closeRemainderTo?: string | Address;
    voteKey: string | Buffer;
    selectionKey: string | Buffer;
    stateProofKey: string | Buffer;
    voteFirst: number;
    voteLast: number;
    voteKeyDilution: number;
    assetIndex: number;
    assetTotal: number | bigint;
    assetDecimals: number;
    assetDefaultFrozen: boolean;
    assetManager: string | Address;
    assetReserve: string | Address;
    assetFreeze: string | Address;
    assetClawback: string | Address;
    assetUnitName: string;
    assetName: string;
    assetURL: string;
    assetMetadataHash?: string | Uint8Array;
    freezeAccount: string | Address;
    freezeState: boolean;
    assetRevocationTarget?: string | Address;
    appIndex: number;
    appOnComplete: OnApplicationComplete;
    appLocalInts: number;
    appLocalByteSlices: number;
    appGlobalInts: number;
    appGlobalByteSlices: number;
    appApprovalProgram: Uint8Array;
    appClearProgram: Uint8Array;
    appArgs?: Uint8Array[];
    appAccounts?: string[] | Address[];
    appForeignApps?: number[];
    appForeignAssets?: number[];
    type?: TransactionType;
    flatFee: boolean;
    reKeyTo?: string | Address;
    nonParticipation?: boolean;
    group?: Buffer;
    extraPages?: number;
    boxes?: BoxReference[];
    stateProofType?: number | bigint;
    stateProof?: Uint8Array;
    stateProofMessage?: Uint8Array;
}
/**
 * Transaction enables construction of Algorand transactions
 * */
export declare class Transaction implements TransactionStorageStructure {
    name: string;
    tag: Buffer;
    from: Address;
    to: Address;
    fee: number;
    amount: number | bigint;
    firstRound: number;
    lastRound: number;
    note?: Uint8Array;
    genesisID: string;
    genesisHash: Buffer;
    lease?: Uint8Array;
    closeRemainderTo?: Address;
    voteKey: Buffer;
    selectionKey: Buffer;
    stateProofKey: Buffer;
    voteFirst: number;
    voteLast: number;
    voteKeyDilution: number;
    assetIndex: number;
    assetTotal: number | bigint;
    assetDecimals: number;
    assetDefaultFrozen: boolean;
    assetManager: Address;
    assetReserve: Address;
    assetFreeze: Address;
    assetClawback: Address;
    assetUnitName: string;
    assetName: string;
    assetURL: string;
    assetMetadataHash?: Uint8Array;
    freezeAccount: Address;
    freezeState: boolean;
    assetRevocationTarget?: Address;
    appIndex: number;
    appOnComplete: OnApplicationComplete;
    appLocalInts: number;
    appLocalByteSlices: number;
    appGlobalInts: number;
    appGlobalByteSlices: number;
    appApprovalProgram: Uint8Array;
    appClearProgram: Uint8Array;
    appArgs?: Uint8Array[];
    appAccounts?: Address[];
    appForeignApps?: number[];
    appForeignAssets?: number[];
    boxes?: BoxReference[];
    type?: TransactionType;
    flatFee: boolean;
    reKeyTo?: Address;
    nonParticipation?: boolean;
    group?: Buffer;
    extraPages?: number;
    stateProofType?: number | bigint;
    stateProof?: Uint8Array;
    stateProofMessage?: Uint8Array;
    constructor({ ...transaction }: AnyTransaction);
    get_obj_for_encoding(): EncodedTransaction;
    static from_obj_for_encoding(txnForEnc: EncodedTransaction): Transaction;
    estimateSize(): number;
    bytesToSign(): Buffer;
    toByte(): Uint8Array;
    rawSignTxn(sk: Uint8Array): Buffer;
    signTxn(sk: Uint8Array): Uint8Array;
    attachSignature(signerAddr: string, signature: Uint8Array): Uint8Array;
    rawTxID(): Buffer;
    txID(): string;
    addLease(lease: Uint8Array, feePerByte?: number): void;
    addRekey(reKeyTo: string, feePerByte?: number): void;
    _getDictForDisplay(): TransactionStorageStructure & Record<string, any>;
    prettyPrint(): void;
    toString(): string;
}
/**
 * encodeUnsignedTransaction takes a completed txnBuilder.Transaction object, such as from the makeFoo
 * family of transactions, and converts it to a Buffer
 * @param transactionObject - the completed Transaction object
 */
export declare function encodeUnsignedTransaction(transactionObject: Transaction): Uint8Array;
/**
 * decodeUnsignedTransaction takes a Buffer (as if from encodeUnsignedTransaction) and converts it to a txnBuilder.Transaction object
 * @param transactionBuffer - the Uint8Array containing a transaction
 */
export declare function decodeUnsignedTransaction(transactionBuffer: ArrayLike<number>): Transaction;
/**
 * Object representing a transaction with a signature
 */
export interface SignedTransaction {
    /**
     * Transaction signature
     */
    sig?: Buffer;
    /**
     * The transaction that was signed
     */
    txn: Transaction;
    /**
     * Multisig structure
     */
    msig?: EncodedMultisig;
    /**
     * Logic signature
     */
    lsig?: EncodedLogicSig;
    /**
     * The signer, if signing with a different key than the Transaction type `from` property indicates
     */
    sgnr?: Buffer;
}
/**
 * decodeSignedTransaction takes a Buffer (from transaction.signTxn) and converts it to an object
 * containing the Transaction (txn), the signature (sig), and the auth-addr field if applicable (sgnr)
 * @param transactionBuffer - the Uint8Array containing a transaction
 * @returns containing a Transaction, the signature, and possibly an auth-addr field
 */
export declare function decodeSignedTransaction(transactionBuffer: Uint8Array): SignedTransaction;
/**
 * Either a valid transaction object or an instance of the Transaction class
 */
export declare type TransactionLike = AnyTransaction | Transaction;
export declare function instantiateTxnIfNeeded(transactionLike: TransactionLike): Transaction;
export default Transaction;
