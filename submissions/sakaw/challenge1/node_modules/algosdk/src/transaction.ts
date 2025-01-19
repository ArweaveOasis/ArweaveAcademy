import base32 from 'hi-base32';
import * as address from './encoding/address';
import * as encoding from './encoding/encoding';
import * as nacl from './nacl/naclWrappers';
import * as utils from './utils/utils';
import { translateBoxReferences } from './boxStorage';
import {
  OnApplicationComplete,
  TransactionParams,
  TransactionType,
  isTransactionType,
  BoxReference,
} from './types/transactions/base';
import AnyTransaction, {
  MustHaveSuggestedParams,
  MustHaveSuggestedParamsInline,
  EncodedTransaction,
  EncodedSignedTransaction,
  EncodedMultisig,
  EncodedLogicSig,
} from './types/transactions';
import { Address } from './types/address';

const ALGORAND_TRANSACTION_LENGTH = 52;
export const ALGORAND_MIN_TX_FEE = 1000; // version v5
const ALGORAND_TRANSACTION_LEASE_LENGTH = 32;
const ALGORAND_MAX_ASSET_DECIMALS = 19;
const NUM_ADDL_BYTES_AFTER_SIGNING = 75; // NUM_ADDL_BYTES_AFTER_SIGNING is the number of bytes added to a txn after signing it
const ALGORAND_TRANSACTION_LEASE_LABEL_LENGTH = 5;
const ALGORAND_TRANSACTION_ADDRESS_LENGTH = 32;
const ALGORAND_TRANSACTION_REKEY_LABEL_LENGTH = 5;
const ASSET_METADATA_HASH_LENGTH = 32;
const KEYREG_VOTE_KEY_LENGTH = 32;
const KEYREG_SELECTION_KEY_LENGTH = 32;
const KEYREG_STATE_PROOF_KEY_LENGTH = 64;

type AnyTransactionWithParams = MustHaveSuggestedParams<AnyTransaction>;
type AnyTransactionWithParamsInline = MustHaveSuggestedParamsInline<AnyTransaction>;

/**
 * A modified version of the transaction params. Represents the internal structure that the Transaction class uses
 * to store inputted transaction objects.
 */
