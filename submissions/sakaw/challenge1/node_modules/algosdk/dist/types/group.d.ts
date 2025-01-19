/// <reference types="node" />
import * as txnBuilder from './transaction';
interface EncodedTxGroup {
    txlist: Buffer[];
}
/**
 * Aux class for group id calculation of a group of transactions
 */
export declare class TxGroup {
    name: string;
    tag: Buffer;
    txGroupHashes: Buffer[];
    constructor(hashes: Buffer[]);
    get_obj_for_encoding(): EncodedTxGroup;
    static from_obj_for_encoding(txgroupForEnc: EncodedTxGroup): any;
    toByte(): Uint8Array;
}
/**
 * computeGroupID returns group ID for a group of transactions
 * @param txns - array of transactions (every element is a dict or Transaction)
 * @returns Buffer
 */
export declare function computeGroupID(txns: txnBuilder.TransactionLike[]): Buffer;
/**
 * assignGroupID assigns group id to a given list of unsigned transactions
 * @param txns - array of transactions (every element is a dict or Transaction)
 * @param from - optional sender address specifying which transaction return
 * @returns possible list of matching transactions
 */
export declare function assignGroupID(txns: txnBuilder.TransactionLike[], from?: string): txnBuilder.Transaction[];
export default TxGroup;
