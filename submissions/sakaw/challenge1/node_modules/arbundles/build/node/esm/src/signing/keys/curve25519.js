import base64url from "base64url";
import { SIG_CONFIG } from "../../constants.js";
import { sign, verify } from "@noble/ed25519";
export default class Curve25519 {
    _key;
    pk;
    ownerLength = SIG_CONFIG[2].pubLength;
    signatureLength = SIG_CONFIG[2].sigLength;
    _publicKey;
    get publicKey() {
        return this._publicKey;
    }
    signatureType = 2;
    constructor(_key, pk) {
        this._key = _key;
        this.pk = pk;
    }
    get key() {
        throw new Error("You must implement `key`");
    }
    sign(message) {
        return sign(Buffer.from(message), Buffer.from(this.key));
    }
    static async verify(pk, message, signature) {
        let p = pk;
        if (typeof pk === "string")
            p = base64url.toBuffer(pk);
        return verify(Buffer.from(signature), Buffer.from(message), Buffer.from(p));
    }
}
//# sourceMappingURL=curve25519.js.map