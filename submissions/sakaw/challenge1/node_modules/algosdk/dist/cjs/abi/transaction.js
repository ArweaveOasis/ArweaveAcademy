"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abiCheckTransactionType = exports.abiTypeIsTransaction = exports.ABITransactionType = void 0;
var ABITransactionType;
(function (ABITransactionType) {
    /**
     * Any transaction type
     */
    ABITransactionType["any"] = "txn";
    /**
     * Payment transaction type
     */
    ABITransactionType["pay"] = "pay";
    /**
     * Key registration transaction type
     */
    ABITransactionType["keyreg"] = "keyreg";
    /**
     * Asset configuration transaction type
     */
    ABITransactionType["acfg"] = "acfg";
    /**
     * Asset transfer transaction type
     */
    ABITransactionType["axfer"] = "axfer";
    /**
     * Asset freeze transaction type
     */
    ABITransactionType["afrz"] = "afrz";
    /**
     * Application transaction type
     */
    ABITransactionType["appl"] = "appl";
})(ABITransactionType = exports.ABITransactionType || (exports.ABITransactionType = {}));
function abiTypeIsTransaction(type) {
    return (type === ABITransactionType.any ||
        type === ABITransactionType.pay ||
        type === ABITransactionType.keyreg ||
        type === ABITransactionType.acfg ||
        type === ABITransactionType.axfer ||
        type === ABITransactionType.afrz ||
        type === ABITransactionType.appl);
}
exports.abiTypeIsTransaction = abiTypeIsTransaction;
function abiCheckTransactionType(type, txn) {
    if (type === ABITransactionType.any) {
        return true;
    }
    return txn.type && txn.type.toString() === type.toString();
}
exports.abiCheckTransactionType = abiCheckTransactionType;
//# sourceMappingURL=transaction.js.map