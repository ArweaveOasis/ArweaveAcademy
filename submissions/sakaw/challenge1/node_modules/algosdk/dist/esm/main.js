import * as nacl from './nacl/naclWrappers';
import * as address from './encoding/address';
import * as encoding from './encoding/encoding';
import * as txnBuilder from './transaction';
import * as LogicTemplatesCommonJSExport from './logicTemplates';
import Bid from './bid';
import * as convert from './convert';
import * as utils from './utils/utils';
const SIGN_BYTES_PREFIX = Buffer.from([77, 88]); // "MX"
// Errors
export const MULTISIG_BAD_SENDER_ERROR_MSG = 'The transaction sender address and multisig preimage do not match.';
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
export function signTransaction(txn, sk) {
    if (typeof txn.from === 'undefined') {
        // Get pk from sk if no sender specified
        const key = nacl.keyPairFromSecretKey(sk);
        // eslint-disable-next-line no-param-reassign
        txn.from = address.encodeAddress(key.publicKey);
    }
    const algoTxn = txnBuilder.instantiateTxnIfNeeded(txn);
    return {
        txID: algoTxn.txID().toString(),
        blob: algoTxn.signTxn(sk),
    };
}
/**
 * signBid takes an object with the following fields: bidder key, bid amount, max price, bid ID, auctionKey, auction ID,
 * and a secret key and returns a signed blob to be inserted into a transaction Algorand note field.
 * @param bid - Algorand Bid
 * @param sk - Algorand secret key
 * @returns Uint8Array binary signed bid
 */
export function signBid(bid, sk) {
    const signedBid = new Bid(bid);
    return signedBid.signBid(sk);
}
/**
 * signBytes takes arbitrary bytes and a secret key, prepends the bytes with "MX" for domain separation, signs the bytes
 * with the private key, and returns the signature.
 * @param bytes - Uint8array
 * @param sk - Algorand secret key
 * @returns binary signature
 */
export function signBytes(bytes, sk) {
    const toBeSigned = Buffer.from(utils.concatArrays(SIGN_BYTES_PREFIX, bytes));
    const sig = nacl.sign(toBeSigned, sk);
    return sig;
}
/**
 * verifyBytes takes array of bytes, an address, and a signature and verifies if the signature is correct for the public
 * key and the bytes (the bytes should have been signed with "MX" prepended for domain separation).
 * @param bytes - Uint8Array
 * @param signature - binary signature
 * @param addr - string address
 * @returns bool
 */
export function verifyBytes(bytes, signature, addr) {
    const toBeVerified = Buffer.from(utils.concatArrays(SIGN_BYTES_PREFIX, bytes));
    const pk = address.decodeAddress(addr).publicKey;
    return nacl.verify(toBeVerified, signature, pk);
}
/**
 * encodeObj takes a javascript object and returns its msgpack encoding
 * Note that the encoding sorts the fields alphabetically
 * @param o - js obj
 * @returns Uint8Array binary representation
 */
export function encodeObj(o) {
    return new Uint8Array(encoding.encode(o));
}
/**
 * decodeObj takes a Uint8Array and returns its javascript obj
 * @param o - Uint8Array to decode
 * @returns object
 */
export function decodeObj(o) {
    return encoding.decode(o);
}
export const ERROR_MULTISIG_BAD_SENDER = new Error(MULTISIG_BAD_SENDER_ERROR_MSG);
export const ERROR_INVALID_MICROALGOS = new Error(convert.INVALID_MICROALGOS_ERROR_MSG);
export * from './client/algod';
export { default as Algodv2 } from './client/v2/algod/algod';
export { default as Kmd } from './client/kmd';
export { default as IntDecoding } from './types/intDecoding';
export { default as Indexer } from './client/v2/indexer/indexer';
export { waitForConfirmation } from './wait';
export { isValidAddress, encodeAddress, decodeAddress, getApplicationAddress, } from './encoding/address';
export { bytesToBigInt, bigIntToBytes } from './encoding/bigint';
export { encodeUint64, decodeUint64 } from './encoding/uint64';
export { default as generateAccount } from './account';
import * as modelsv2_1 from './client/v2/algod/models/types';
export { modelsv2_1 as modelsv2 };
import * as indexerModels_1 from './client/v2/indexer/models/types';
export { indexerModels_1 as indexerModels };
export { mnemonicToMasterDerivationKey, masterDerivationKeyToMnemonic, secretKeyToMnemonic, mnemonicToSecretKey, seedFromMnemonic, mnemonicFromSeed, } from './mnemonic/mnemonic';
export { microalgosToAlgos, algosToMicroalgos, INVALID_MICROALGOS_ERROR_MSG, } from './convert';
export { computeGroupID, assignGroupID } from './group';
export { LogicSigAccount, makeLogicSig, signLogicSigTransaction, signLogicSigTransactionObject, logicSigFromByte, tealSign, tealSignFromProgram, } from './logicsig';
export { signMultisigTransaction, mergeMultisigTransactions, appendSignMultisigTransaction, createMultisigTransaction, appendSignRawMultisigSignature, verifyMultisig, multisigAddress, } from './multisig';
export { SourceMap } from './logic/sourcemap';
export const LogicTemplates = LogicTemplatesCommonJSExport.default;
export * from './dryrun';
export * from './makeTxn';
export * from './transaction';
export * from './signer';
export * from './composer';
export * from './types';
export * from './abi';
//# sourceMappingURL=main.js.map