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
const utils_1 = require("../../nodeUtils.js");
const base64url_1 = __importDefault(require("base64url"));
const constants_1 = require("../../constants");
const crypto_1 = require("crypto");
class Rsa4096Pss {
    get publicKey() {
        return this._publicKey;
    }
    constructor(_key, pk) {
        this._key = _key;
        this.pk = pk;
        this.signatureType = 1;
        this.ownerLength = constants_1.SIG_CONFIG[1].pubLength;
        this.signatureLength = constants_1.SIG_CONFIG[1].sigLength;
        if (!pk) {
            this.pk = (0, utils_1.getCryptoDriver)().getPublicKey(JSON.parse(_key));
        }
    }
    sign(message) {
        return (0, crypto_1.createSign)("sha256").update(message).sign({
            key: this._key,
            padding: crypto_1.constants.RSA_PKCS1_PSS_PADDING,
        });
    }
    static verify(pk, message, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.getCryptoDriver)().verify(Buffer.isBuffer(pk) ? base64url_1.default.encode(pk) : pk, message, signature);
        });
    }
}
exports.default = Rsa4096Pss;
//# sourceMappingURL=Rsa4096Pss.js.map