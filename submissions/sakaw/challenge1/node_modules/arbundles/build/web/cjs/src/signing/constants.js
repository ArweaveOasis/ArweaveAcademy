"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexToType = void 0;
const curve25519_1 = __importDefault(require("./keys/curve25519"));
const index_1 = require("./chains/index");
exports.indexToType = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    1: index_1.ArweaveSigner,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    2: curve25519_1.default,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    3: index_1.EthereumSigner,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    4: index_1.HexInjectedSolanaSigner,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    5: index_1.InjectedAptosSigner,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    6: index_1.MultiSignatureAptosSigner,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    7: index_1.TypedEthereumSigner,
};
//# sourceMappingURL=constants.js.map