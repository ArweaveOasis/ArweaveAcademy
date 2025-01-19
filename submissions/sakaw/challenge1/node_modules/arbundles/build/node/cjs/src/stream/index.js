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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamExportForTesting = exports.streamSigner = exports.processStream = void 0;
const stream_1 = require("stream");
const utils_1 = require("../utils");
const base64url_1 = __importDefault(require("base64url"));
const constants_1 = require("../signing/constants");
const index_1 = require("../index");
const constants_2 = require("../constants");
const utils_2 = require("../nodeUtils.js");
const deepHash_1 = require("../deepHash");
const tags_1 = require("../tags");
const crypto_1 = require("crypto");
function processStream(stream) {
    return __awaiter(this, void 0, void 0, function* () {
        const reader = getReader(stream);
        let bytes = (yield reader.next()).value;
        bytes = yield readBytes(reader, bytes, 32);
        const itemCount = (0, utils_1.byteArrayToLong)(bytes.subarray(0, 32));
        bytes = bytes.subarray(32);
        const headersLength = 64 * itemCount;
        bytes = yield readBytes(reader, bytes, headersLength);
        const headers = new Array(itemCount);
        for (let i = 0; i < headersLength; i += 64) {
            headers[i / 64] = [(0, utils_1.byteArrayToLong)(bytes.subarray(i, i + 32)), (0, base64url_1.default)(Buffer.from(bytes.subarray(i + 32, i + 64)))];
        }
        bytes = bytes.subarray(headersLength);
        let offsetSum = 32 + headersLength;
        const items = [];
        for (const [length, id] of headers) {
            bytes = yield readBytes(reader, bytes, index_1.MIN_BINARY_SIZE);
            // Get sig type
            bytes = yield readBytes(reader, bytes, 2);
            const signatureType = (0, utils_1.byteArrayToLong)(bytes.subarray(0, 2));
            bytes = bytes.subarray(2);
            const { sigLength, pubLength, sigName } = constants_2.SIG_CONFIG[signatureType];
            // Get sig
            bytes = yield readBytes(reader, bytes, sigLength);
            const signature = bytes.subarray(0, sigLength);
            bytes = bytes.subarray(sigLength);
            // Get owner
            bytes = yield readBytes(reader, bytes, pubLength);
            const owner = bytes.subarray(0, pubLength);
            bytes = bytes.subarray(pubLength);
            // Get target
            bytes = yield readBytes(reader, bytes, 1);
            const targetPresent = bytes[0] === 1;
            if (targetPresent)
                bytes = yield readBytes(reader, bytes, 33);
            const target = targetPresent ? bytes.subarray(1, 33) : Buffer.allocUnsafe(0);
            bytes = bytes.subarray(targetPresent ? 33 : 1);
            // Get anchor
            bytes = yield readBytes(reader, bytes, 1);
            const anchorPresent = bytes[0] === 1;
            if (anchorPresent)
                bytes = yield readBytes(reader, bytes, 33);
            const anchor = anchorPresent ? bytes.subarray(1, 33) : Buffer.allocUnsafe(0);
            bytes = bytes.subarray(anchorPresent ? 33 : 1);
            // Get tags
            bytes = yield readBytes(reader, bytes, 8);
            const tagsLength = (0, utils_1.byteArrayToLong)(bytes.subarray(0, 8));
            bytes = bytes.subarray(8);
            bytes = yield readBytes(reader, bytes, 8);
            const tagsBytesLength = (0, utils_1.byteArrayToLong)(bytes.subarray(0, 8));
            bytes = bytes.subarray(8);
            bytes = yield readBytes(reader, bytes, tagsBytesLength);
            const tagsBytes = bytes.subarray(0, tagsBytesLength);
            const tags = tagsLength !== 0 && tagsBytesLength !== 0 ? (0, tags_1.deserializeTags)(Buffer.from(tagsBytes)) : [];
            if (tags.length !== tagsLength)
                throw new Error("Tags lengths don't match");
            bytes = bytes.subarray(tagsBytesLength);
            const transform = new stream_1.Transform();
            transform._transform = function (chunk, _, done) {
                this.push(chunk);
                done();
            };
            // Verify signature
            const signatureData = (0, deepHash_1.deepHash)([
                (0, utils_2.stringToBuffer)("dataitem"),
                (0, utils_2.stringToBuffer)("1"),
                (0, utils_2.stringToBuffer)(signatureType.toString()),
                owner,
                target,
                anchor,
                tagsBytes,
                transform,
            ]);
            // Get offset of data start and length of data
            const dataOffset = 2 + sigLength + pubLength + (targetPresent ? 33 : 1) + (anchorPresent ? 33 : 1) + 16 + tagsBytesLength;
            const dataSize = length - dataOffset;
            if (bytes.byteLength > dataSize) {
                transform.write(bytes.subarray(0, dataSize));
                bytes = bytes.subarray(dataSize);
            }
            else {
                let skipped = bytes.byteLength;
                transform.write(bytes);
                while (dataSize > skipped) {
                    bytes = (yield reader.next()).value;
                    if (!bytes) {
                        throw new Error(`Not enough data bytes  expected: ${dataSize} received: ${skipped}`);
                    }
                    skipped += bytes.byteLength;
                    if (skipped > dataSize)
                        transform.write(bytes.subarray(0, bytes.byteLength - (skipped - dataSize)));
                    else
                        transform.write(bytes);
                }
                bytes = bytes.subarray(bytes.byteLength - (skipped - dataSize));
            }
            transform.end();
            // Check id
            if (id !== (0, base64url_1.default)((0, crypto_1.createHash)("sha256").update(signature).digest()))
                throw new Error("ID doesn't match signature");
            const Signer = constants_1.indexToType[signatureType];
            if (!(yield Signer.verify(owner, (yield signatureData), signature)))
                throw new Error("Invalid signature");
            items.push({
                id,
                sigName,
                signature: (0, base64url_1.default)(Buffer.from(signature)),
                target: (0, base64url_1.default)(Buffer.from(target)),
                anchor: (0, base64url_1.default)(Buffer.from(anchor)),
                owner: (0, base64url_1.default)(Buffer.from(owner)),
                tags,
                dataOffset: offsetSum + dataOffset,
                dataSize,
            });
            offsetSum += dataOffset + dataSize;
        }
        return items;
    });
}
exports.processStream = processStream;
/**
 * Signs a stream (requires two instances/read passes)
 * @param s1 Stream to sign - same as s2
 * @param s2 Stream to sign - same as s1
 * @param signer Signer to use to sign the stream
 * @param opts Optional options to apply to the stream (same as DataItem)
 */
