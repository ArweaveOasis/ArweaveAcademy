import * as txnBuilder from './transaction';
import { BidOptions } from './bid';
export declare const MULTISIG_BAD_SENDER_ERROR_MSG = "The transaction sender address and multisig preimage do not match.";
/**
 * signTransaction takes an object with either payment or key registration fields and
 * a secret key and returns a signed blob.
 *
 * Payment transaction fields: from, to, amount, fee, firstRound, lastRound, genesisHash,
 * note(optional), GenesisID(optional), closeRemainderTo(optional)
 *
 * Key registration fields: fee, firstRound, lastRound, voteKey, selectionKey, voteFirst,
 * voteLast, voteKeyDilution, genesisHash, note(optional), GenesisID(optional)
 *
 * If flatFee is not set and the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 * @param txn - object with either payment or key registration fields
 * @param sk - Algorand Secret Key
 * @returns object contains the binary signed transaction and its txID
 */
export declare function signTransaction(txn: txnBuilder.TransactionLike, sk: Uint8Array): {
    txID: string;
    blob: Uint8Array;
};
/**
 * signBid takes an object with the following fields: bidder key, bid amount, max price, bid ID, auctionKey, auction ID,
 * and a secret key and returns a signed blob to be inserted into a transaction Algorand note field.
 * @param bid - Algorand Bid
 * @param sk - Algorand secret key
 * @returns Uint8Array binary signed bid
 */
export declare function signBid(bid: BidOptions, sk: Uint8Array): Uint8Array;
/**
 * signBytes takes arbitrary bytes and a secret key, prepends the bytes with "MX" for domain separation, signs the bytes
 * with the private key, and returns the signature.
 * @param bytes - Uint8array
 * @param sk - Algorand secret key
 * @returns binary signature
 */
export declare function signBytes(bytes: Uint8Array, sk: Uint8Array): Uint8Array;
/**
 * verifyBytes takes array of bytes, an address, and a signature and verifies if the signature is correct for the public
 * key and the bytes (the bytes should have been signed with "MX" prepended for domain separation).
 * @param bytes - Uint8Array
 * @param signature - binary signature
 * @param addr - string address
 * @returns bool
 */
export declare function verifyBytes(bytes: Uint8Array, signature: Uint8Array, addr: string): boolean;
/**
 * encodeObj takes a javascript object and returns its msgpack encoding
 * Note that the encoding sorts the fields alphabetically
 * @param o - js obj
 * @returns Uint8Array binary representation
 */
export declare function encodeObj(o: Record<string | number | symbol, any>): Uint8Array;
/**
 * decodeObj takes a Uint8Array and returns its javascript obj
 * @param o - Uint8Array to decode
 * @returns object
 */
export declare function decodeObj(o: ArrayLike<number>): unknown;
export declare const ERROR_MULTISIG_BAD_SENDER: Error;
export declare const ERROR_INVALID_MICROALGOS: Error;
export * from './client/algod';
export { default as Algodv2 } from './client/v2/algod/algod';
export { default as Kmd } from './client/kmd';
export { default as IntDecoding } from './types/intDecoding';
export { default as Account } from './types/account';
export { default as Indexer } from './client/v2/indexer/indexer';
export { BaseHTTPClient, BaseHTTPClientResponse, BaseHTTPClientError, } from './client/baseHTTPClient';
export { waitForConfirmation } from './wait';
export { isValidAddress, encodeAddress, decodeAddress, getApplicationAddress, } from './encoding/address';
export { bytesToBigInt, bigIntToBytes } from './encoding/bigint';
export { encodeUint64, decodeUint64 } from './encoding/uint64';
export { default as generateAccount } from './account';
export * as modelsv2 from './client/v2/algod/models/types';
export * as indexerModels from './client/v2/indexer/models/types';
export { mnemonicToMasterDerivationKey, masterDerivationKeyToMnemonic, secretKeyToMnemonic, mnemonicToSecretKey, seedFromMnemonic, mnemonicFromSeed, } from './mnemonic/mnemonic';
export { microalgosToAlgos, algosToMicroalgos, INVALID_MICROALGOS_ERROR_MSG, } from './convert';
export { computeGroupID, assignGroupID } from './group';
export { LogicSigAccount, makeLogicSig, signLogicSigTransaction, signLogicSigTransactionObject, logicSigFromByte, tealSign, tealSignFromProgram, } from './logicsig';
export { signMultisigTransaction, mergeMultisigTransactions, appendSignMultisigTransaction, createMultisigTransaction, appendSignRawMultisigSignature, verifyMultisig, multisigAddress, } from './multisig';
export { SourceMap } from './logic/sourcemap';
export declare const LogicTemplates: any;
export * from './dryrun';
export * from './makeTxn';
export * from './transaction';
export * from './signer';
export * from './composer';
export * from './types';
export * from './abi';
