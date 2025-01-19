import {
  ABIType,
  ABITupleType,
  ABIUintType,
  ABIAddressType,
  ABIValue,
  ABIMethod,
  ABIReferenceType,
  abiTypeIsTransaction,
  abiCheckTransactionType,
  abiTypeIsReference,
} from './abi';
import { Transaction, decodeSignedTransaction } from './transaction';
import { makeApplicationCallTxnFromObject } from './makeTxn';
import { assignGroupID } from './group';
import { waitForConfirmation } from './wait';
import Algodv2 from './client/v2/algod/algod';
import {
  TransactionSigner,
  TransactionWithSigner,
  isTransactionWithSigner,
} from './signer';
import {
  BoxReference,
  OnApplicationComplete,
  SuggestedParams,
} from './types/transactions/base';

// First 4 bytes of SHA-512/256 hash of "return"
const RETURN_PREFIX = Buffer.from([21, 31, 124, 117]);

// The maximum number of arguments for an application call transaction
const MAX_APP_ARGS = 16;

export type ABIArgument = ABIValue | TransactionWithSigner;

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

export enum AtomicTransactionComposerStatus {
  /** The atomic group is still under construction. */
  BUILDING,

  /** The atomic group has been finalized, but not yet signed. */
  BUILT,

  /** The atomic group has been finalized and signed, but not yet submitted to the network. */
  SIGNED,

  /** The atomic group has been finalized, signed, and submitted to the network. */
  SUBMITTED,

  /** The atomic group has been finalized, signed, submitted, and successfully committed to a block. */
  COMMITTED,
}

/**
 * Add a value to an application call's foreign array. The addition will be as compact as possible,
 * and this function will return an index that can be used to reference `valueToAdd` in `array`.
 *
 * @param valueToAdd - The value to add to the array. If this value is already present in the array,
 *   it will not be added again. Instead, the existing index will be returned.
 * @param array - The existing foreign array. This input may be modified to append `valueToAdd`.
 * @param zeroValue - If provided, this value indicated two things: the 0 value is special for this
 *   array, so all indexes into `array` must start at 1; additionally, if `valueToAdd` equals
 *   `zeroValue`, then `valueToAdd` will not be added to the array, and instead the 0 indexes will
 *   be returned.
 * @returns An index that can be used to reference `valueToAdd` in `array`.
 */
function populateForeignArray<Type>(
  valueToAdd: Type,
  array: Type[],
  zeroValue?: Type
): number {
  if (zeroValue != null && valueToAdd === zeroValue) {
    return 0;
  }

  const offset = zeroValue == null ? 0 : 1;

  for (let i = 0; i < array.length; i++) {
    if (valueToAdd === array[i]) {
      return i + offset;
    }
  }

  array.push(valueToAdd);
  return array.length - 1 + offset;
}

/** A class used to construct and execute atomic transaction groups */
export class AtomicTransactionComposer {
  /** The maximum size of an atomic transaction group. */
  static MAX_GROUP_SIZE: number = 16;

  private status = AtomicTransactionComposerStatus.BUILDING;
  private transactions: TransactionWithSigner[] = [];
  private methodCalls: Map<number, ABIMethod> = new Map();
  private signedTxns: Uint8Array[] = [];
  private txIDs: string[] = [];

  /**
   * Get the status of this composer's transaction group.
   */
  getStatus(): AtomicTransactionComposerStatus {
    return this.status;
  }

  /**
   * Get the number of transactions currently in this atomic group.
   */
  count(): number {
    return this.transactions.length;
  }

  /**
   * Create a new composer with the same underlying transactions. The new composer's status will be
   * BUILDING, so additional transactions may be added to it.
   */
  clone(): AtomicTransactionComposer {
    const theClone = new AtomicTransactionComposer();

    theClone.transactions = this.transactions.map(({ txn, signer }) => ({
      // not quite a deep copy, but good enough for our purposes (modifying txn.group in buildGroup)
      txn: Transaction.from_obj_for_encoding({
        ...txn.get_obj_for_encoding(),
        // erase the group ID
        grp: undefined,
      }),
      signer,
    }));
    theClone.methodCalls = new Map(this.methodCalls);

    return theClone;
  }

