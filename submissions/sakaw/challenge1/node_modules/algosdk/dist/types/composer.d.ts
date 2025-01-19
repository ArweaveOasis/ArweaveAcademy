import { ABIValue, ABIMethod } from './abi';
import Algodv2 from './client/v2/algod/algod';
import { TransactionSigner, TransactionWithSigner } from './signer';
import { BoxReference, OnApplicationComplete, SuggestedParams } from './types/transactions/base';
export declare type ABIArgument = ABIValue | TransactionWithSigner;
/** Represents the output from a successful ABI method call. */
export interface ABIResult {
    /** The TxID of the transaction that invoked the ABI method call. */
    txID: string;
    /**
     * The raw bytes of the return value from the ABI method call. This will be empty if the method
     * does not return a value (return type "void").
     */
    rawReturnValue: Uint8Array;
    /**
     * The method that was called for this result
     */
    method: ABIMethod;
    /**
     * The return value from the ABI method call. This will be undefined if the method does not return
     * a value (return type "void"), or if the SDK was unable to decode the returned value.
     */
    returnValue?: ABIValue;
    /** If the SDK was unable to decode a return value, the error will be here. */
    decodeError?: Error;
    /** The pending transaction information from the method transaction */
    txInfo?: Record<string, any>;
}
export declare enum AtomicTransactionComposerStatus {
    /** The atomic group is still under construction. */
    BUILDING = 0,
    /** The atomic group has been finalized, but not yet signed. */
    BUILT = 1,
    /** The atomic group has been finalized and signed, but not yet submitted to the network. */
    SIGNED = 2,
    /** The atomic group has been finalized, signed, and submitted to the network. */
    SUBMITTED = 3,
    /** The atomic group has been finalized, signed, submitted, and successfully committed to a block. */
    COMMITTED = 4
}
/** A class used to construct and execute atomic transaction groups */
export declare class AtomicTransactionComposer {
    /** The maximum size of an atomic transaction group. */
    static MAX_GROUP_SIZE: number;
    private status;
    private transactions;
    private methodCalls;
    private signedTxns;
    private txIDs;
    /**
     * Get the status of this composer's transaction group.
     */
    getStatus(): AtomicTransactionComposerStatus;
    /**
     * Get the number of transactions currently in this atomic group.
     */
    count(): number;
    /**
     * Create a new composer with the same underlying transactions. The new composer's status will be
     * BUILDING, so additional transactions may be added to it.
     */
    clone(): AtomicTransactionComposer;
    /**
     * Add a transaction to this atomic group.
     *
     * An error will be thrown if the transaction has a nonzero group ID, the composer's status is
     * not BUILDING, or if adding this transaction causes the current group to exceed MAX_GROUP_SIZE.
     */
    addTransaction(txnAndSigner: TransactionWithSigner): void;
    /**
     * Add a smart contract method call to this atomic group.
     *
     * An error will be thrown if the composer's status is not BUILDING, if adding this transaction
     * causes the current group to exceed MAX_GROUP_SIZE, or if the provided arguments are invalid
     * for the given method.
     */
    addMethodCall({ appID, method, methodArgs, sender, suggestedParams, onComplete, approvalProgram, clearProgram, numGlobalInts, numGlobalByteSlices, numLocalInts, numLocalByteSlices, extraPages, boxes, note, lease, rekeyTo, signer, }: {
        /** The ID of the smart contract to call. Set this to 0 to indicate an application creation call. */
        appID: number;
        /** The method to call on the smart contract */
        method: ABIMethod;
        /** The arguments to include in the method call. If omitted, no arguments will be passed to the method. */
        methodArgs?: ABIArgument[];
        /** The address of the sender of this application call */
        sender: string;
        /** Transactions params to use for this application call */
        suggestedParams: SuggestedParams;
        /** The OnComplete action to take for this application call. If omitted, OnApplicationComplete.NoOpOC will be used. */
        onComplete?: OnApplicationComplete;
        /** The approval program for this application call. Only set this if this is an application creation call, or if onComplete is OnApplicationComplete.UpdateApplicationOC */
        approvalProgram?: Uint8Array;
        /** The clear program for this application call. Only set this if this is an application creation call, or if onComplete is OnApplicationComplete.UpdateApplicationOC */
        clearProgram?: Uint8Array;
        /** The global integer schema size. Only set this if this is an application creation call. */
        numGlobalInts?: number;
        /** The global byte slice schema size. Only set this if this is an application creation call. */
        numGlobalByteSlices?: number;
        /** The local integer schema size. Only set this if this is an application creation call. */
        numLocalInts?: number;
        /** The local byte slice schema size. Only set this if this is an application creation call. */
        numLocalByteSlices?: number;
        /** The number of extra pages to allocate for the application's programs. Only set this if this is an application creation call. If omitted, defaults to 0. */
        extraPages?: number;
        /** The box references for this application call */
        boxes?: BoxReference[];
        /** The note value for this application call */
        note?: Uint8Array;
        /** The lease value for this application call */
        lease?: Uint8Array;
        /** If provided, the address that the sender will be rekeyed to at the conclusion of this application call */
        rekeyTo?: string;
        /** A transaction signer that can authorize this application call from sender */
        signer: TransactionSigner;
    }): void;
    /**
     * Finalize the transaction group and returned the finalized transactions.
     *
     * The composer's status will be at least BUILT after executing this method.
     */
    buildGroup(): TransactionWithSigner[];
    /**
     * Obtain signatures for each transaction in this group. If signatures have already been obtained,
     * this method will return cached versions of the signatures.
     *
     * The composer's status will be at least SIGNED after executing this method.
     *
     * An error will be thrown if signing any of the transactions fails.
     *
     * @returns A promise that resolves to an array of signed transactions.
     */
    gatherSignatures(): Promise<Uint8Array[]>;
    /**
     * Send the transaction group to the network, but don't wait for it to be committed to a block. An
     * error will be thrown if submission fails.
     *
     * The composer's status must be SUBMITTED or lower before calling this method. If submission is
     * successful, this composer's status will update to SUBMITTED.
     *
     * Note: a group can only be submitted again if it fails.
     *
     * @param client - An Algodv2 client
     *
     * @returns A promise that, upon success, resolves to a list of TxIDs of the submitted transactions.
     */
    submit(client: Algodv2): Promise<string[]>;
    /**
     * Send the transaction group to the network and wait until it's committed to a block. An error
     * will be thrown if submission or execution fails.
     *
     * The composer's status must be SUBMITTED or lower before calling this method, since execution is
     * only allowed once. If submission is successful, this composer's status will update to SUBMITTED.
     * If the execution is also successful, this composer's status will update to COMMITTED.
     *
     * Note: a group can only be submitted again if it fails.
     *
     * @param client - An Algodv2 client
     * @param waitRounds - The maximum number of rounds to wait for transaction confirmation
     *
     * @returns A promise that, upon success, resolves to an object containing the confirmed round for
     *   this transaction, the txIDs of the submitted transactions, and an array of results containing
     *   one element for each method call transaction in this group.
     */
    execute(client: Algodv2, waitRounds: number): Promise<{
        confirmedRound: number;
        txIDs: string[];
        methodResults: ABIResult[];
    }>;
}
