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
class Curve25519 {
    get publicKey() {
        return this._publicKey;
    }
    constructor(_key, pk) {
        this._key = _key;
        this.pk = pk;
        this.ownerLength = constants_1.SIG_CONFIG[2].pubLength;
        this.signatureLength = constants_1.SIG_CONFIG[2].sigLength;
        this.signatureType = 2;
    }
    get key() {
        throw new Error("You must implement `key`");
    }
    sign(message) {
        return (0, ed25519_1.sign)(Buffer.from(message), Buffer.from(this.key));
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
exports.default = Curve25519;
//# sourceMappingURL=curve25519.js.map