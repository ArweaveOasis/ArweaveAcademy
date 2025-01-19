import base64url from "base64url";
import { SIG_CONFIG } from "../../constants.js";
import { verify } from "@noble/ed25519";
export default class InjectedSolanaSigner {
    _publicKey;
    ownerLength = SIG_CONFIG[2].pubLength;
    signatureLength = SIG_CONFIG[2].sigLength;
    signatureType = 2;
    pem;
    provider;
    constructor(provider) {
        this.provider = provider;
        if (!this.provider.publicKey)
            throw new Error("InjectedSolanaSigner - provider.publicKey is undefined");
        this._publicKey = this.provider.publicKey.toBuffer();
    }
    get publicKey() {
        return this._publicKey;
    }
    async sign(message) {
        if (!this.provider.signMessage)
            throw new Error("Selected Wallet does not support message signing");
        return await this.provider.signMessage(message);
    }
    static async verify(pk, message, signature) {
        let p = pk;
        if (typeof pk === "string")
            p = base64url.toBuffer(pk);
        return verify(Buffer.from(signature), Buffer.from(message), Buffer.from(p));
    }
}
//# sourceMappingURL=injectedSolanaSigner.js.map