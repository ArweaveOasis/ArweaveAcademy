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
exports.DOMAIN = exports.MESSAGE = exports.types = exports.domain = void 0;
const wallet_1 = require("@ethersproject/wallet");
const constants_1 = require("../../constants");
const keccak256_1 = __importDefault(require("../keccak256"));
const ethereumSigner_1 = __importDefault(require("./ethereumSigner"));
class TypedEthereumSigner extends ethereumSigner_1.default {
    constructor(key) {
        super(key);
        this.ownerLength = constants_1.SIG_CONFIG[constants_1.SignatureConfig.TYPEDETHEREUM].pubLength;
        this.signatureLength = constants_1.SIG_CONFIG[constants_1.SignatureConfig.TYPEDETHEREUM].sigLength;
        this.signatureType = constants_1.SignatureConfig.TYPEDETHEREUM;
        this.address = "0x" + (0, keccak256_1.default)(super.publicKey.slice(1)).slice(-20).toString("hex");
        this.signer = new wallet_1.Wallet(key);
    }
    get publicKey() {
        return Buffer.from(this.address);
    }
    sign(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = yield this.signer._signTypedData(exports.domain, exports.types, {
                address: this.address,
                "Transaction hash": message,
            });
            return Buffer.from(signature.slice(2), "hex"); // trim leading 0x, convert to hex.
        });
    }
    static verify(pk, message, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = pk.toString();
            const addr = (0, wallet_1.verifyTypedData)(exports.domain, exports.types, { address, "Transaction hash": message }, signature);
            return address.toLowerCase() === addr.toLowerCase();
        });
    }
}
exports.default = TypedEthereumSigner;
exports.domain = {
    name: "Bundlr",
    version: "1",
};
exports.types = {
    Bundlr: [
        { name: "Transaction hash", type: "bytes" },
        { name: "address", type: "address" },
    ],
};
exports.MESSAGE = "Bundlr(bytes Transaction hash, address address)";
exports.DOMAIN = "EIP712Domain(string name,string version)";
//# sourceMappingURL=TypedEthereumSigner.js.map