export class DynamicFee {
    /**
     * DynamicFee contract allows you to create a transaction without
     * specifying the fee. The fee will be determined at the moment of
     * transfer.
     *
     * @deprecated This feature will be removed in v2.
     *
     * Constructor Parameters:
     * @param {string} receiver: address to receive the assets
     * @param {int} amount: amount of assets to transfer
     * @param {int} firstValid: first valid round for the transaction
     * @param {int} lastValid:  last valid round for the transaction
     * @param {string} closeRemainder: if you would like to close the account after the transfer, specify the address that would recieve the remainder, else leave undefined
     * @param {string} lease: leave undefined to generate a random lease, or supply a lease as base64
     * @returns {DynamicFee}
     */
    constructor(receiver: string, amount: int, firstValid: int, lastValid: int, closeRemainder: string, lease: string);
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
 * getDynamicFeeTransactions creates and signs the secondary dynamic fee transaction, updates
 * transaction fields, and signs as the fee payer; it returns both
 * transactions as bytes suitable for sendRaw.
 *
 * @deprecated This feature will be removed in v2.
 *
 * Parameters:
 * @param {dict} txn - main transaction from payer's signDynamicFee output (a dict of constructor arguments, NOT a transaction.Transaction)
 * @param {LogicSig} lsig - the signed logic received from the payer's signDynamicFee output
 * @param {Uint8Array} privateKey - the private key for the account that pays the fee
 * @param {int} fee - fee per byte for both transactions
 *
 * @throws on invalid lsig
 */
export function getDynamicFeeTransactions(txn: dict, lsig: LogicSig, privateKey: Uint8Array, fee: int): Uint8Array;
/**
 * signDynamicFee returns the main transaction and signed logic needed to complete the transfer.
 * These should be sent to the fee payer, who can use GetDynamicFeeTransactions
 *
 * @deprecated This feature will be removed in v2.
 *
 * @param {Uint8Array} contract: the bytearray representing the contract
 * @param {Uint8Array} secretKey: the secret key for building the logic sig
 * @param {string} genesisHash: the genesisHash to use for the txn
 * @returns {Object} object containing json of txnbuilder constructor arguments under "txn" and signed logicsig under "lsig"
 */
export function signDynamicFee(contract: Uint8Array, secretKey: Uint8Array, genesisHash: string): any;