// Omit allows overwriting properties
interface TransactionStorageStructure
  extends Omit<
    TransactionParams,
    | 'from'
    | 'to'
    | 'genesisHash'
    | 'closeRemainderTo'
    | 'voteKey'
    | 'selectionKey'
    | 'stateProofKey'
    | 'assetManager'
    | 'assetReserve'
    | 'assetFreeze'
    | 'assetClawback'
    | 'assetRevocationTarget'
    | 'freezeAccount'
    | 'appAccounts'
    | 'suggestedParams'
    | 'reKeyTo'
  > {
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

function getKeyregKey(
  input: undefined | string | Uint8Array | Buffer,
  inputName: string,
  length: number
): Buffer | undefined {
  if (input == null) {
    return undefined;
  }

  let inputAsBuffer: Buffer | undefined;

  if (typeof input === 'string') {
    inputAsBuffer = Buffer.from(input, 'base64');
  } else if (input.constructor === Uint8Array) {
    inputAsBuffer = Buffer.from(input);
  } else if (Buffer.isBuffer(input)) {
    inputAsBuffer = input;
  }

  if (inputAsBuffer == null || inputAsBuffer.byteLength !== length) {
    throw Error(
      `${inputName} must be a ${length} byte Uint8Array or Buffer or base64 string.`
    );
  }

  return inputAsBuffer;
}

/**
 * Transaction enables construction of Algorand transactions
 * */
export class Transaction implements TransactionStorageStructure {
  name = 'Transaction';
  tag = Buffer.from('TX');

  // Implement transaction params
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

  constructor({ ...transaction }: AnyTransaction) {
    // Populate defaults
    /* eslint-disable no-param-reassign */
    const defaults: Partial<TransactionParams> = {
      type: TransactionType.pay,
      flatFee: false,
      nonParticipation: false,
    };
    // Default type
    if (typeof transaction.type === 'undefined') {
      transaction.type = defaults.type;
    }
    // Default flatFee
    if (
      typeof (transaction as AnyTransactionWithParamsInline).flatFee ===
      'undefined'
    ) {
      (transaction as AnyTransactionWithParamsInline).flatFee =
        defaults.flatFee;
    }
    // Default nonParticipation
    if (
      transaction.type === TransactionType.keyreg &&
      typeof transaction.voteKey !== 'undefined' &&
      typeof transaction.nonParticipation === 'undefined'
    ) {
      transaction.nonParticipation = defaults.nonParticipation;
    }
    /* eslint-enable no-param-reassign */

    // Move suggested parameters from its object to inline
    if (
      (transaction as AnyTransactionWithParams).suggestedParams !== undefined
    ) {
      // Create a temporary reference to the transaction object that has params inline and also as a suggested params object
      //   - Helpful for moving params from named object to inline
      const reference = transaction as AnyTransactionWithParams &
        AnyTransactionWithParamsInline;
      reference.genesisHash = reference.suggestedParams.genesisHash;
      reference.fee = reference.suggestedParams.fee;
      if (reference.suggestedParams.flatFee !== undefined)
        reference.flatFee = reference.suggestedParams.flatFee;
      reference.firstRound = reference.suggestedParams.firstRound;
      reference.lastRound = reference.suggestedParams.lastRound;
      reference.genesisID = reference.suggestedParams.genesisID;
    }

    // At this point all suggestedParams have been moved to be inline, so we can reassign the transaction object type
    // to one which is more useful as we prepare properties for storing
    const txn = transaction as TransactionStorageStructure;

    txn.from = address.decodeAddress(txn.from as string);
    if (txn.to !== undefined) txn.to = address.decodeAddress(txn.to as string);
    if (txn.closeRemainderTo !== undefined)
      txn.closeRemainderTo = address.decodeAddress(
        txn.closeRemainderTo as string
      );
    if (txn.assetManager !== undefined)
      txn.assetManager = address.decodeAddress(txn.assetManager as string);
    if (txn.assetReserve !== undefined)
      txn.assetReserve = address.decodeAddress(txn.assetReserve as string);
    if (txn.assetFreeze !== undefined)
      txn.assetFreeze = address.decodeAddress(txn.assetFreeze as string);
    if (txn.assetClawback !== undefined)
      txn.assetClawback = address.decodeAddress(txn.assetClawback as string);
    if (txn.assetRevocationTarget !== undefined)
      txn.assetRevocationTarget = address.decodeAddress(
        txn.assetRevocationTarget as string
      );
    if (txn.freezeAccount !== undefined)
      txn.freezeAccount = address.decodeAddress(txn.freezeAccount as string);
    if (txn.reKeyTo !== undefined)
      txn.reKeyTo = address.decodeAddress(txn.reKeyTo as string);
    if (txn.genesisHash === undefined)
      throw Error('genesis hash must be specified and in a base64 string.');

    txn.genesisHash = Buffer.from(txn.genesisHash as string, 'base64');

    if (
      txn.amount !== undefined &&
      (!(
        Number.isSafeInteger(txn.amount) ||
        (typeof txn.amount === 'bigint' &&
          txn.amount <= BigInt('0xffffffffffffffff'))
      ) ||
        txn.amount < 0)
    )
      throw Error(
        'Amount must be a positive number and smaller than 2^64-1. If the number is larger than 2^53-1, use bigint.'
      );
    if (!Number.isSafeInteger(txn.fee) || txn.fee < 0)
      throw Error('fee must be a positive number and smaller than 2^53-1');
    if (!Number.isSafeInteger(txn.firstRound) || txn.firstRound < 0)
      throw Error('firstRound must be a positive number');
    if (!Number.isSafeInteger(txn.lastRound) || txn.lastRound < 0)
      throw Error('lastRound must be a positive number');
    if (
      txn.extraPages !== undefined &&
      (!Number.isInteger(txn.extraPages) ||
        txn.extraPages < 0 ||
        txn.extraPages > 3)
    )
      throw Error('extraPages must be an Integer between and including 0 to 3');
    if (
      txn.assetTotal !== undefined &&
      (!(
        Number.isSafeInteger(txn.assetTotal) ||
        (typeof txn.assetTotal === 'bigint' &&
          txn.assetTotal <= BigInt('0xffffffffffffffff'))
      ) ||
        txn.assetTotal < 0)
    )
      throw Error(
        'Total asset issuance must be a positive number and smaller than 2^64-1. If the number is larger than 2^53-1, use bigint.'
      );
    if (
      txn.assetDecimals !== undefined &&
      (!Number.isSafeInteger(txn.assetDecimals) ||
        txn.assetDecimals < 0 ||
        txn.assetDecimals > ALGORAND_MAX_ASSET_DECIMALS)
    )
      throw Error(
        `assetDecimals must be a positive number and smaller than ${ALGORAND_MAX_ASSET_DECIMALS.toString()}`
      );
    if (
      txn.assetIndex !== undefined &&
      (!Number.isSafeInteger(txn.assetIndex) || txn.assetIndex < 0)
    )
      throw Error(
        'Asset index must be a positive number and smaller than 2^53-1'
      );
    if (
      txn.appIndex !== undefined &&
      (!Number.isSafeInteger(txn.appIndex) || txn.appIndex < 0)
    )
      throw Error(
        'Application index must be a positive number and smaller than 2^53-1'
      );
    if (
      txn.appLocalInts !== undefined &&
      (!Number.isSafeInteger(txn.appLocalInts) || txn.appLocalInts < 0)
    )
      throw Error(
        'Application local ints count must be a positive number and smaller than 2^53-1'
      );
    if (
      txn.appLocalByteSlices !== undefined &&
      (!Number.isSafeInteger(txn.appLocalByteSlices) ||
        txn.appLocalByteSlices < 0)
    )
      throw Error(
        'Application local byte slices count must be a positive number and smaller than 2^53-1'
      );
    if (
      txn.appGlobalInts !== undefined &&
      (!Number.isSafeInteger(txn.appGlobalInts) || txn.appGlobalInts < 0)
    )
      throw Error(
        'Application global ints count must be a positive number and smaller than 2^53-1'
      );
    if (
      txn.appGlobalByteSlices !== undefined &&
      (!Number.isSafeInteger(txn.appGlobalByteSlices) ||
        txn.appGlobalByteSlices < 0)
    )
      throw Error(
        'Application global byte slices count must be a positive number and smaller than 2^53-1'
      );
    if (txn.appApprovalProgram !== undefined) {
      if (txn.appApprovalProgram.constructor !== Uint8Array)
        throw Error('appApprovalProgram must be a Uint8Array.');
    }
    if (txn.appClearProgram !== undefined) {
      if (txn.appClearProgram.constructor !== Uint8Array)
        throw Error('appClearProgram must be a Uint8Array.');
    }
    if (txn.appArgs !== undefined) {
      if (!Array.isArray(txn.appArgs))
        throw Error('appArgs must be an Array of Uint8Array.');
      txn.appArgs = txn.appArgs.slice();
      txn.appArgs.forEach((arg) => {
        if (arg.constructor !== Uint8Array)
          throw Error('each element of AppArgs must be a Uint8Array.');
      });
    } else {
      txn.appArgs = [];
    }
    if (txn.appAccounts !== undefined) {
      if (!Array.isArray(txn.appAccounts))
        throw Error('appAccounts must be an Array of addresses.');
      txn.appAccounts = txn.appAccounts.map((addressAsString) =>
        address.decodeAddress(addressAsString)
      );
    }
    if (txn.appForeignApps !== undefined) {
      if (!Array.isArray(txn.appForeignApps))
        throw Error('appForeignApps must be an Array of integers.');
      txn.appForeignApps = txn.appForeignApps.slice();
      txn.appForeignApps.forEach((foreignAppIndex) => {
        if (!Number.isSafeInteger(foreignAppIndex) || foreignAppIndex < 0)
          throw Error(
            'each foreign application index must be a positive number and smaller than 2^53-1'
          );
      });
    }
    if (txn.appForeignAssets !== undefined) {
      if (!Array.isArray(txn.appForeignAssets))
        throw Error('appForeignAssets must be an Array of integers.');
      txn.appForeignAssets = txn.appForeignAssets.slice();
      txn.appForeignAssets.forEach((foreignAssetIndex) => {
        if (!Number.isSafeInteger(foreignAssetIndex) || foreignAssetIndex < 0)
          throw Error(
            'each foreign asset index must be a positive number and smaller than 2^53-1'
          );
      });
    }
    if (txn.boxes !== undefined) {
      if (!Array.isArray(txn.boxes))
        throw Error('boxes must be an Array of BoxReference.');
      txn.boxes = txn.boxes.slice();
      txn.boxes.forEach((box) => {
        if (
          !Number.isSafeInteger(box.appIndex) ||
          box.name.constructor !== Uint8Array
        )
          throw Error(
            'box app index must be a number and name must be an Uint8Array.'
          );
      });
    }
    if (
      txn.assetMetadataHash !== undefined &&
      txn.assetMetadataHash.length !== 0
    ) {
      if (typeof txn.assetMetadataHash === 'string') {
        txn.assetMetadataHash = new Uint8Array(
          Buffer.from(txn.assetMetadataHash)
        );
      }

      if (
        txn.assetMetadataHash.constructor !== Uint8Array ||
        txn.assetMetadataHash.byteLength !== ASSET_METADATA_HASH_LENGTH
      ) {
        throw Error(
          `assetMetadataHash must be a ${ASSET_METADATA_HASH_LENGTH} byte Uint8Array or string.`
        );
      }

      if (txn.assetMetadataHash.every((value) => value === 0)) {
        // if hash contains all 0s, omit it
        txn.assetMetadataHash = undefined;
      }
    } else {
      txn.assetMetadataHash = undefined;
    }
    if (txn.note !== undefined) {
      if (txn.note.constructor !== Uint8Array)
        throw Error('note must be a Uint8Array.');
    } else {
      txn.note = new Uint8Array(0);
    }
    if (txn.lease !== undefined) {
      if (txn.lease.constructor !== Uint8Array)
        throw Error('lease must be a Uint8Array.');
      if (txn.lease.length !== ALGORAND_TRANSACTION_LEASE_LENGTH)
        throw Error(
          `lease must be of length ${ALGORAND_TRANSACTION_LEASE_LENGTH.toString()}.`
        );
      if (txn.lease.every((value) => value === 0)) {
        // if lease contains all 0s, omit it
        txn.lease = new Uint8Array(0);
      }
    } else {
      txn.lease = new Uint8Array(0);
    }
    txn.voteKey = getKeyregKey(txn.voteKey, 'voteKey', KEYREG_VOTE_KEY_LENGTH);
    txn.selectionKey = getKeyregKey(
      txn.selectionKey,
      'selectionKey',
      KEYREG_SELECTION_KEY_LENGTH
    );
    txn.stateProofKey = getKeyregKey(
      txn.stateProofKey,
      'stateProofKey',
      KEYREG_STATE_PROOF_KEY_LENGTH
    );
    // Checking non-participation key registration
    if (
      txn.nonParticipation &&
      (txn.voteKey ||
        txn.selectionKey ||
        txn.voteFirst ||
        txn.stateProofKey ||
        txn.voteLast ||
        txn.voteKeyDilution)
    ) {
      throw new Error(
        'nonParticipation is true but participation params are present.'
      );
    }
    // Checking online key registration
    if (
      !txn.nonParticipation &&
      (txn.voteKey ||
        txn.selectionKey ||
        txn.stateProofKey ||
        txn.voteFirst ||
        txn.voteLast ||
        txn.voteKeyDilution) &&
      !(
        txn.voteKey &&
        txn.selectionKey &&
        txn.voteFirst &&
        txn.voteLast &&
        txn.voteKeyDilution
      )
      // stateProofKey not included here for backwards compatibility
    ) {
      throw new Error(
        'online key registration missing at least one of the following fields: ' +
          'voteKey, selectionKey, voteFirst, voteLast, voteKeyDilution'
      );
    }
    // The last option is an offline key registration where all the fields
    // nonParticipation, voteKey, selectionKey, voteFirst, voteLast, voteKeyDilution
    // are all undefined/false

    // Remove unwanted properties and store transaction on instance
    delete ((txn as unknown) as AnyTransactionWithParams).suggestedParams;
    Object.assign(this, utils.removeUndefinedProperties(txn));

    // Modify Fee
    if (!txn.flatFee) {
      this.fee *= this.estimateSize();
      // If suggested fee too small and will be rejected, set to min tx fee
      if (this.fee < ALGORAND_MIN_TX_FEE) {
        this.fee = ALGORAND_MIN_TX_FEE;
      }
    }

    // say we are aware of groups
    this.group = undefined;

    // stpf fields
    if (
      txn.stateProofType !== undefined &&
      (!Number.isSafeInteger(txn.stateProofType) || txn.stateProofType < 0)
    )
      throw Error(
        'State Proof type must be a positive number and smaller than 2^53-1'
      );
    if (txn.stateProofMessage !== undefined) {
      if (txn.stateProofMessage.constructor !== Uint8Array)
        throw Error('stateProofMessage must be a Uint8Array.');
    } else {
      txn.stateProofMessage = new Uint8Array(0);
    }
    if (txn.stateProof !== undefined) {
      if (txn.stateProof.constructor !== Uint8Array)
        throw Error('stateProof must be a Uint8Array.');
    } else {
      txn.stateProof = new Uint8Array(0);
    }
  }

  // eslint-disable-next-line camelcase
  get_obj_for_encoding() {
    if (this.type === 'pay') {
      const txn: EncodedTransaction = {
        amt: this.amount,
        fee: this.fee,
        fv: this.firstRound,
        lv: this.lastRound,
        note: Buffer.from(this.note),
        snd: Buffer.from(this.from.publicKey),
        type: 'pay',
        gen: this.genesisID,
        gh: this.genesisHash,
        lx: Buffer.from(this.lease),
        grp: this.group,
      };

      // parse close address
      if (
        this.closeRemainderTo !== undefined &&
        address.encodeAddress(this.closeRemainderTo.publicKey) !==
          address.ALGORAND_ZERO_ADDRESS_STRING
      ) {
        txn.close = Buffer.from(this.closeRemainderTo.publicKey);
      }
      if (this.reKeyTo !== undefined) {
        txn.rekey = Buffer.from(this.reKeyTo.publicKey);
      }
      // allowed zero values
      if (this.to !== undefined) txn.rcv = Buffer.from(this.to.publicKey);
      if (!txn.note.length) delete txn.note;
      if (!txn.amt) delete txn.amt;
      if (!txn.fee) delete txn.fee;
      if (!txn.fv) delete txn.fv;
      if (!txn.gen) delete txn.gen;
      if (txn.grp === undefined) delete txn.grp;
      if (!txn.lx.length) delete txn.lx;
      if (!txn.rekey) delete txn.rekey;
      return txn;
    }
    if (this.type === 'keyreg') {
      const txn: EncodedTransaction = {
        fee: this.fee,
        fv: this.firstRound,
        lv: this.lastRound,
        note: Buffer.from(this.note),
        snd: Buffer.from(this.from.publicKey),
        type: this.type,
        gen: this.genesisID,
        gh: this.genesisHash,
        lx: Buffer.from(this.lease),
        grp: this.group,
        votekey: this.voteKey,
        selkey: this.selectionKey,
        sprfkey: this.stateProofKey,
        votefst: this.voteFirst,
        votelst: this.voteLast,
        votekd: this.voteKeyDilution,
      };
      // allowed zero values
      if (!txn.note.length) delete txn.note;
      if (!txn.lx.length) delete txn.lx;
      if (!txn.fee) delete txn.fee;
      if (!txn.fv) delete txn.fv;
      if (!txn.gen) delete txn.gen;
      if (txn.grp === undefined) delete txn.grp;
      if (this.reKeyTo !== undefined) {
        txn.rekey = Buffer.from(this.reKeyTo.publicKey);
      }
      if (this.nonParticipation) {
        txn.nonpart = true;
      }
      if (!txn.selkey) delete txn.selkey;
      if (!txn.votekey) delete txn.votekey;
      if (!txn.sprfkey) delete txn.sprfkey;
      if (!txn.votefst) delete txn.votefst;
      if (!txn.votelst) delete txn.votelst;
      if (!txn.votekd) delete txn.votekd;
      return txn;
    }
    if (this.type === 'acfg') {
      // asset creation, or asset reconfigure, or asset destruction
      const txn: EncodedTransaction = {
        fee: this.fee,
        fv: this.firstRound,
        lv: this.lastRound,
        note: Buffer.from(this.note),
        snd: Buffer.from(this.from.publicKey),
        type: this.type,
        gen: this.genesisID,
        gh: this.genesisHash,
        lx: Buffer.from(this.lease),
        grp: this.group,
        caid: this.assetIndex,
        apar: {
          t: this.assetTotal,
          df: this.assetDefaultFrozen,
          dc: this.assetDecimals,
        },
      };
      if (this.assetManager !== undefined)
        txn.apar.m = Buffer.from(this.assetManager.publicKey);
      if (this.assetReserve !== undefined)
        txn.apar.r = Buffer.from(this.assetReserve.publicKey);
      if (this.assetFreeze !== undefined)
        txn.apar.f = Buffer.from(this.assetFreeze.publicKey);
      if (this.assetClawback !== undefined)
        txn.apar.c = Buffer.from(this.assetClawback.publicKey);
      if (this.assetName !== undefined) txn.apar.an = this.assetName;
      if (this.assetUnitName !== undefined) txn.apar.un = this.assetUnitName;
      if (this.assetURL !== undefined) txn.apar.au = this.assetURL;
      if (this.assetMetadataHash !== undefined)
        txn.apar.am = Buffer.from(this.assetMetadataHash);

      // allowed zero values
      if (!txn.note.length) delete txn.note;
      if (!txn.lx.length) delete txn.lx;
      if (!txn.amt) delete txn.amt;
      if (!txn.fee) delete txn.fee;
      if (!txn.fv) delete txn.fv;
      if (!txn.gen) delete txn.gen;
      if (this.reKeyTo !== undefined) {
        txn.rekey = Buffer.from(this.reKeyTo.publicKey);
      }

      if (!txn.caid) delete txn.caid;
      if (
        !txn.apar.t &&
        !txn.apar.un &&
        !txn.apar.an &&
        !txn.apar.df &&
        !txn.apar.m &&
        !txn.apar.r &&
        !txn.apar.f &&
        !txn.apar.c &&
        !txn.apar.au &&
        !txn.apar.am &&
        !txn.apar.dc
      ) {
        delete txn.apar;
      } else {
        if (!txn.apar.t) delete txn.apar.t;
        if (!txn.apar.dc) delete txn.apar.dc;
        if (!txn.apar.un) delete txn.apar.un;
        if (!txn.apar.an) delete txn.apar.an;
        if (!txn.apar.df) delete txn.apar.df;
        if (!txn.apar.m) delete txn.apar.m;
        if (!txn.apar.r) delete txn.apar.r;
        if (!txn.apar.f) delete txn.apar.f;
        if (!txn.apar.c) delete txn.apar.c;
        if (!txn.apar.au) delete txn.apar.au;
        if (!txn.apar.am) delete txn.apar.am;
      }
      if (txn.grp === undefined) delete txn.grp;

      return txn;
    }
    if (this.type === 'axfer') {
      // asset transfer, acceptance, revocation, mint, or burn
      const txn: EncodedTransaction = {
        aamt: this.amount,
        fee: this.fee,
        fv: this.firstRound,
        lv: this.lastRound,
        note: Buffer.from(this.note),
        snd: Buffer.from(this.from.publicKey),
        arcv: Buffer.from(this.to.publicKey),
        type: this.type,
        gen: this.genesisID,
        gh: this.genesisHash,
        lx: Buffer.from(this.lease),
        grp: this.group,
        xaid: this.assetIndex,
      };
      if (this.closeRemainderTo !== undefined)
        txn.aclose = Buffer.from(this.closeRemainderTo.publicKey);
      if (this.assetRevocationTarget !== undefined)
        txn.asnd = Buffer.from(this.assetRevocationTarget.publicKey);
      // allowed zero values
      if (!txn.note.length) delete txn.note;
      if (!txn.lx.length) delete txn.lx;
      if (!txn.aamt) delete txn.aamt;
      if (!txn.amt) delete txn.amt;
      if (!txn.fee) delete txn.fee;
      if (!txn.fv) delete txn.fv;
      if (!txn.gen) delete txn.gen;
      if (txn.grp === undefined) delete txn.grp;
      if (!txn.aclose) delete txn.aclose;
      if (!txn.asnd) delete txn.asnd;
      if (!txn.rekey) delete txn.rekey;
      if (this.reKeyTo !== undefined) {
        txn.rekey = Buffer.from(this.reKeyTo.publicKey);
      }
      return txn;
    }
    if (this.type === 'afrz') {
      // asset freeze or unfreeze
      const txn: EncodedTransaction = {
        fee: this.fee,
        fv: this.firstRound,
        lv: this.lastRound,
        note: Buffer.from(this.note),
        snd: Buffer.from(this.from.publicKey),
        type: this.type,
        gen: this.genesisID,
        gh: this.genesisHash,
        lx: Buffer.from(this.lease),
        grp: this.group,
        faid: this.assetIndex,
        afrz: this.freezeState,
      };
      if (this.freezeAccount !== undefined)
        txn.fadd = Buffer.from(this.freezeAccount.publicKey);
      // allowed zero values
      if (!txn.note.length) delete txn.note;
      if (!txn.lx.length) delete txn.lx;
      if (!txn.amt) delete txn.amt;
      if (!txn.fee) delete txn.fee;
      if (!txn.fv) delete txn.fv;
      if (!txn.gen) delete txn.gen;
      if (!txn.afrz) delete txn.afrz;
      if (txn.grp === undefined) delete txn.grp;
      if (this.reKeyTo !== undefined) {
        txn.rekey = Buffer.from(this.reKeyTo.publicKey);
      }
      return txn;
    }
    if (this.type === 'appl') {
      // application call of some kind
      const txn: EncodedTransaction = {
        fee: this.fee,
        fv: this.firstRound,
        lv: this.lastRound,
        note: Buffer.from(this.note),
        snd: Buffer.from(this.from.publicKey),
        type: this.type,
        gen: this.genesisID,
        gh: this.genesisHash,
        lx: Buffer.from(this.lease),
        grp: this.group,
        apid: this.appIndex,
        apan: this.appOnComplete,
        apls: {
          nui: this.appLocalInts,
          nbs: this.appLocalByteSlices,
        },
        apgs: {
          nui: this.appGlobalInts,
          nbs: this.appGlobalByteSlices,
        },
        apfa: this.appForeignApps,
        apas: this.appForeignAssets,
        apep: this.extraPages,
        apbx: translateBoxReferences(
          this.boxes,
          this.appForeignApps,
          this.appIndex
        ),
      };
      if (this.reKeyTo !== undefined) {
        txn.rekey = Buffer.from(this.reKeyTo.publicKey);
      }
      if (this.appApprovalProgram !== undefined) {
        txn.apap = Buffer.from(this.appApprovalProgram);
      }
      if (this.appClearProgram !== undefined) {
        txn.apsu = Buffer.from(this.appClearProgram);
      }
      if (this.appArgs !== undefined) {
        txn.apaa = this.appArgs.map((arg) => Buffer.from(arg));
      }
      if (this.appAccounts !== undefined) {
        txn.apat = this.appAccounts.map((decodedAddress) =>
          Buffer.from(decodedAddress.publicKey)
        );
      }
      // allowed zero values
      if (!txn.note.length) delete txn.note;
      if (!txn.lx.length) delete txn.lx;
      if (!txn.amt) delete txn.amt;
      if (!txn.fee) delete txn.fee;
      if (!txn.fv) delete txn.fv;
      if (!txn.gen) delete txn.gen;
      if (!txn.apid) delete txn.apid;
      if (!txn.apls.nui) delete txn.apls.nui;
      if (!txn.apls.nbs) delete txn.apls.nbs;
      if (!txn.apls.nui && !txn.apls.nbs) delete txn.apls;
      if (!txn.apgs.nui) delete txn.apgs.nui;
      if (!txn.apgs.nbs) delete txn.apgs.nbs;
      if (!txn.apaa || !txn.apaa.length) delete txn.apaa;
      if (!txn.apgs.nui && !txn.apgs.nbs) delete txn.apgs;
      if (!txn.apap) delete txn.apap;
      if (!txn.apsu) delete txn.apsu;
      if (!txn.apan) delete txn.apan;
      if (!txn.apfa || !txn.apfa.length) delete txn.apfa;
      if (!txn.apas || !txn.apas.length) delete txn.apas;
      for (const box of txn.apbx) {
        if (!box.i) delete box.i;
        if (!box.n || !box.n.length) delete box.n;
      }
      if (!txn.apbx || !txn.apbx.length) delete txn.apbx;
      if (!txn.apat || !txn.apat.length) delete txn.apat;
      if (!txn.apep) delete txn.apep;
      if (txn.grp === undefined) delete txn.grp;
      return txn;
    }
    if (this.type === 'stpf') {
      // state proof txn
      const txn: EncodedTransaction = {
        fee: this.fee,
        fv: this.firstRound,
        lv: this.lastRound,
        note: Buffer.from(this.note),
        snd: Buffer.from(this.from.publicKey),
        type: this.type,
        gen: this.genesisID,
        gh: this.genesisHash,
        lx: Buffer.from(this.lease),
        sptype: this.stateProofType,
        spmsg: Buffer.from(this.stateProofMessage),
        sp: Buffer.from(this.stateProof),
      };
      // allowed zero values
      if (!txn.sptype) delete txn.sptype;
      if (!txn.note.length) delete txn.note;
      if (!txn.lx.length) delete txn.lx;
      if (!txn.amt) delete txn.amt;
      if (!txn.fee) delete txn.fee;
      if (!txn.fv) delete txn.fv;
      if (!txn.gen) delete txn.gen;
      if (!txn.apid) delete txn.apid;
      if (!txn.apaa || !txn.apaa.length) delete txn.apaa;
      if (!txn.apap) delete txn.apap;
      if (!txn.apsu) delete txn.apsu;
      if (!txn.apan) delete txn.apan;
      if (!txn.apfa || !txn.apfa.length) delete txn.apfa;
      if (!txn.apas || !txn.apas.length) delete txn.apas;
      if (!txn.apat || !txn.apat.length) delete txn.apat;
      if (!txn.apep) delete txn.apep;
      if (txn.grp === undefined) delete txn.grp;
      return txn;
    }

    return undefined;
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(txnForEnc: EncodedTransaction): Transaction {
    const txn = Object.create(this.prototype) as Transaction;
    txn.name = 'Transaction';
    txn.tag = Buffer.from('TX');

    txn.genesisID = txnForEnc.gen;
    txn.genesisHash = Buffer.from(txnForEnc.gh);
    if (!isTransactionType(txnForEnc.type)) {
      throw new Error(`Unrecognized transaction type: ${txnForEnc.type}`);
    }
    txn.type = txnForEnc.type;
    txn.fee = txnForEnc.fee;
    txn.firstRound = txnForEnc.fv;
    txn.lastRound = txnForEnc.lv;
    txn.note = new Uint8Array(txnForEnc.note);
    txn.lease = new Uint8Array(txnForEnc.lx);
    txn.from = address.decodeAddress(
      address.encodeAddress(new Uint8Array(txnForEnc.snd))
    );
    if (txnForEnc.grp !== undefined) txn.group = Buffer.from(txnForEnc.grp);
    if (txnForEnc.rekey !== undefined)
      txn.reKeyTo = address.decodeAddress(
        address.encodeAddress(new Uint8Array(txnForEnc.rekey))
      );

    if (txnForEnc.type === 'pay') {
      txn.amount = txnForEnc.amt;
      txn.to = address.decodeAddress(
        address.encodeAddress(new Uint8Array(txnForEnc.rcv))
      );
      if (txnForEnc.close !== undefined)
        txn.closeRemainderTo = address.decodeAddress(
          address.encodeAddress(txnForEnc.close)
        );
    } else if (txnForEnc.type === 'keyreg') {
      if (txnForEnc.votekey !== undefined) {
        txn.voteKey = Buffer.from(txnForEnc.votekey);
      }
      if (txnForEnc.selkey !== undefined) {
        txn.selectionKey = Buffer.from(txnForEnc.selkey);
      }
      if (txnForEnc.sprfkey !== undefined) {
        txn.stateProofKey = Buffer.from(txnForEnc.sprfkey);
      }
      if (txnForEnc.votekd !== undefined) {
        txn.voteKeyDilution = txnForEnc.votekd;
      }
      if (txnForEnc.votefst !== undefined) {
        txn.voteFirst = txnForEnc.votefst;
      }
      if (txnForEnc.votelst !== undefined) {
        txn.voteLast = txnForEnc.votelst;
      }
      if (txnForEnc.nonpart !== undefined) {
        txn.nonParticipation = txnForEnc.nonpart;
      }
    } else if (txnForEnc.type === 'acfg') {
      // asset creation, or asset reconfigure, or asset destruction
      if (txnForEnc.caid !== undefined) {
        txn.assetIndex = txnForEnc.caid;
      }
      if (txnForEnc.apar !== undefined) {
        txn.assetTotal = txnForEnc.apar.t;
        txn.assetDefaultFrozen = txnForEnc.apar.df;
        if (txnForEnc.apar.dc !== undefined)
          txn.assetDecimals = txnForEnc.apar.dc;
        if (txnForEnc.apar.m !== undefined)
          txn.assetManager = address.decodeAddress(
            address.encodeAddress(new Uint8Array(txnForEnc.apar.m))
          );
        if (txnForEnc.apar.r !== undefined)
          txn.assetReserve = address.decodeAddress(
            address.encodeAddress(new Uint8Array(txnForEnc.apar.r))
          );
        if (txnForEnc.apar.f !== undefined)
          txn.assetFreeze = address.decodeAddress(
            address.encodeAddress(new Uint8Array(txnForEnc.apar.f))
          );
        if (txnForEnc.apar.c !== undefined)
          txn.assetClawback = address.decodeAddress(
            address.encodeAddress(new Uint8Array(txnForEnc.apar.c))
          );
        if (txnForEnc.apar.un !== undefined)
          txn.assetUnitName = txnForEnc.apar.un;
        if (txnForEnc.apar.an !== undefined) txn.assetName = txnForEnc.apar.an;
        if (txnForEnc.apar.au !== undefined) txn.assetURL = txnForEnc.apar.au;
        if (txnForEnc.apar.am !== undefined)
          txn.assetMetadataHash = txnForEnc.apar.am;
      }
    } else if (txnForEnc.type === 'axfer') {
      // asset transfer, acceptance, revocation, mint, or burn
      if (txnForEnc.xaid !== undefined) {
        txn.assetIndex = txnForEnc.xaid;
      }
      if (txnForEnc.aamt !== undefined) txn.amount = txnForEnc.aamt;
      if (txnForEnc.aclose !== undefined) {
        txn.closeRemainderTo = address.decodeAddress(
          address.encodeAddress(new Uint8Array(txnForEnc.aclose))
        );
      }
      if (txnForEnc.asnd !== undefined) {
        txn.assetRevocationTarget = address.decodeAddress(
          address.encodeAddress(new Uint8Array(txnForEnc.asnd))
        );
      }
      txn.to = address.decodeAddress(
        address.encodeAddress(new Uint8Array(txnForEnc.arcv))
      );
    } else if (txnForEnc.type === 'afrz') {
      if (txnForEnc.afrz !== undefined) {
        txn.freezeState = txnForEnc.afrz;
      }
      if (txnForEnc.faid !== undefined) {
        txn.assetIndex = txnForEnc.faid;
      }
      txn.freezeAccount = address.decodeAddress(
        address.encodeAddress(new Uint8Array(txnForEnc.fadd))
      );
    } else if (txnForEnc.type === 'appl') {
      if (txnForEnc.apid !== undefined) {
        txn.appIndex = txnForEnc.apid;
      }
      if (txnForEnc.apan !== undefined) {
        txn.appOnComplete = txnForEnc.apan;
      }
      if (txnForEnc.apls !== undefined) {
        if (txnForEnc.apls.nui !== undefined)
          txn.appLocalInts = txnForEnc.apls.nui;
        if (txnForEnc.apls.nbs !== undefined)
          txn.appLocalByteSlices = txnForEnc.apls.nbs;
      }
      if (txnForEnc.apgs !== undefined) {
        if (txnForEnc.apgs.nui !== undefined)
          txn.appGlobalInts = txnForEnc.apgs.nui;
        if (txnForEnc.apgs.nbs !== undefined)
          txn.appGlobalByteSlices = txnForEnc.apgs.nbs;
      }
      if (txnForEnc.apep !== undefined) {
        txn.extraPages = txnForEnc.apep;
      }
      if (txnForEnc.apap !== undefined) {
        txn.appApprovalProgram = new Uint8Array(txnForEnc.apap);
      }
      if (txnForEnc.apsu !== undefined) {
        txn.appClearProgram = new Uint8Array(txnForEnc.apsu);
      }
      if (txnForEnc.apaa !== undefined) {
        txn.appArgs = txnForEnc.apaa.map((arg) => new Uint8Array(arg));
      }
      if (txnForEnc.apat !== undefined) {
        txn.appAccounts = txnForEnc.apat.map((addressBytes) =>
          address.decodeAddress(
            address.encodeAddress(new Uint8Array(addressBytes))
          )
        );
      }
      if (txnForEnc.apfa !== undefined) {
        txn.appForeignApps = txnForEnc.apfa;
      }
      if (txnForEnc.apas !== undefined) {
        txn.appForeignAssets = txnForEnc.apas;
      }
      if (txnForEnc.apbx !== undefined) {
        txn.boxes = txnForEnc.apbx.map((box) => ({
          // We return 0 for the app ID so that it's guaranteed translateBoxReferences will
          // translate the app index back to 0. If we instead returned the called app ID,
          // translateBoxReferences would translate the app index to a nonzero value if the called
          // app is also in the foreign app array.
          appIndex: box.i ? txn.appForeignApps[box.i - 1] : 0,
          name: box.n,
        }));
      }
    } else if (txnForEnc.type === 'stpf') {
      if (txnForEnc.sptype !== undefined) {
        txn.stateProofType = txnForEnc.sptype;
      }
      if (txnForEnc.sp !== undefined) {
        txn.stateProof = txnForEnc.sp;
      }
      if (txnForEnc.spmsg !== undefined) {
        txn.stateProofMessage = txnForEnc.spmsg;
      }
    }
    return txn;
  }

  estimateSize() {
    return this.toByte().length + NUM_ADDL_BYTES_AFTER_SIGNING;
  }

  bytesToSign() {
    const encodedMsg = this.toByte();
    return Buffer.from(utils.concatArrays(this.tag, encodedMsg));
  }

  toByte() {
    return encoding.encode(this.get_obj_for_encoding());
  }

  // returns the raw signature
  rawSignTxn(sk: Uint8Array) {
    const toBeSigned = this.bytesToSign();
    const sig = nacl.sign(toBeSigned, sk);
    return Buffer.from(sig);
  }

  signTxn(sk: Uint8Array) {
    // construct signed message
    const sTxn: EncodedSignedTransaction = {
      sig: this.rawSignTxn(sk),
      txn: this.get_obj_for_encoding(),
    };
    // add AuthAddr if signing with a different key than From indicates
    const keypair = nacl.keyPairFromSecretKey(sk);
    const pubKeyFromSk = keypair.publicKey;
    if (
      address.encodeAddress(pubKeyFromSk) !==
      address.encodeAddress(this.from.publicKey)
    ) {
      sTxn.sgnr = Buffer.from(pubKeyFromSk);
    }
    return new Uint8Array(encoding.encode(sTxn));
  }

  attachSignature(signerAddr: string, signature: Uint8Array) {
    if (!nacl.isValidSignatureLength(signature.length)) {
      throw new Error('Invalid signature length');
    }
    const sTxn: EncodedSignedTransaction = {
      sig: Buffer.from(signature),
      txn: this.get_obj_for_encoding(),
    };
    // add AuthAddr if signing with a different key than From indicates
    if (signerAddr !== address.encodeAddress(this.from.publicKey)) {
      const signerPublicKey = address.decodeAddress(signerAddr).publicKey;
      sTxn.sgnr = Buffer.from(signerPublicKey);
    }
    return new Uint8Array(encoding.encode(sTxn));
  }

  rawTxID() {
    const enMsg = this.toByte();
    const gh = Buffer.from(utils.concatArrays(this.tag, enMsg));
    return Buffer.from(nacl.genericHash(gh));
  }

  txID() {
    const hash = this.rawTxID();
    return base32.encode(hash).slice(0, ALGORAND_TRANSACTION_LENGTH);
  }

  // add a lease to a transaction not yet having
  // supply feePerByte to increment fee accordingly
  addLease(lease: Uint8Array, feePerByte = 0) {
    let mutableLease: Uint8Array;

    if (lease !== undefined) {
      if (lease.constructor !== Uint8Array)
        throw Error('lease must be a Uint8Array.');
      if (lease.length !== ALGORAND_TRANSACTION_LEASE_LENGTH)
        throw Error(
          `lease must be of length ${ALGORAND_TRANSACTION_LEASE_LENGTH.toString()}.`
        );

      mutableLease = new Uint8Array(lease);
    } else {
      mutableLease = new Uint8Array(0);
    }
    this.lease = mutableLease;
    if (feePerByte !== 0) {
      this.fee +=
        (ALGORAND_TRANSACTION_LEASE_LABEL_LENGTH +
          ALGORAND_TRANSACTION_LEASE_LENGTH) *
        feePerByte;
    }
  }

  // add the rekey-to field to a transaction not yet having it
  // supply feePerByte to increment fee accordingly
  addRekey(reKeyTo: string, feePerByte = 0) {
    if (reKeyTo !== undefined) {
      this.reKeyTo = address.decodeAddress(reKeyTo);
    }
    if (feePerByte !== 0) {
      this.fee +=
        (ALGORAND_TRANSACTION_REKEY_LABEL_LENGTH +
          ALGORAND_TRANSACTION_ADDRESS_LENGTH) *
        feePerByte;
    }
  }

  // build display dict for prettyPrint and toString
  // eslint-disable-next-line no-underscore-dangle
  _getDictForDisplay() {
    const forPrinting: TransactionStorageStructure & Record<string, any> = {
      ...this,
    };
    forPrinting.tag = forPrinting.tag.toString();
    forPrinting.from = address.encodeAddress(
      (forPrinting.from as Address).publicKey
    );
    if (forPrinting.to !== undefined)
      forPrinting.to = address.encodeAddress(
        (forPrinting.to as Address).publicKey
      );
    // things that need fixing:
    if (forPrinting.freezeAccount !== undefined)
      forPrinting.freezeAccount = address.encodeAddress(
        (forPrinting.freezeAccount as Address).publicKey
      );
    if (forPrinting.closeRemainderTo !== undefined)
      forPrinting.closeRemainderTo = address.encodeAddress(
        (forPrinting.closeRemainderTo as Address).publicKey
      );
    if (forPrinting.assetManager !== undefined)
      forPrinting.assetManager = address.encodeAddress(
        (forPrinting.assetManager as Address).publicKey
      );
    if (forPrinting.assetReserve !== undefined)
      forPrinting.assetReserve = address.encodeAddress(
        (forPrinting.assetReserve as Address).publicKey
      );
    if (forPrinting.assetFreeze !== undefined)
      forPrinting.assetFreeze = address.encodeAddress(
        (forPrinting.assetFreeze as Address).publicKey
      );
    if (forPrinting.assetClawback !== undefined)
      forPrinting.assetClawback = address.encodeAddress(
        (forPrinting.assetClawback as Address).publicKey
      );
    if (forPrinting.assetRevocationTarget !== undefined)
      forPrinting.assetRevocationTarget = address.encodeAddress(
        (forPrinting.assetRevocationTarget as Address).publicKey
      );
    if (forPrinting.reKeyTo !== undefined)
      forPrinting.reKeyTo = address.encodeAddress(
        (forPrinting.reKeyTo as Address).publicKey
      );
    forPrinting.genesisHash = forPrinting.genesisHash.toString('base64');
    return forPrinting;
  }

  // pretty print the transaction to console
  prettyPrint() {
    // eslint-disable-next-line no-underscore-dangle,no-console
    console.log(this._getDictForDisplay());
  }

  // get string representation
  toString() {
    // eslint-disable-next-line no-underscore-dangle
    return JSON.stringify(this._getDictForDisplay());
  }
}

/**
 * encodeUnsignedTransaction takes a completed txnBuilder.Transaction object, such as from the makeFoo
 * family of transactions, and converts it to a Buffer
 * @param transactionObject - the completed Transaction object
 */
export function encodeUnsignedTransaction(transactionObject: Transaction) {
  const objToEncode = transactionObject.get_obj_for_encoding();
  return encoding.encode(objToEncode);
}

/**
 * decodeUnsignedTransaction takes a Buffer (as if from encodeUnsignedTransaction) and converts it to a txnBuilder.Transaction object
 * @param transactionBuffer - the Uint8Array containing a transaction
 */
export function decodeUnsignedTransaction(
  transactionBuffer: ArrayLike<number>
) {
  const partlyDecodedObject = encoding.decode(
    transactionBuffer
  ) as EncodedTransaction;
  return Transaction.from_obj_for_encoding(partlyDecodedObject);
}

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
export function decodeSignedTransaction(
  transactionBuffer: Uint8Array
): SignedTransaction {
  const stxnDecoded = encoding.decode(
    transactionBuffer
  ) as EncodedSignedTransaction;
  const stxn: SignedTransaction = {
    ...stxnDecoded,
    txn: Transaction.from_obj_for_encoding(stxnDecoded.txn),
  };
  return stxn;
}

/**
 * Either a valid transaction object or an instance of the Transaction class
 */
export type TransactionLike = AnyTransaction | Transaction;

export function instantiateTxnIfNeeded(transactionLike: TransactionLike) {
  return transactionLike instanceof Transaction
    ? transactionLike
    : new Transaction(transactionLike);
}

export default Transaction;
