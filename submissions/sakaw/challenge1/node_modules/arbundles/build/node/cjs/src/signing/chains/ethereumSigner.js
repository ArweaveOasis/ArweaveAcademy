"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secp256k1_1 = __importDefault(require("../keys/secp256k1"));
const secp256k1_2 = __importDefault(require("secp256k1"));
const base64url_1 = __importDefault(require("base64url"));
const bytes_1 = require("@ethersproject/bytes");
const wallet_1 = require("@ethersproject/wallet");
const hash_1 = require("@ethersproject/hash");
class EthereumSigner extends secp256k1_1.default {
    get publicKey() {
        return Buffer.from(this.pk, "hex");
    }
    constructor(key) {
        if (key.startsWith("0x"))
            key = key.slice(2);
        const b = Buffer.from(key, "hex");
        const pub = secp256k1_2.default.publicKeyCreate(b, false);
        super(key, Buffer.from(pub));
    }
    sign(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = new wallet_1.Wallet(this._key);
            return wallet.signMessage(message).then((r) => Buffer.from(r.slice(2), "hex"));
            // below doesn't work due to lacking correct v derivation.
            // return Buffer.from(joinSignature(Buffer.from(secp256k1.ecdsaSign(arrayify(hashMessage(message)), this.key).signature)).slice(2), "hex");
        });
    }
    static verify(pk, message, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            // const address = ethers.utils.computeAddress(pk);
            // return ethers.utils.verifyMessage(message, signature) === address;
            return secp256k1_2.default.ecdsaVerify(signature.length === 65 ? signature.slice(0, -1) : signature, (0, bytes_1.arrayify)((0, hash_1.hashMessage)(message)), typeof pk === "string" ? base64url_1.default.toBuffer(pk) : pk);
        });
    }
}
exports.default = EthereumSigner;
//# sourceMappingURL=ethereumSigner.js.map