  /**
   * Add a transaction to this atomic group.
   *
   * An error will be thrown if the transaction has a nonzero group ID, the composer's status is
   * not BUILDING, or if adding this transaction causes the current group to exceed MAX_GROUP_SIZE.
   */
  addTransaction(txnAndSigner: TransactionWithSigner): void {
    if (this.status !== AtomicTransactionComposerStatus.BUILDING) {
      throw new Error(
        'Cannot add transactions when composer status is not BUILDING'
      );
    }

    if (this.transactions.length === AtomicTransactionComposer.MAX_GROUP_SIZE) {
      throw new Error(
        `Adding an additional transaction exceeds the maximum atomic group size of ${AtomicTransactionComposer.MAX_GROUP_SIZE}`
      );
    }

    if (txnAndSigner.txn.group && txnAndSigner.txn.group.some((v) => v !== 0)) {
      throw new Error('Cannot add a transaction with nonzero group ID');
    }

    this.transactions.push(txnAndSigner);
  }

  /**
   * Add a smart contract method call to this atomic group.
   *
   * An error will be thrown if the composer's status is not BUILDING, if adding this transaction
   * causes the current group to exceed MAX_GROUP_SIZE, or if the provided arguments are invalid
   * for the given method.
   */
  addMethodCall({
    appID,
    method,
    methodArgs,
    sender,
    suggestedParams,
    onComplete,
    approvalProgram,
    clearProgram,
    numGlobalInts,
    numGlobalByteSlices,
    numLocalInts,
    numLocalByteSlices,
    extraPages,
    boxes,
    note,
    lease,
    rekeyTo,
    signer,
  }: {
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
  }): void {
    if (this.status !== AtomicTransactionComposerStatus.BUILDING) {
      throw new Error(
        'Cannot add transactions when composer status is not BUILDING'
      );
    }

    if (
      this.transactions.length + method.txnCount() >
      AtomicTransactionComposer.MAX_GROUP_SIZE
    ) {
      throw new Error(
        `Adding additional transactions exceeds the maximum atomic group size of ${AtomicTransactionComposer.MAX_GROUP_SIZE}`
      );
    }

    if (appID === 0) {
      if (
        approvalProgram == null ||
        clearProgram == null ||
        numGlobalInts == null ||
        numGlobalByteSlices == null ||
        numLocalInts == null ||
        numLocalByteSlices == null
      ) {
        throw new Error(
          'One of the following required parameters for application creation is missing: approvalProgram, clearProgram, numGlobalInts, numGlobalByteSlices, numLocalInts, numLocalByteSlices'
        );
      }
    } else if (onComplete === OnApplicationComplete.UpdateApplicationOC) {
      if (approvalProgram == null || clearProgram == null) {
        throw new Error(
          'One of the following required parameters for OnApplicationComplete.UpdateApplicationOC is missing: approvalProgram, clearProgram'
        );
      }
      if (
        numGlobalInts != null ||
        numGlobalByteSlices != null ||
        numLocalInts != null ||
        numLocalByteSlices != null ||
        extraPages != null
      ) {
        throw new Error(
          'One of the following application creation parameters were set on a non-creation call: numGlobalInts, numGlobalByteSlices, numLocalInts, numLocalByteSlices, extraPages'
        );
      }
    } else if (
      approvalProgram != null ||
      clearProgram != null ||
      numGlobalInts != null ||
      numGlobalByteSlices != null ||
      numLocalInts != null ||
      numLocalByteSlices != null ||
      extraPages != null
    ) {
      throw new Error(
        'One of the following application creation parameters were set on a non-creation call: approvalProgram, clearProgram, numGlobalInts, numGlobalByteSlices, numLocalInts, numLocalByteSlices, extraPages'
      );
    }

    if (methodArgs == null) {
      // eslint-disable-next-line no-param-reassign
      methodArgs = [];
    }

    if (methodArgs.length !== method.args.length) {
      throw new Error(
        `Incorrect number of method arguments. Expected ${method.args.length}, got ${methodArgs.length}`
      );
    }

    let basicArgTypes: ABIType[] = [];
    let basicArgValues: ABIValue[] = [];
    const txnArgs: TransactionWithSigner[] = [];
    const refArgTypes: ABIReferenceType[] = [];
    const refArgValues: ABIValue[] = [];
    const refArgIndexToBasicArgIndex: Map<number, number> = new Map();
    // TODO: Box encoding for ABI
    const boxReferences: BoxReference[] = !boxes ? [] : boxes;

    for (let i = 0; i < methodArgs.length; i++) {
      let argType = method.args[i].type;
      const argValue = methodArgs[i];

      if (abiTypeIsTransaction(argType)) {
        if (
          !isTransactionWithSigner(argValue) ||
          !abiCheckTransactionType(argType, argValue.txn)
        ) {
          throw new Error(
            `Expected ${argType} transaction for argument at index ${i}`
          );
        }
        if (argValue.txn.group && argValue.txn.group.some((v) => v !== 0)) {
          throw new Error('Cannot add a transaction with nonzero group ID');
        }
        txnArgs.push(argValue);
        continue;
      }

      if (isTransactionWithSigner(argValue)) {
        throw new Error(
          `Expected non-transaction value for argument at index ${i}`
        );
      }

      if (abiTypeIsReference(argType)) {
        refArgIndexToBasicArgIndex.set(
          refArgTypes.length,
          basicArgTypes.length
        );
        refArgTypes.push(argType);
        refArgValues.push(argValue);
        // treat the reference as a uint8 for encoding purposes
        argType = new ABIUintType(8);
      }

      if (typeof argType === 'string') {
        throw new Error(`Unknown ABI type: ${argType}`);
      }

      basicArgTypes.push(argType);
      basicArgValues.push(argValue);
    }

    const resolvedRefIndexes: number[] = [];
    const foreignAccounts: string[] = [];
    const foreignApps: number[] = [];
    const foreignAssets: number[] = [];
    for (let i = 0; i < refArgTypes.length; i++) {
      const refType = refArgTypes[i];
      const refValue = refArgValues[i];
      let resolved = 0;

      switch (refType) {
        case ABIReferenceType.account: {
          const addressType = new ABIAddressType();
          const address = addressType.decode(addressType.encode(refValue));
          resolved = populateForeignArray(address, foreignAccounts, sender);
          break;
        }
        case ABIReferenceType.application: {
          const uint64Type = new ABIUintType(64);
          const refAppID = uint64Type.decode(uint64Type.encode(refValue));
          if (refAppID > Number.MAX_SAFE_INTEGER) {
            throw new Error(
              `Expected safe integer for application value, got ${refAppID}`
            );
          }
          resolved = populateForeignArray(Number(refAppID), foreignApps, appID);
          break;
        }
        case ABIReferenceType.asset: {
          const uint64Type = new ABIUintType(64);
          const refAssetID = uint64Type.decode(uint64Type.encode(refValue));
          if (refAssetID > Number.MAX_SAFE_INTEGER) {
            throw new Error(
              `Expected safe integer for asset value, got ${refAssetID}`
            );
          }
          resolved = populateForeignArray(Number(refAssetID), foreignAssets);
          break;
        }
        default:
          throw new Error(`Unknown reference type: ${refType}`);
      }

      resolvedRefIndexes.push(resolved);
    }

    for (let i = 0; i < resolvedRefIndexes.length; i++) {
      const basicArgIndex = refArgIndexToBasicArgIndex.get(i);
      basicArgValues[basicArgIndex] = resolvedRefIndexes[i];
    }

    if (basicArgTypes.length > MAX_APP_ARGS - 1) {
      const lastArgTupleTypes = basicArgTypes.slice(MAX_APP_ARGS - 2);
      const lastArgTupleValues = basicArgValues.slice(MAX_APP_ARGS - 2);

      basicArgTypes = basicArgTypes.slice(0, MAX_APP_ARGS - 2);
      basicArgValues = basicArgValues.slice(0, MAX_APP_ARGS - 2);

      basicArgTypes.push(new ABITupleType(lastArgTupleTypes));
      basicArgValues.push(lastArgTupleValues);
    }

    const appArgsEncoded: Uint8Array[] = [method.getSelector()];
    for (let i = 0; i < basicArgTypes.length; i++) {
      appArgsEncoded.push(basicArgTypes[i].encode(basicArgValues[i]));
    }

    const appCall = {
      txn: makeApplicationCallTxnFromObject({
        from: sender,
        appIndex: appID,
        appArgs: appArgsEncoded,
        accounts: foreignAccounts,
        foreignApps,
        foreignAssets,
        boxes: boxReferences,
        onComplete:
          onComplete == null ? OnApplicationComplete.NoOpOC : onComplete,
        approvalProgram,
        clearProgram,
        numGlobalInts,
        numGlobalByteSlices,
        numLocalInts,
        numLocalByteSlices,
        extraPages,
        lease,
        note,
        rekeyTo,
        suggestedParams,
      }),
      signer,
    };

    this.transactions.push(...txnArgs, appCall);
    this.methodCalls.set(this.transactions.length - 1, method);
  }

