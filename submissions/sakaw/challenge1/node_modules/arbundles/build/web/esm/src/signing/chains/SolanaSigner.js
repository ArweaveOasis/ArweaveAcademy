import Curve25519 from "../keys/curve25519.js";
import bs58 from "bs58";
export default class SolanaSigner extends Curve25519 {
    get publicKey() {
        return bs58.decode(this.pk);
    }
    get key() {
        return bs58.decode(this._key);
    }
    constructor(_key) {
        const b = bs58.decode(_key);
        super(bs58.encode(b.subarray(0, 32)), bs58.encode(b.subarray(32, 64)));
    }
}
//# sourceMappingURL=SolanaSigner.js.map