export declare enum ABIReferenceType {
    /**
     * Account reference type
     */
    account = "account",
    /**
     * Application reference type
     */
    application = "application",
    /**
     * Asset reference type
     */
    asset = "asset"
}
export declare function abiTypeIsReference(type: any): type is ABIReferenceType;
