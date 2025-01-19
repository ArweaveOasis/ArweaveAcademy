import InjectedSolanaSigner from "./injectedSolanaSigner.js";
export default class HexSolanaSigner extends InjectedSolanaSigner {
    signatureType = 4; // for solana sig type
    constructor(provider) {
        super(provider);
    }
    async sign(message) {
        return super.sign(Buffer.from(Buffer.from(message).toString("hex")));
    }
    static async verify(pk, message, signature) {
        return super.verify(pk, Buffer.from(Buffer.from(message).toString("hex")), signature);
    }
}
//# sourceMappingURL=HexInjectedSolanaSigner.js.map