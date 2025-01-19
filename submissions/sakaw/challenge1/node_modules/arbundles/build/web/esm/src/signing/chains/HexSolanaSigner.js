import SolanaSigner from "./SolanaSigner.js";
export default class HexSolanaSigner extends SolanaSigner {
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
//# sourceMappingURL=HexSolanaSigner.js.map