"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const curve25519_1 = __importDefault(require("../keys/curve25519"));
class AptosSigner extends curve25519_1.default {
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
exports.default = AptosSigner;
//# sourceMappingURL=AptosSigner.js.map