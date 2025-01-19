export var ABIReferenceType;
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
})(ABIReferenceType || (ABIReferenceType = {}));
export function abiTypeIsReference(type) {
    return (type === ABIReferenceType.account ||
        type === ABIReferenceType.application ||
        type === ABIReferenceType.asset);
}
//# sourceMappingURL=reference.js.map