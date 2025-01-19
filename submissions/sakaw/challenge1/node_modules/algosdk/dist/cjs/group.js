"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignGroupID = exports.computeGroupID = exports.TxGroup = void 0;
const txnBuilder = __importStar(require("./transaction"));
const nacl = __importStar(require("./nacl/naclWrappers"));
const encoding = __importStar(require("./encoding/encoding"));
const address = __importStar(require("./encoding/address"));
const utils = __importStar(require("./utils/utils"));
const ALGORAND_MAX_TX_GROUP_SIZE = 16;
/**
 * Aux class for group id calculation of a group of transactions
 */
class TxGroup {
    constructor(hashes) {
        this.name = 'Transaction group';
        this.tag = Buffer.from('TG');
        if (hashes.length > ALGORAND_MAX_TX_GROUP_SIZE) {
            const errorMsg = `${hashes.length.toString()} transactions grouped together but max group size is ${ALGORAND_MAX_TX_GROUP_SIZE.toString()}`;
            throw Error(errorMsg);
        }
        this.txGroupHashes = hashes;
    }
    // eslint-disable-next-line camelcase
    get_obj_for_encoding() {
        const txgroup = {
            txlist: this.txGroupHashes,
        };
        return txgroup;
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(txgroupForEnc) {
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
exports.TxGroup = TxGroup;
/**
 * computeGroupID returns group ID for a group of transactions
 * @param txns - array of transactions (every element is a dict or Transaction)
 * @returns Buffer
 */
function computeGroupID(txns) {
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
exports.computeGroupID = computeGroupID;
/**
 * assignGroupID assigns group id to a given list of unsigned transactions
 * @param txns - array of transactions (every element is a dict or Transaction)
 * @param from - optional sender address specifying which transaction return
 * @returns possible list of matching transactions
 */
function assignGroupID(txns, from) {
    const gid = computeGroupID(txns);
    const result = [];
    for (const txn of txns) {
        const tx = txnBuilder.instantiateTxnIfNeeded(txn);
        if (!from || address.encodeAddress(tx.from.publicKey) === from) {
            tx.group = gid;
            result.push(tx);
        }
    }
    return result;
}
exports.assignGroupID = assignGroupID;
exports.default = TxGroup;
//# sourceMappingURL=group.js.map