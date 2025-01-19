import Curve25519 from "../keys/curve25519.js";
export default class AlgorandSigner extends Curve25519 {
    get publicKey() {
        return Buffer.from(this.pk);
    }
    get key() {
        return Buffer.from(this._key);
    }
    constructor(key, pk) {
        super(key.subarray(0, 32), pk);
    }
}
//# sourceMappingURL=AlgorandSigner.js.map