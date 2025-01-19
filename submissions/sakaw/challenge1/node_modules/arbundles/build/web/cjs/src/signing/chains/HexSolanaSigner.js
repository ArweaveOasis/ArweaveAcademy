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
const SolanaSigner_1 = __importDefault(require("./SolanaSigner"));
class HexSolanaSigner extends SolanaSigner_1.default {
    constructor(provider) {
        super(provider);
        this.signatureType = 4; // for solana sig type
    }
    sign(message) {
        const _super = Object.create(null, {
            sign: { get: () => super.sign }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.sign.call(this, Buffer.from(Buffer.from(message).toString("hex")));
        });
    }
    static verify(pk, message, signature) {
        const _super = Object.create(null, {
            verify: { get: () => super.verify }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.verify.call(this, pk, Buffer.from(Buffer.from(message).toString("hex")), signature);
        });
    }
}
exports.default = HexSolanaSigner;
//# sourceMappingURL=HexSolanaSigner.js.map