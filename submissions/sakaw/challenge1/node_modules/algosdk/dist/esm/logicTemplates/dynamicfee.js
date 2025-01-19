const address = require('../encoding/address');
const encoding = require('../encoding/encoding');
const group = require('../group');
const logic = require('../logic/logic');
const logicSig = require('../logicsig');
const nacl = require('../nacl/naclWrappers');
const templates = require('./templates');
const transaction = require('../transaction');
class DynamicFee {
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
    constructor(receiver, amount, firstValid, lastValid, closeRemainder, lease) {
        // don't need to validate receiver, closeremainderto - insert will handle that
        if (!Number.isSafeInteger(amount) || amount < 0)
            throw Error('amount must be a positive number and smaller than 2^53-1');
        if (!Number.isSafeInteger(firstValid) || firstValid < 0)
            throw Error('firstValid must be a positive number and smaller than 2^53-1');
        if (!Number.isSafeInteger(lastValid) || lastValid < 0)
            throw Error('lastValid must be a positive number and smaller than 2^53-1');
        if (typeof closeRemainder === 'undefined') {
            // eslint-disable-next-line no-param-reassign
            closeRemainder = address.ALGORAND_ZERO_ADDRESS_STRING;
        }
        if (typeof lease === 'undefined') {
            const leaseBytes = nacl.randomBytes(32);
            // eslint-disable-next-line no-param-reassign
            lease = Buffer.from(leaseBytes).toString('base64');
        }
        const referenceProgramB64 = 'ASAFAgEHBgUmAyD+vKC7FEpaTqe0OKRoGsgObKEFvLYH/FZTJclWlfaiEyDmmpYeby1feshmB5JlUr6YI17TM2PKiJGLuck4qRW2+SB/g7Flf/H8U7ktwYFIodZd/C1LH6PWdyhK3dIAEm2QaTIEIhIzABAjEhAzAAcxABIQMwAIMQESEDEWIxIQMRAjEhAxBygSEDEJKRIQMQgkEhAxAiUSEDEEIQQSEDEGKhIQ';
        const referenceProgramBytes = Buffer.from(referenceProgramB64, 'base64');
        const referenceOffsets = [
            5 /* firstValid */,
            6 /* lastValid */,
            7 /* receiver */,
            11 /* closeRemainder */,
            44 /* lease */,
            76,
        ];
        const injectionVector = [
            amount,
            firstValid,
            lastValid,
            receiver,
            closeRemainder,
            lease,
        ];
        const injectionTypes = [
            templates.valTypes.INT,
            templates.valTypes.INT,
            templates.valTypes.INT,
            templates.valTypes.ADDRESS,
            templates.valTypes.ADDRESS,
            templates.valTypes.BASE64,
        ];
        const injectedBytes = templates.inject(referenceProgramBytes, referenceOffsets, injectionVector, injectionTypes);
        this.programBytes = injectedBytes;
        const lsig = new logicSig.LogicSig(injectedBytes, undefined);
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
function signDynamicFee(contract, secretKey, genesisHash) {
    const programOutputs = logic.readProgram(contract, undefined);
    const ints = programOutputs[0];
    const byteArrays = programOutputs[1];
    const keys = nacl.keyPairFromSecretKey(secretKey);
    const from = address.encodeAddress(keys.publicKey);
    const to = address.encodeAddress(byteArrays[0]);
    const fee = 0;
    const amount = ints[2];
    const closeRemainderTo = address.encodeAddress(byteArrays[1]);
    const firstRound = ints[3];
    const lastRound = ints[4];
    const lease = new Uint8Array(byteArrays[2]);
    const txn = {
        from,
        to,
        fee,
        amount,
        closeRemainderTo,
        firstRound,
        lastRound,
        genesisHash,
        type: 'pay',
        lease,
    };
    const lsig = new logicSig.LogicSig(contract, undefined);
    lsig.sign(secretKey);
    return { txn, lsig };
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
/* eslint-disable no-param-reassign */
function getDynamicFeeTransactions(txn, lsig, privateKey, fee) {
    if (!lsig.verify(address.decodeAddress(txn.from).publicKey)) {
        throw new Error('invalid signature');
    }
    txn.fee = fee;
    if (txn.fee < transaction.ALGORAND_MIN_TX_FEE) {
        txn.fee = transaction.ALGORAND_MIN_TX_FEE;
    }
    const keys = nacl.keyPairFromSecretKey(privateKey);
    const from = address.encodeAddress(keys.publicKey);
    // must remove lease and re-add using addLease so that fee calculation will match other SDKs
    const { lease } = txn;
    delete txn.lease;
    const txnObj = new transaction.Transaction(txn);
    txnObj.addLease(lease, fee);
    const feePayTxn = {
        from,
        to: txn.from,
        fee,
        amount: txnObj.fee,
        firstRound: txn.firstRound,
        lastRound: txn.lastRound,
        genesisHash: txn.genesisHash,
        type: 'pay',
    };
    const feePayTxnObj = new transaction.Transaction(feePayTxn);
    feePayTxnObj.addLease(lease, fee);
    const txnGroup = group.assignGroupID([feePayTxnObj, txnObj], undefined);
    const feePayTxnWithGroup = txnGroup[0];
    const txnObjWithGroup = txnGroup[1];
    const lstx = {
        lsig: lsig.get_obj_for_encoding(),
        txn: txnObjWithGroup.get_obj_for_encoding(),
    };
    const stx1 = feePayTxnWithGroup.signTxn(privateKey);
    const stx2 = encoding.encode(lstx);
    const concatStx = new Uint8Array(stx1.length + stx2.length);
    concatStx.set(stx1);
    concatStx.set(stx2, stx1.length);
    return concatStx;
}
/* eslint-enable no-param-reassign */
module.exports = {
    DynamicFee,
    getDynamicFeeTransactions,
    signDynamicFee,
};
//# sourceMappingURL=dynamicfee.js.map