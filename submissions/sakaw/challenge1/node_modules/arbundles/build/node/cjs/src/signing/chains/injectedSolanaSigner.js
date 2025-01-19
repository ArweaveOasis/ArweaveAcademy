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
const base64url_1 = __importDefault(require("base64url"));
const constants_1 = require("../../constants");
const ed25519_1 = require("@noble/ed25519");
class InjectedSolanaSigner {
    constructor(provider) {
        this.ownerLength = constants_1.SIG_CONFIG[2].pubLength;
        this.signatureLength = constants_1.SIG_CONFIG[2].sigLength;
        this.signatureType = 2;
        this.provider = provider;
        if (!this.provider.publicKey)
            throw new Error("InjectedSolanaSigner - provider.publicKey is undefined");
        this._publicKey = this.provider.publicKey.toBuffer();
    }
    get publicKey() {
        return this._publicKey;
    }
    sign(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.provider.signMessage)
                throw new Error("Selected Wallet does not support message signing");
            return yield this.provider.signMessage(message);
        });
    }
    static verify(pk, message, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            let p = pk;
            if (typeof pk === "string")
                p = base64url_1.default.toBuffer(pk);
            return (0, ed25519_1.verify)(Buffer.from(signature), Buffer.from(message), Buffer.from(p));
        });
    }
}
exports.default = InjectedSolanaSigner;
//# sourceMappingURL=injectedSolanaSigner.js.map