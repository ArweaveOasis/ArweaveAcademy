import base64url from "base64url";
import secp256k1 from "secp256k1";
import { SignatureConfig, SIG_CONFIG } from "../../constants.js";
import keccak256 from "../keccak256.js";
export default class Secp256k1 {
    _key;
    ownerLength = SIG_CONFIG[SignatureConfig.ETHEREUM].pubLength;
    signatureLength = SIG_CONFIG[SignatureConfig.ETHEREUM].sigLength;
    signatureType = SignatureConfig.ETHEREUM;
    pk;
    constructor(_key, pk) {
        this._key = _key;
        this.pk = pk.toString("hex");
    }
    get publicKey() {
        throw new Error("You must implement `publicKey`");
    }
    get key() {
        return Buffer.from(this._key, "hex");
    }
    static async verify(pk, message, signature) {
        let p = pk;
        if (typeof pk === "string")
            p = base64url.toBuffer(pk);
        let verified = false;
        try {
            verified = secp256k1.ecdsaVerify(signature, keccak256(Buffer.from(message)), p);
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
        return verified;
    }
    async sign(message) {
        return secp256k1.ecdsaSign(keccak256(Buffer.from(message)), Buffer.from(this.key)).signature;
    }
}
//# sourceMappingURL=secp256k1.js.map