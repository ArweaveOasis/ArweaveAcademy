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
exports.createData = void 0;
const FileDataItem_1 = __importDefault(require("./FileDataItem"));
const tmp_promise_1 = require("tmp-promise");
const base64url_1 = __importDefault(require("base64url"));
const utils_1 = require("../utils");
const tags_1 = require("../tags");
const promises_1 = require("stream/promises");
const fs_1 = require("fs");
function createData(data, signer, opts) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const filename = yield (0, tmp_promise_1.tmpName)();
        const stream = (0, fs_1.createWriteStream)(filename);
        // TODO: Add asserts
        // Parse all values to a buffer and
        const _owner = signer.publicKey;
        const _target = (opts === null || opts === void 0 ? void 0 : opts.target) ? base64url_1.default.toBuffer(opts.target) : null;
        const _anchor = (opts === null || opts === void 0 ? void 0 : opts.anchor) ? Buffer.from(opts.anchor) : null;
        // @ts-expect-error undefined opts.tags already has a guard
        const _tags = ((_b = (_a = opts === null || opts === void 0 ? void 0 : opts.tags) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0 ? (0, tags_1.serializeTags)(opts.tags) : null;
        stream.write((0, utils_1.shortTo2ByteArray)(signer.signatureType));
        // Signature
        stream.write(new Uint8Array(signer.signatureLength).fill(0));
        if (_owner.byteLength !== signer.ownerLength)
            new Error(`Owner must be ${signer.ownerLength} bytes`);
        stream.write(_owner);
        stream.write(_target ? singleItemBuffer(1) : singleItemBuffer(0));
        if (_target) {
            if (_target.byteLength !== 32)
                throw new Error("Target must be 32 bytes");
            stream.write(_target);
        }
        stream.write(_anchor ? singleItemBuffer(1) : singleItemBuffer(0));
        if (_anchor) {
            if (_anchor.byteLength !== 32)
                throw new Error("Anchor must be 32 bytes");
            stream.write(_anchor);
        }
        // TODO: Shall I manually add 8 bytes?
        // TODO: Finish this
        stream.write((0, utils_1.longTo8ByteArray)((_d = (_c = opts === null || opts === void 0 ? void 0 : opts.tags) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0));
        const bytesCount = (0, utils_1.longTo8ByteArray)((_e = _tags === null || _tags === void 0 ? void 0 : _tags.byteLength) !== null && _e !== void 0 ? _e : 0);
        stream.write(bytesCount);
        if (_tags) {
            stream.write(_tags);
        }
        if (typeof data[Symbol.asyncIterator] === "function") {
            yield (0, promises_1.pipeline)(data, stream);
        }
        else {
            stream.write(Buffer.from(data));
        }
        yield new Promise((resolve) => {
            stream.end(resolve);
        });
        return new FileDataItem_1.default(filename);
    });
}
exports.createData = createData;
function singleItemBuffer(i) {
    return Buffer.from([i]);
}
//# sourceMappingURL=createData.js.map