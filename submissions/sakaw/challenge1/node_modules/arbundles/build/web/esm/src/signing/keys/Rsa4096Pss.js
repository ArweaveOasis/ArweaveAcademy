import { getCryptoDriver } from "../../webUtils.js";
import base64url from "base64url";
import { SIG_CONFIG } from "../../constants.js";
import { constants, createSign } from "crypto";
export default class Rsa4096Pss {
    _key;
    pk;
    signatureType = 1;
    ownerLength = SIG_CONFIG[1].pubLength;
    signatureLength = SIG_CONFIG[1].sigLength;
    _publicKey;
    get publicKey() {
        return this._publicKey;
    }
    constructor(_key, pk) {
        this._key = _key;
        this.pk = pk;
        if (!pk) {
            this.pk = getCryptoDriver().getPublicKey(JSON.parse(_key));
        }
    }
    sign(message) {
        return createSign("sha256").update(message).sign({
            key: this._key,
            padding: constants.RSA_PKCS1_PSS_PADDING,
        });
    }
    static async verify(pk, message, signature) {
        return await getCryptoDriver().verify(Buffer.isBuffer(pk) ? base64url.encode(pk) : pk, message, signature);
    }
}
//# sourceMappingURL=Rsa4096Pss.js.map