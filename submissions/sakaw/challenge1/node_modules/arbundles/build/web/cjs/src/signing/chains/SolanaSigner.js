"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const curve25519_1 = __importDefault(require("../keys/curve25519"));
const bs58_1 = __importDefault(require("bs58"));
class SolanaSigner extends curve25519_1.default {
    get publicKey() {
        return bs58_1.default.decode(this.pk);
    }
    get key() {
        return bs58_1.default.decode(this._key);
    }
    constructor(_key) {
        const b = bs58_1.default.decode(_key);
        super(bs58_1.default.encode(b.subarray(0, 32)), bs58_1.default.encode(b.subarray(32, 64)));
    }
}
exports.default = SolanaSigner;
//# sourceMappingURL=SolanaSigner.js.map