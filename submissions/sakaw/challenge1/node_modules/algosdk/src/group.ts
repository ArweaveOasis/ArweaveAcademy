import * as txnBuilder from './transaction';
import * as nacl from './nacl/naclWrappers';
import * as encoding from './encoding/encoding';
import * as address from './encoding/address';
import * as utils from './utils/utils';

const ALGORAND_MAX_TX_GROUP_SIZE = 16;

interface EncodedTxGroup {
  txlist: Buffer[];
}

/**
 * Aux class for group id calculation of a group of transactions
 */
export class TxGroup {
  name = 'Transaction group';
  tag = Buffer.from('TG');
  txGroupHashes: Buffer[];

  constructor(hashes: Buffer[]) {
    if (hashes.length > ALGORAND_MAX_TX_GROUP_SIZE) {
      const errorMsg = `${hashes.length.toString()} transactions grouped together but max group size is ${ALGORAND_MAX_TX_GROUP_SIZE.toString()}`;
      throw Error(errorMsg);
    }

    this.txGroupHashes = hashes;
  }

  // eslint-disable-next-line camelcase
  get_obj_for_encoding() {
    const txgroup: EncodedTxGroup = {
      txlist: this.txGroupHashes,
    };
    return txgroup;
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(txgroupForEnc: EncodedTxGroup) {
    const txn = Object.create(this.prototype);
    txn.name = 'Transaction group';
    txn.tag = Buffer.from('TG');
    txn.txGroupHashes = [];
    for (const hash of txgroupForEnc.txlist) {
      txn.txGroupHashes.push(Buffer.from(hash));
    }
    return txn;
  }

  toByte() {
    return encoding.encode(this.get_obj_for_encoding());
  }
}

/**
 * computeGroupID returns group ID for a group of transactions
 * @param txns - array of transactions (every element is a dict or Transaction)
 * @returns Buffer
 */
export function computeGroupID(txns: txnBuilder.TransactionLike[]) {
  const hashes = [];
  for (const txn of txns) {
    const tx = txnBuilder.instantiateTxnIfNeeded(txn);
    hashes.push(tx.rawTxID());
  }

  const txgroup = new TxGroup(hashes);

  const bytes = txgroup.toByte();
  const toBeHashed = Buffer.from(utils.concatArrays(txgroup.tag, bytes));
  const gid = nacl.genericHash(toBeHashed);
  return Buffer.from(gid);
}

/**
 * assignGroupID assigns group id to a given list of unsigned transactions
 * @param txns - array of transactions (every element is a dict or Transaction)
 * @param from - optional sender address specifying which transaction return
 * @returns possible list of matching transactions
 */
export function assignGroupID(
  txns: txnBuilder.TransactionLike[],
  from?: string
) {
  const gid = computeGroupID(txns);
  const result: txnBuilder.Transaction[] = [];
  for (const txn of txns) {
    const tx = txnBuilder.instantiateTxnIfNeeded(txn);
    if (!from || address.encodeAddress(tx.from.publicKey) === from) {
      tx.group = gid;
      result.push(tx);
    }
  }
  return result;
}

export default TxGroup;
