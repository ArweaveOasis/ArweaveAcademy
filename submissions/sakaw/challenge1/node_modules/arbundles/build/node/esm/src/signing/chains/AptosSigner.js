import Curve25519 from "../keys/curve25519.js";
export default class AptosSigner extends Curve25519 {
    constructor(privKey, pubKey) {
        super(privKey, pubKey);
    }
    get publicKey() {
        return Buffer.from(this.pk.slice(2), "hex");
    }
    get key() {
        return Buffer.from(this._key.slice(2), "hex");
    }
}
//# sourceMappingURL=AptosSigner.js.map