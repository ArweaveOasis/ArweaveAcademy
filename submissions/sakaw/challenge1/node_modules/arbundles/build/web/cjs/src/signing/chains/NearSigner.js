"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SolanaSigner_1 = __importDefault(require("./SolanaSigner"));
class NearSigner extends SolanaSigner_1.default {
    constructor(_key) {
        super(_key.replace("ed25519:", ""));
    }
}
exports.default = NearSigner;
//# sourceMappingURL=NearSigner.js.map