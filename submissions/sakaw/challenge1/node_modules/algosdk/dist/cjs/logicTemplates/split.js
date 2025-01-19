const address = require('../encoding/address');
const makeTxn = require('../makeTxn');
const group = require('../group');
const logicsig = require('../logicsig');
const logic = require('../logic/logic');
const templates = require('./templates');
const utils = require('../utils/utils');
class Split {
    /**
     * Split splits money sent to some account to two recipients at some ratio.
     * This is a contract account.
     *
     * This allows either a two-transaction group, for executing a
     * split, or single transaction, for closing the account.
     *
     * Withdrawals from this account are allowed as a group transaction which
     * sends receiverOne and receiverTwo amounts with exactly the specified ratio:
     * (rat1*amountForReceiverOne) = (rat2*amountForReceiverTwo)
     * At least minPay must be sent to receiverOne.
     * (CloseRemainderTo must be zero.)
     *
     * After expiryRound passes, all funds can be refunded to owner.
     *
     * @deprecated This feature will be removed in v2.
     *
     * Constructor Parameters:
     * @param {string} owner: the address to refund funds to on timeout
     * @param {string} receiverOne: the first recipient in the split account
     * @param {string} receiverTwo: the second recipient in the split account
     * @param {int} rat1: fraction of money to be paid to the 1st recipient
     * @param {int} rat2: fraction of money to be paid to the 2nd recipient
     * @param {int} expiryRound: the round at which the account expires
     * @param {int} minPay: minimum amount to be paid out of the account
     * @param {int} maxFee: half of the maximum fee used by each split forwarding group transaction
     * @returns {Split}
     */
    constructor(owner, receiverOne, receiverTwo, rat1, rat2, expiryRound, minPay, maxFee) {
        // don't need to validate owner, receiverone, receivertwo - they'll be validated by template.insert
        if (!Number.isSafeInteger(rat2) || rat2 < 0)
            throw Error('rat2 must be a positive number and smaller than 2^53-1');
        if (!Number.isSafeInteger(rat1) || rat1 < 0)
            throw Error('rat1 must be a positive number and smaller than 2^53-1');
        if (!Number.isSafeInteger(expiryRound) || expiryRound < 0)
            throw Error('expiryRound must be a positive number and smaller than 2^53-1');
        if (!Number.isSafeInteger(minPay) || minPay < 0)
            throw Error('minPay must be a positive number and smaller than 2^53-1');
        if (!Number.isSafeInteger(maxFee) || maxFee < 0)
            throw Error('maxFee must be a positive number and smaller than 2^53-1');
        const referenceProgramB64 = 'ASAIAQUCAAYHCAkmAyCztwQn0+DycN+vsk+vJWcsoz/b7NDS6i33HOkvTpf+YiC3qUpIgHGWE8/1LPh9SGCalSN7IaITeeWSXbfsS5wsXyC4kBQ38Z8zcwWVAym4S8vpFB/c0XC6R4mnPi9EBADsPDEQIhIxASMMEDIEJBJAABkxCSgSMQcyAxIQMQglEhAxAiEEDRAiQAAuMwAAMwEAEjEJMgMSEDMABykSEDMBByoSEDMACCEFCzMBCCEGCxIQMwAIIQcPEBA=';
        const referenceProgramBytes = Buffer.from(referenceProgramB64, 'base64');
        const referenceOffsets = [
            4 /* timeout */,
            7 /* rat2 */,
            8 /* rat1 */,
            9 /* minPay */,
            10 /* owner */,
            14 /* receiver1 */,
            47 /* receiver2 */,
            80,
        ];
        const injectionVector = [
            maxFee,
            expiryRound,
            rat2,
            rat1,
            minPay,
            owner,
            receiverOne,
            receiverTwo,
        ];
        const injectionTypes = [
            templates.valTypes.INT,
            templates.valTypes.INT,
            templates.valTypes.INT,
            templates.valTypes.INT,
            templates.valTypes.INT,
            templates.valTypes.ADDRESS,
            templates.valTypes.ADDRESS,
            templates.valTypes.ADDRESS,
        ];
        const injectedBytes = templates.inject(referenceProgramBytes, referenceOffsets, injectionVector, injectionTypes);
        this.programBytes = injectedBytes;
        const lsig = logicsig.makeLogicSig(injectedBytes, undefined);
        this.address = lsig.address();
    }
    /**
     * returns the program bytes
     * @returns {Uint8Array}
     */
    getProgram() {
        return this.programBytes;
    }
    /**
     * returns the string address of the contract
     * @returns {string}
     */
    getAddress() {
        return this.address;
    }
}
/**
 * returns a group transactions array which transfer funds according to the contract's ratio
 *
 * @deprecated This feature will be removed in v2.
 *
 * @param {Uint8Array} contract: bytes representing the contract in question
 * @param {int} amount: the amount to be transferred
 * @param {int} firstRound: the first round on which the transaction group will be valid
 * @param {int} lastRound: the last round on which the transaction group will be valid
 * @param {int} fee: the fee to pay in microAlgos
 * @param {string} genesisHash: the b64-encoded genesis hash indicating the network for this transaction
 * @returns {Uint8Array}
 */
function getSplitFundsTransaction(contract, amount, firstRound, lastRound, fee, genesisHash) {
    const programOutputs = logic.readProgram(contract, undefined);
    const ints = programOutputs[0];
    const byteArrays = programOutputs[1];
    let rat2 = ints[6];
    let rat1 = ints[5];
    let amountForReceiverOne = 0;
    // reduce fractions
    const gcdFn = (a, b) => {
        if (typeof a !== 'number' || typeof b !== 'number')
            throw new Error('gcd operates only on positive integers');
        if (!b) {
            return a;
        }
        return gcdFn(b, a % b);
    };
    const gcd = gcdFn(rat2, rat1);
    rat2 = Math.floor(rat2 / gcd);
    rat1 = Math.floor(rat1 / gcd);
    const ratio = rat1 / rat2;
    amountForReceiverOne = Math.round(amount / (1 + ratio));
    const amountForReceiverTwo = amount - amountForReceiverOne;
    if (rat1 * amountForReceiverOne !== rat2 * amountForReceiverTwo) {
        throw Error('could not split funds in a way that satisfied the contract ratio');
    }
    const logicSig = logicsig.makeLogicSig(contract, undefined); // no args
    const from = logicSig.address();
    const receiverOne = address.encodeAddress(byteArrays[1]);
    const receiverTwo = address.encodeAddress(byteArrays[2]);
    const tx1 = makeTxn.makePaymentTxn(from, receiverOne, fee, amountForReceiverOne, undefined, firstRound, lastRound, undefined, genesisHash);
    const tx2 = makeTxn.makePaymentTxn(from, receiverTwo, fee, amountForReceiverTwo, undefined, firstRound, lastRound, undefined, genesisHash);
    const txns = [tx1, tx2];
    const txGroup = group.assignGroupID(txns);
    const signedTxns = txGroup.map((txn) => logicsig.signLogicSigTransactionObject(txn, logicsig).blob);
    return utils.concatArrays(signedTxns[0], signedTxns[1]);
}
module.exports = {
    Split,
    getSplitFundsTransaction,
};
//# sourceMappingURL=split.js.map