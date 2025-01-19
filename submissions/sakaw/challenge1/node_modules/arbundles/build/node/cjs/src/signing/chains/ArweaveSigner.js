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
const Rsa4096Pss_1 = __importDefault(require("../keys/Rsa4096Pss"));
const pem_1 = require("arweave/node/lib/crypto/pem");
const base64url_1 = __importDefault(require("base64url"));
const utils_1 = require("../../nodeUtils.js");
class ArweaveSigner extends Rsa4096Pss_1.default {
    constructor(jwk) {
        super((0, pem_1.jwkTopem)(jwk), jwk.n);
        this.jwk = jwk;
    }
    get publicKey() {
        if (!this.pk)
            throw new Error("ArweaveSigner - pk is undefined");
        return base64url_1.default.toBuffer(this.pk);
    }
    sign(message) {
        return (0, utils_1.getCryptoDriver)().sign(this.jwk, message);
    }
    static verify(pk, message, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.getCryptoDriver)().verify(pk, message, signature);
        });
    }
}
exports.default = ArweaveSigner;
//# sourceMappingURL=ArweaveSigner.js.map