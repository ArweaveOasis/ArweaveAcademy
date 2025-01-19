const sha256 = require('js-sha256');
const { keccak256 } = require('js-sha3');
const logic = require('../logic/logic');
const logicSig = require('../logicsig');
const templates = require('./templates');
const transaction = require('../transaction');

class HTLC {
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
  constructor(owner, receiver, hashFunction, hashImage, expiryRound, maxFee) {
    // don't need to validate owner, receiver - they'll be validated by template.insert
    if (!Number.isSafeInteger(expiryRound) || expiryRound < 0)
      throw Error(
        'expiryRound must be a positive number and smaller than 2^53-1'
      );
    if (!Number.isSafeInteger(maxFee) || maxFee < 0)
      throw Error('maxFee must be a positive number and smaller than 2^53-1');

    let referenceProgramB64 = '';
    if (hashFunction === 'sha256') {
      referenceProgramB64 =
        'ASAECAEACSYDIOaalh5vLV96yGYHkmVSvpgjXtMzY8qIkYu5yTipFbb5IH+DsWV/8fxTuS3BgUih1l38LUsfo9Z3KErd0gASbZBpIP68oLsUSlpOp7Q4pGgayA5soQW8tgf8VlMlyVaV9qITMQEiDjEQIxIQMQcyAxIQMQgkEhAxCSgSLQEpEhAxCSoSMQIlDRAREA==';
    } else if (hashFunction === 'keccak256') {
      referenceProgramB64 =
        'ASAECAEACSYDIOaalh5vLV96yGYHkmVSvpgjXtMzY8qIkYu5yTipFbb5IH+DsWV/8fxTuS3BgUih1l38LUsfo9Z3KErd0gASbZBpIP68oLsUSlpOp7Q4pGgayA5soQW8tgf8VlMlyVaV9qITMQEiDjEQIxIQMQcyAxIQMQgkEhAxCSgSLQIpEhAxCSoSMQIlDRAREA==';
    } else {
      throw Error('hash function unrecognized');
    }
    // validate hashImage length
    const hashImageBytes = Buffer.from(hashImage, 'base64');
    if (hashImageBytes.length !== 32)
      throw Error('hash image must be 32 bytes');

    const referenceProgramBytes = Buffer.from(referenceProgramB64, 'base64');
    const referenceOffsets = [
      3 /* expiryRound */,
      6 /* receiver */,
      10 /* hashImage */,
      42 /* owner */,
      76,
    ];
    const injectionVector = [maxFee, expiryRound, receiver, hashImage, owner];
    const injectionTypes = [
      templates.valTypes.INT,
      templates.valTypes.INT,
      templates.valTypes.ADDRESS,
      templates.valTypes.BASE64,
      templates.valTypes.ADDRESS,
    ];
    const injectedBytes = templates.inject(
      referenceProgramBytes,
      referenceOffsets,
      injectionVector,
      injectionTypes
    );
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
function signTransactionWithHTLCUnlock(contract, txn, preImageAsBase64) {
  const preImageBytes = Buffer.from(preImageAsBase64, 'base64');

  // hash validation
  const readResult = logic.readProgram(contract, undefined);
  const ints = readResult[0];
  const byteArrays = readResult[1];
  const expectedHashedOutput = byteArrays[1];
  const hashFunction = contract[contract.length - 15];
  if (hashFunction === 1) {
    const hash = sha256.create();
    hash.update(preImageBytes);
    const actualHashedOutput = Buffer.from(hash.hex(), 'hex');
    if (!actualHashedOutput.equals(expectedHashedOutput)) {
      throw new Error(
        'sha256 hash of preimage did not match stored contract hash'
      );
    }
  } else if (hashFunction === 2) {
    const hash = keccak256.create();
    hash.update(preImageBytes);
    const actualHashedOutput = Buffer.from(hash.hex(), 'hex');
    if (!actualHashedOutput.equals(expectedHashedOutput)) {
      throw new Error(
        'keccak256 hash of preimage did not match stored contract hash'
      );
    }
  } else {
    throw new Error('hash function in contract unrecognized');
  }

  const args = [preImageBytes]; // array of one element, the Uint8Array preimage

  const lsig = new logicSig.LogicSig(contract, args);
  // clear out receiver just in case
  // eslint-disable-next-line no-param-reassign
  delete txn.to;

  const maxFee = ints[0];
  // check fee
  const tempTxn = new transaction.Transaction(txn);
  if (tempTxn.fee > maxFee) {
    throw new Error(
      `final fee of payment transaction${tempTxn.fee.toString()}greater than transaction max fee${maxFee.toString()}`
    );
  }

  return logicSig.signLogicSigTransaction(txn, lsig);
}

module.exports = {
  HTLC,
  signTransactionWithHTLCUnlock,
};