  /**
   * Finalize the transaction group and returned the finalized transactions.
   *
   * The composer's status will be at least BUILT after executing this method.
   */
  buildGroup(): TransactionWithSigner[] {
    if (this.status === AtomicTransactionComposerStatus.BUILDING) {
      if (this.transactions.length === 0) {
        throw new Error('Cannot build a group with 0 transactions');
      }
      if (this.transactions.length > 1) {
        assignGroupID(
          this.transactions.map((txnWithSigner) => txnWithSigner.txn)
        );
      }
      this.status = AtomicTransactionComposerStatus.BUILT;
    }
    return this.transactions;
  }

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
  async gatherSignatures(): Promise<Uint8Array[]> {
    if (this.status >= AtomicTransactionComposerStatus.SIGNED) {
      return this.signedTxns;
    }

    // retrieve built transactions and verify status is BUILT
    const txnsWithSigners = this.buildGroup();
    const txnGroup = txnsWithSigners.map((txnWithSigner) => txnWithSigner.txn);

    const indexesPerSigner: Map<TransactionSigner, number[]> = new Map();

    for (let i = 0; i < txnsWithSigners.length; i++) {
      const { signer } = txnsWithSigners[i];

      if (!indexesPerSigner.has(signer)) {
        indexesPerSigner.set(signer, []);
      }

      indexesPerSigner.get(signer).push(i);
    }

    const orderedSigners = Array.from(indexesPerSigner);

    const batchedSigs = await Promise.all(
      orderedSigners.map(([signer, indexes]) => signer(txnGroup, indexes))
    );

    const signedTxns: Array<Uint8Array | null> = txnsWithSigners.map(
      () => null
    );

    for (
      let signerIndex = 0;
      signerIndex < orderedSigners.length;
      signerIndex++
    ) {
      const indexes = orderedSigners[signerIndex][1];
      const sigs = batchedSigs[signerIndex];

      for (let i = 0; i < indexes.length; i++) {
        signedTxns[indexes[i]] = sigs[i];
      }
    }

    if (!signedTxns.every((sig) => sig != null)) {
      throw new Error(`Missing signatures. Got ${signedTxns}`);
    }

    const txIDs = signedTxns.map((stxn, index) => {
      try {
        return decodeSignedTransaction(stxn).txn.txID();
      } catch (err) {
        throw new Error(
          `Cannot decode signed transaction at index ${index}. ${err}`
        );
      }
    });

    this.signedTxns = signedTxns;
    this.txIDs = txIDs;
    this.status = AtomicTransactionComposerStatus.SIGNED;

    return signedTxns;
  }

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
  async submit(client: Algodv2): Promise<string[]> {
    if (this.status > AtomicTransactionComposerStatus.SUBMITTED) {
      throw new Error('Transaction group cannot be resubmitted');
    }

    const stxns = await this.gatherSignatures();

    await client.sendRawTransaction(stxns).do();

    this.status = AtomicTransactionComposerStatus.SUBMITTED;

    return this.txIDs;
  }

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
  async execute(
    client: Algodv2,
    waitRounds: number
  ): Promise<{
    confirmedRound: number;
    txIDs: string[];
    methodResults: ABIResult[];
  }> {
    if (this.status === AtomicTransactionComposerStatus.COMMITTED) {
      throw new Error(
        'Transaction group has already been executed successfully'
      );
    }

    const txIDs = await this.submit(client);
    this.status = AtomicTransactionComposerStatus.SUBMITTED;

    const firstMethodCallIndex = this.transactions.findIndex((_, index) =>
      this.methodCalls.has(index)
    );
    const indexToWaitFor =
      firstMethodCallIndex === -1 ? 0 : firstMethodCallIndex;
    const confirmedTxnInfo = await waitForConfirmation(
      client,
      txIDs[indexToWaitFor],
      waitRounds
    );
    this.status = AtomicTransactionComposerStatus.COMMITTED;

    const confirmedRound: number = confirmedTxnInfo['confirmed-round'];

    const methodResults: ABIResult[] = [];

    for (const [txnIndex, method] of this.methodCalls) {
      const txID = txIDs[txnIndex];

      const methodResult: ABIResult = {
        txID,
        rawReturnValue: new Uint8Array(),
        method,
      };

      try {
        const pendingInfo =
          txnIndex === firstMethodCallIndex
            ? confirmedTxnInfo
            : // eslint-disable-next-line no-await-in-loop
              await client.pendingTransactionInformation(txID).do();
        methodResult.txInfo = pendingInfo;
        if (method.returns.type !== 'void') {
          const logs: string[] = pendingInfo.logs || [];
          if (logs.length === 0) {
            throw new Error('App call transaction did not log a return value');
          }

          const lastLog = Buffer.from(logs[logs.length - 1], 'base64');
          if (
            lastLog.byteLength < 4 ||
            !lastLog.slice(0, 4).equals(RETURN_PREFIX)
          ) {
            throw new Error('App call transaction did not log a return value');
          }

          methodResult.rawReturnValue = new Uint8Array(lastLog.slice(4));
          methodResult.returnValue = method.returns.type.decode(
            methodResult.rawReturnValue
          );
        }
      } catch (err) {
        methodResult.decodeError = err;
      }

      methodResults.push(methodResult);
    }

    return {
      confirmedRound,
      txIDs,
      methodResults,
    };
  }
}
