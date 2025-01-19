"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createData = void 0;
const base64url_1 = __importDefault(require("base64url"));
const utils_1 = require("./utils");
const DataItem_1 = __importDefault(require("./DataItem"));
const tags_1 = require("./tags");
/**
 * This will create a single DataItem in binary format (Uint8Array)
 *
 * @param data
 * @param opts - Options involved in creating data items
 * @param signer
 */
function createData(data, signer, opts) {
    var _a, _b, _c, _d, _e, _f, _g;
    // TODO: Add asserts
    // Parse all values to a buffer and
    const _owner = signer.publicKey;
    const _target = (opts === null || opts === void 0 ? void 0 : opts.target) ? base64url_1.default.toBuffer(opts.target) : null;
    const target_length = 1 + ((_a = _target === null || _target === void 0 ? void 0 : _target.byteLength) !== null && _a !== void 0 ? _a : 0);
    const _anchor = (opts === null || opts === void 0 ? void 0 : opts.anchor) ? Buffer.from(opts.anchor) : null;
    const anchor_length = 1 + ((_b = _anchor === null || _anchor === void 0 ? void 0 : _anchor.byteLength) !== null && _b !== void 0 ? _b : 0);
    const _tags = ((_d = (_c = opts === null || opts === void 0 ? void 0 : opts.tags) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0 ? (0, tags_1.serializeTags)(opts === null || opts === void 0 ? void 0 : opts.tags) : null;
    const tags_length = 16 + (_tags ? _tags.byteLength : 0);
    const _data = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
    const data_length = _data.byteLength;
    // See [https://github.com/joshbenaron/arweave-standards/blob/ans104/ans/ANS-104.md#13-dataitem-format]
    const length = 2 + signer.signatureLength + signer.ownerLength + target_length + anchor_length + tags_length + data_length;
    // Create array with set length
    const bytes = Buffer.alloc(length);
    bytes.set((0, utils_1.shortTo2ByteArray)(signer.signatureType), 0);
    // Push bytes for `signature`
    bytes.set(new Uint8Array(signer.signatureLength).fill(0), 2);
    // // Push bytes for `id`
    // bytes.set(EMPTY_ARRAY, 32);
    // Push bytes for `owner`
    if (_owner.byteLength !== signer.ownerLength)
        throw new Error(`Owner must be ${signer.ownerLength} bytes, but was incorrectly ${_owner.byteLength}`);
    bytes.set(_owner, 2 + signer.signatureLength);
    const position = 2 + signer.signatureLength + signer.ownerLength;
    // Push `presence byte` and push `target` if present
    // 64 + OWNER_LENGTH
    bytes[position] = _target ? 1 : 0;
    if (_target) {
        if (_target.byteLength !== 32)
            throw new Error(`Target must be 32 bytes but was incorrectly ${_target.byteLength}`);
        bytes.set(_target, position + 1);
    }
    // Push `presence byte` and push `anchor` if present
    // 64 + OWNER_LENGTH
    const anchor_start = position + target_length;
    let tags_start = anchor_start + 1;
    bytes[anchor_start] = _anchor ? 1 : 0;
    if (_anchor) {
        tags_start += _anchor.byteLength;
        if (_anchor.byteLength !== 32)
            throw new Error("Anchor must be 32 bytes");
        bytes.set(_anchor, anchor_start + 1);
    }
    bytes.set((0, utils_1.longTo8ByteArray)((_f = (_e = opts === null || opts === void 0 ? void 0 : opts.tags) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0), tags_start);
    const bytesCount = (0, utils_1.longTo8ByteArray)((_g = _tags === null || _tags === void 0 ? void 0 : _tags.byteLength) !== null && _g !== void 0 ? _g : 0);
    bytes.set(bytesCount, tags_start + 8);
    if (_tags) {
        bytes.set(_tags, tags_start + 16);
    }
    const data_start = tags_start + tags_length;
    bytes.set(_data, data_start);
    return new DataItem_1.default(bytes);
}
exports.createData = createData;
//# sourceMappingURL=ar-data-create.js.map