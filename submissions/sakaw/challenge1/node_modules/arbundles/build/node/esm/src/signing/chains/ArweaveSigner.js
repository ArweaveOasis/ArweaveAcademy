import Rsa4096Pss from "../keys/Rsa4096Pss.js";
import { jwkTopem } from "arweave/node/lib/crypto/pem.js";
import base64url from "base64url";
import { getCryptoDriver } from "../../nodeUtils.js";
export default class ArweaveSigner extends Rsa4096Pss {
    jwk;
    constructor(jwk) {
        super(jwkTopem(jwk), jwk.n);
        this.jwk = jwk;
    }
    get publicKey() {
        if (!this.pk)
            throw new Error("ArweaveSigner - pk is undefined");
        return base64url.toBuffer(this.pk);
    }
    sign(message) {
        return getCryptoDriver().sign(this.jwk, message);
    }
    static async verify(pk, message, signature) {
        return await getCryptoDriver().verify(pk, message, signature);
    }
}
//# sourceMappingURL=ArweaveSigner.js.map