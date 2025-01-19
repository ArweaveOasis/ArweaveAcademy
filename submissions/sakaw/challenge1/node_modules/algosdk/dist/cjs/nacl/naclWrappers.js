"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEED_BTYES_LENGTH = exports.HASH_BYTES_LENGTH = exports.SECRET_KEY_LENGTH = exports.PUBLIC_KEY_LENGTH = exports.verify = exports.bytesEqual = exports.sign = exports.keyPairFromSecretKey = exports.isValidSignatureLength = exports.keyPair = exports.keyPairFromSeed = exports.randomBytes = exports.genericHash = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const js_sha512_1 = __importDefault(require("js-sha512"));
function genericHash(arr) {
    return js_sha512_1.default.sha512_256.array(arr);
}
exports.genericHash = genericHash;
function randomBytes(length) {
    return tweetnacl_1.default.randomBytes(length);
}
exports.randomBytes = randomBytes;
function keyPairFromSeed(seed) {
    return tweetnacl_1.default.sign.keyPair.fromSeed(seed);
}
exports.keyPairFromSeed = keyPairFromSeed;
function keyPair() {
    const seed = randomBytes(tweetnacl_1.default.box.secretKeyLength);
    return keyPairFromSeed(seed);
}
exports.keyPair = keyPair;
function isValidSignatureLength(len) {
    return len === tweetnacl_1.default.sign.signatureLength;
}
exports.isValidSignatureLength = isValidSignatureLength;
function keyPairFromSecretKey(sk) {
    return tweetnacl_1.default.sign.keyPair.fromSecretKey(sk);
}
exports.keyPairFromSecretKey = keyPairFromSecretKey;
function sign(msg, secretKey) {
    return tweetnacl_1.default.sign.detached(msg, secretKey);
}
exports.sign = sign;
function bytesEqual(a, b) {
    return tweetnacl_1.default.verify(a, b);
}
exports.bytesEqual = bytesEqual;
function verify(message, signature, verifyKey) {
    return tweetnacl_1.default.sign.detached.verify(message, signature, verifyKey);
}
exports.verify = verify;
// constants
exports.PUBLIC_KEY_LENGTH = tweetnacl_1.default.sign.publicKeyLength;
exports.SECRET_KEY_LENGTH = tweetnacl_1.default.sign.secretKeyLength;
exports.HASH_BYTES_LENGTH = 32;
exports.SEED_BTYES_LENGTH = 32;
//# sourceMappingURL=naclWrappers.js.map