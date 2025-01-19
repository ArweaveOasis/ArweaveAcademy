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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
const encoding = __importStar(require("../../../encoding/encoding"));
/**
 * returns the transaction information for a specific txid of a pending transaction
 */
class PendingTransactionInformation extends jsonrequest_1.default {
    constructor(c, txid) {
        super(c);
        this.txid = txid;
        this.txid = txid;
        this.query.format = 'msgpack';
    }
    // eslint-disable-next-line class-methods-use-this
    prepare(body) {
        if (body && body.byteLength > 0) {
            return encoding.decode(body);
        }
        return undefined;
    }
    path() {
        return `/v2/transactions/pending/${this.txid}`;
    }
    // max sets the maximum number of txs to return
    max(max) {
        this.query.max = max;
        return this;
    }
}
exports.default = PendingTransactionInformation;
//# sourceMappingURL=pendingTransactionInformation.js.map