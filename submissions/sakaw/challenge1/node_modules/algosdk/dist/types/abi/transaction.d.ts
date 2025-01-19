import { Transaction } from '../transaction';
export declare enum ABITransactionType {
    /**
     * Any transaction type
     */
    any = "txn",
    /**
     * Payment transaction type
     */
    pay = "pay",
    /**
     * Key registration transaction type
     */
    keyreg = "keyreg",
    /**
     * Asset configuration transaction type
     */
    acfg = "acfg",
    /**
     * Asset transfer transaction type
     */
    axfer = "axfer",
    /**
     * Asset freeze transaction type
     */
    afrz = "afrz",
    /**
     * Application transaction type
     */
    appl = "appl"
}
export declare function abiTypeIsTransaction(type: any): type is ABITransactionType;
export declare function abiCheckTransactionType(type: ABITransactionType, txn: Transaction): boolean;
