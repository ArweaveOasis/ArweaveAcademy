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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashStream = exports.deepHashChunks = exports.deepHash = void 0;
// In TypeScript 3.7, could be written as a single type:
// `type DeepHashChunk = Uint8Array | DeepHashChunk[];`
const utils_1 = require("./nodeUtils.js");
const crypto_1 = require("crypto");
function deepHash(data) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof data[Symbol.asyncIterator] === "function") {
            const _data = data;
            const context = (0, crypto_1.createHash)("sha384");
            let length = 0;
            try {
                for (var _d = true, _data_1 = __asyncValues(_data), _data_1_1; _data_1_1 = yield _data_1.next(), _a = _data_1_1.done, !_a;) {
                    _c = _data_1_1.value;
                    _d = false;
                    try {
                        const chunk = _c;
                        length += chunk.byteLength;
                        context.update(chunk);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _data_1.return)) yield _b.call(_data_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const tag = (0, utils_1.concatBuffers)([(0, utils_1.stringToBuffer)("blob"), (0, utils_1.stringToBuffer)(length.toString())]);
            const taggedHash = (0, utils_1.concatBuffers)([yield (0, utils_1.getCryptoDriver)().hash(tag, "SHA-384"), context.digest()]);
            return yield (0, utils_1.getCryptoDriver)().hash(taggedHash, "SHA-384");
        }
        else if (Array.isArray(data)) {
            const tag = (0, utils_1.concatBuffers)([(0, utils_1.stringToBuffer)("list"), (0, utils_1.stringToBuffer)(data.length.toString())]);
            return yield deepHashChunks(data, yield (0, utils_1.getCryptoDriver)().hash(tag, "SHA-384"));
        }
        const _data = data;
        const tag = (0, utils_1.concatBuffers)([(0, utils_1.stringToBuffer)("blob"), (0, utils_1.stringToBuffer)(_data.byteLength.toString())]);
        const taggedHash = (0, utils_1.concatBuffers)([yield (0, utils_1.getCryptoDriver)().hash(tag, "SHA-384"), yield (0, utils_1.getCryptoDriver)().hash(_data, "SHA-384")]);
        return yield (0, utils_1.getCryptoDriver)().hash(taggedHash, "SHA-384");
    });
}
exports.deepHash = deepHash;
function deepHashChunks(chunks, acc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (chunks.length < 1) {
            return acc;
        }
        const hashPair = (0, utils_1.concatBuffers)([acc, yield deepHash(chunks[0])]);
        const newAcc = yield (0, utils_1.getCryptoDriver)().hash(hashPair, "SHA-384");
        return yield deepHashChunks(chunks.slice(1), newAcc);
    });
}
exports.deepHashChunks = deepHashChunks;
function hashStream(stream) {
    var _a, stream_1, stream_1_1;
    var _b, e_2, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const context = (0, crypto_1.createHash)("sha384");
        try {
            for (_a = true, stream_1 = __asyncValues(stream); stream_1_1 = yield stream_1.next(), _b = stream_1_1.done, !_b;) {
                _d = stream_1_1.value;
                _a = false;
                try {
                    const chunk = _d;
                    context.update(chunk);
                }
                finally {
                    _a = true;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_a && !_b && (_c = stream_1.return)) yield _c.call(stream_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return context.digest();
    });
}
exports.hashStream = hashStream;
exports.default = deepHash;
//# sourceMappingURL=deepHash.js.map