function streamSigner(s1, s2, signer, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const header = (0, index_1.createData)("", signer, opts);
        const output = new stream_1.PassThrough();
        const parts = [
            (0, utils_2.stringToBuffer)("dataitem"),
            (0, utils_2.stringToBuffer)("1"),
            (0, utils_2.stringToBuffer)(header.signatureType.toString()),
            header.rawOwner,
            header.rawTarget,
            header.rawAnchor,
            header.rawTags,
            s1,
        ];
        const hash = yield (0, deepHash_1.deepHash)(parts);
        const sigBytes = Buffer.from(yield signer.sign(hash));
        header.setSignature(sigBytes);
        output.write(header.getRaw());
        return s2.pipe(output);
    });
}
exports.streamSigner = streamSigner;
function readBytes(reader, buffer, length) {
    return __awaiter(this, void 0, void 0, function* () {
        if (buffer.byteLength >= length)
            return buffer;
        const { done, value } = yield reader.next();
        if (done && !value)
            throw new Error("Invalid buffer");
        return readBytes(reader, Buffer.concat([Buffer.from(buffer), Buffer.from(value)]), length);
    });
}
function getReader(s) {
    return __asyncGenerator(this, arguments, function* getReader_1() {
        var _a, e_1, _b, _c;
        try {
            for (var _d = true, s_1 = __asyncValues(s), s_1_1; s_1_1 = yield __await(s_1.next()), _a = s_1_1.done, !_a;) {
                _c = s_1_1.value;
                _d = false;
                try {
                    const chunk = _c;
                    yield yield __await(chunk);
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = s_1.return)) yield __await(_b.call(s_1));
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
exports.default = processStream;
exports.streamExportForTesting = {
    readBytes,
    getReader,
};
//# sourceMappingURL=index.js.map