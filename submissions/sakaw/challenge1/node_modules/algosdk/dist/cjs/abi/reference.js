"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abiTypeIsReference = exports.ABIReferenceType = void 0;
var ABIReferenceType;
(function (ABIReferenceType) {
    /**
     * Account reference type
     */
    ABIReferenceType["account"] = "account";
    /**
     * Application reference type
     */
    ABIReferenceType["application"] = "application";
    /**
     * Asset reference type
     */
    ABIReferenceType["asset"] = "asset";
})(ABIReferenceType = exports.ABIReferenceType || (exports.ABIReferenceType = {}));
function abiTypeIsReference(type) {
    return (type === ABIReferenceType.account ||
        type === ABIReferenceType.application ||
        type === ABIReferenceType.asset);
}
exports.abiTypeIsReference = abiTypeIsReference;
//# sourceMappingURL=reference.js.map