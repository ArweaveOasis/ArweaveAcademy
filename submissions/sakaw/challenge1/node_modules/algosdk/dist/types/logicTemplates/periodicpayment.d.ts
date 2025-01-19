export class PeriodicPayment {
    /**
     * MakePeriodicPayment allows some account to execute periodic withdrawal of funds.
     * This is a contract account.
     *
     * This allows receiver to withdraw amount every
     * period rounds for withdrawWindow after every multiple
     * of period.
     *
     * After expiryRound, all remaining funds in the escrow
     * are available to receiver.
     *
     * @deprecated This class will be removed in v2.
     *
     * Constructor Parameters:
     * @param {string} receiver: address which is authorized to receive withdrawals
     * @param {int} amount: the amount to send each period
     * @param {int} withdrawalWindow: the duration of a withdrawal period
     * @param {int} period: the time between a pair of withdrawal periods
     * @param {int} expiryRound: the round at which the account expires
     * @param {int} maxFee: maximum fee used by the withdrawal transaction
     * @param {string} lease: b64 representation of lease to use, or leave undefined to generate one
     * @returns {PeriodicPayment}
     */
    constructor(receiver: string, amount: int, withdrawalWindow: int, period: int, expiryRound: int, maxFee: int, lease: string);
    receiver: string;
    amount: int;
    withdrawalWindow: int;
    period: int;
    expiryRound: int;
    maxFee: int;
    lease: string;
    programBytes: Uint8Array;
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
 * getPeriodicPaymentWithdrawalTransaction returns a signed transaction extracting funds form the contract
 *
 * @deprecated This feature will be removed in v2.
 *
 * @param {Uint8Array} contract: the bytearray defining the contract, received from the payer
 * @param {int} fee: the fee per byte for the transaction
 * @param {int} firstValid: the first round on which the txn will be valid
 * @param {string} genesisHash: the hash representing the network for the txn
 * @returns {Object} Object containing txID and blob representing signed transaction
 * @throws error on failure
 */
export function getPeriodicPaymentWithdrawalTransaction(contract: Uint8Array, fee: int, firstValid: int, genesisHash: string): any;
