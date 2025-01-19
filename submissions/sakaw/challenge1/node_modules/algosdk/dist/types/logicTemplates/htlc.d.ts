export class HTLC {
    /**
     * HTLC allows a user to receive the Algo prior to a deadline (in terms of a round) by proving a knowledge
     * of a special value or to forfeit the ability to claim, returning it to the payer.
     * This contract is usually used to perform cross-chained atomic swaps
     *
     * More formally -
     * Algos can be transferred under only two circumstances:
     * 1. To receiver if hash_function(arg_0) = hash_value
     * 2. To owner if txn.FirstValid > expiry_round
     * ...
     *
     * @deprecated This feature will be removed in v2.
     *
     *Parameters
     *----------
     * @param {string} owner: an address that can receive the asset after the expiry round
     * @param {string} receiver: address to receive Algos
     * @param {string} hashFunction: the hash function to be used (must be either sha256 or keccak256)
     * @param {string} hashImage: the hash image in base64
     * @param {int} expiryRound: the round on which the assets can be transferred back to owner
     * @param {int} maxFee: the maximum fee that can be paid to the network by the account
     * @returns {HTLC}
     */
    constructor(owner: string, receiver: string, hashFunction: string, hashImage: string, expiryRound: int, maxFee: int);
    programBytes: any;
    address: string;
    /**
     * returns the program bytes
     * @returns {Uint8Array}
     */
    getProgram(): Uint8Array;
    /**
     * returns the string address of the contract
     * @returns {string}
     */
    getAddress(): string;
}
/**
 *  signTransactionWithHTLCUnlock accepts a transaction, such as a payment, and builds the HTLC-unlocking signature around that transaction
 *
 * @deprecated This feature will be removed in v2.
 *
 * @param {Uint8Array} contract : byte representation of the HTLC
 * @param {Object} txn dictionary containing constructor arguments for a transaction
 * @param {string} preImageAsBase64 : preimage of the hash as base64 string
 *
 * @returns {Object} Object containing txID and blob representing signed transaction.
 * @throws error on validation failure
 */
export function signTransactionWithHTLCUnlock(contract: Uint8Array, txn: any, preImageAsBase64: string): any;
