"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const curve25519_1 = __importDefault(require("../keys/curve25519"));
class AlgorandSigner extends curve25519_1.default {
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
exports.default = AlgorandSigner;
//# sourceMappingURL=AlgorandSigner.js.map