/**
 * Enum for application transaction types.
 *
 * The full list is available at https://developer.algorand.org/docs/reference/transactions/
 */
export var TransactionType;
(function (TransactionType) {
    /**
     * Payment transaction
     */
    TransactionType["pay"] = "pay";
    /**
     * Key registration transaction
     */
    TransactionType["keyreg"] = "keyreg";
    /**
     * Asset configuration transaction
     */
    TransactionType["acfg"] = "acfg";
    /**
     * Asset transfer transaction
     */
    TransactionType["axfer"] = "axfer";
    /**
     * Asset freeze transaction
     */
    TransactionType["afrz"] = "afrz";
    /**
     * Application transaction
     */
    TransactionType["appl"] = "appl";
    /**
     * State proof transaction
     */
    TransactionType["stpf"] = "stpf";
})(TransactionType || (TransactionType = {}));
export function isTransactionType(s) {
    return (s === TransactionType.pay ||
        s === TransactionType.keyreg ||
        s === TransactionType.acfg ||
        s === TransactionType.axfer ||
        s === TransactionType.afrz ||
        s === TransactionType.appl ||
        s === TransactionType.stpf);
}
/**
 * Enums for application transactions on-transaction-complete behavior
 */
export var OnApplicationComplete;
(function (OnApplicationComplete) {
    /**
     * NoOpOC indicates that an application transaction will simply call its
     * ApprovalProgram
     */
    OnApplicationComplete[OnApplicationComplete["NoOpOC"] = 0] = "NoOpOC";
    /**
     * OptInOC indicates that an application transaction will allocate some
     * LocalState for the application in the sender's account
     */
    OnApplicationComplete[OnApplicationComplete["OptInOC"] = 1] = "OptInOC";
    /**
     * CloseOutOC indicates that an application transaction will deallocate
     * some LocalState for the application from the user's account
     */
    OnApplicationComplete[OnApplicationComplete["CloseOutOC"] = 2] = "CloseOutOC";
    /**
     * ClearStateOC is similar to CloseOutOC, but may never fail. This
     * allows users to reclaim their minimum balance from an application
     * they no longer wish to opt in to.
     */
    OnApplicationComplete[OnApplicationComplete["ClearStateOC"] = 3] = "ClearStateOC";
    /**
     * UpdateApplicationOC indicates that an application transaction will
     * update the ApprovalProgram and ClearStateProgram for the application
     */
    OnApplicationComplete[OnApplicationComplete["UpdateApplicationOC"] = 4] = "UpdateApplicationOC";
    /**
     * DeleteApplicationOC indicates that an application transaction will
     * delete the AppParams for the application from the creator's balance
     * record
     */
    OnApplicationComplete[OnApplicationComplete["DeleteApplicationOC"] = 5] = "DeleteApplicationOC";
})(OnApplicationComplete || (OnApplicationComplete = {}));
//# sourceMappingURL=base.js.map