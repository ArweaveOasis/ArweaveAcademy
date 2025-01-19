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
exports.Bundle = void 0;
const base64url_1 = __importDefault(require("base64url"));
const utils_1 = require("./utils");
const DataItem_1 = __importDefault(require("./DataItem"));
const crypto_1 = require("crypto");
const HEADER_START = 32;
class Bundle {
    constructor(binary) {
        this.binary = binary;
        this.length = this.getDataItemCount();
        this.items = this.getItems();
    }
    getRaw() {
        return this.binary;
    }
    /**
     * Get a DataItem by index (`number`) or by txId (`string`)
     * @param index
     */
    get(index) {
        if (typeof index === "number") {
            if (index >= this.length) {
                throw new RangeError("Index out of range");
            }
            return this.getByIndex(index);
        }
        else {
            return this.getById(index);
        }
    }
    getSizes() {
        const ids = [];
        for (let i = HEADER_START; i < HEADER_START + 64 * this.length; i += 64) {
            ids.push((0, utils_1.byteArrayToLong)(this.binary.subarray(i, i + 32)));
        }
        return ids;
    }
    getIds() {
        const ids = [];
        for (let i = HEADER_START; i < HEADER_START + 64 * this.length; i += 64) {
            const bundleId = this.binary.subarray(i + 32, i + 64);
            if (bundleId.length === 0) {
                throw new Error("Invalid bundle, id specified in headers doesn't exist");
            }
            ids.push(base64url_1.default.encode(bundleId));
        }
        return ids;
    }
    getIdBy(index) {
        if (index > this.length - 1) {
            throw new RangeError("Index of bundle out of range");
        }
        const start = 64 + 64 * index;
        return base64url_1.default.encode(this.binary.subarray(start, start + 32));
    }
    toTransaction(attributes, arweave, jwk) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield arweave.createTransaction(Object.assign({ data: this.binary }, attributes), jwk);
            tx.addTag("Bundle-Format", "binary");
            tx.addTag("Bundle-Version", "2.0.0");
            return tx;
        });
    }
    verify() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const item of this.items) {
                const valid = yield item.isValid();
                const expected = (0, base64url_1.default)((0, crypto_1.createHash)("sha256").update(item.rawSignature).digest());
                if (!(valid && item.id === expected)) {
                    return false;
                }
            }
            return true;
        });
    }
    getOffset(id) {
        let offset = 0;
        for (let i = HEADER_START; i < HEADER_START + 64 * this.length; i += 64) {
            const _offset = (0, utils_1.byteArrayToLong)(this.binary.subarray(i, i + 32));
            offset += _offset;
            const _id = this.binary.subarray(i + 32, i + 64);
            if (Buffer.compare(_id, id) === 0) {
                return { startOffset: offset, size: _offset };
            }
        }
        return { startOffset: -1, size: -1 };
    }
    // TODO: Test this
    /**
     * UNSAFE! Assumes index < length
     * @param index
     * @private
     */
    getByIndex(index) {
        let offset = 0;
        const bundleStart = this.getBundleStart();
        let counter = 0;
        let _offset, _id;
        for (let i = HEADER_START; i < HEADER_START + 64 * this.length; i += 64) {
            _offset = (0, utils_1.byteArrayToLong)(this.binary.subarray(i, i + 32));
            if (counter++ === index) {
                _id = this.binary.subarray(i + 32, i + 64);
                break;
            }
            offset += _offset;
        }
        const dataItemStart = bundleStart + offset;
        const slice = this.binary.subarray(dataItemStart, dataItemStart + _offset);
        const item = new DataItem_1.default(slice);
        item.rawId = _id;
        return item;
    }
    getById(id) {
        const _id = base64url_1.default.toBuffer(id);
        const offset = this.getOffset(_id);
        if (offset.startOffset === -1) {
            throw new Error("Transaction not found");
        }
        const bundleStart = this.getBundleStart();
        const dataItemStart = bundleStart + offset.startOffset;
        return new DataItem_1.default(this.binary.subarray(dataItemStart, dataItemStart + offset.size));
    }
    getDataItemCount() {
        return (0, utils_1.byteArrayToLong)(this.binary.subarray(0, 32));
    }
    getBundleStart() {
        return 32 + 64 * this.length;
    }
    getItems() {
        const items = new Array(this.length);
        let offset = 0;
        const bundleStart = this.getBundleStart();
        let counter = 0;
        for (let i = HEADER_START; i < HEADER_START + 64 * this.length; i += 64) {
            const _offset = (0, utils_1.byteArrayToLong)(this.binary.subarray(i, i + 32));
            const _id = this.binary.subarray(i + 32, i + 64);
            if (_id.length === 0) {
                throw new Error("Invalid bundle, id specified in headers doesn't exist");
            }
            const dataItemStart = bundleStart + offset;
            const bytes = this.binary.subarray(dataItemStart, dataItemStart + _offset);
            offset += _offset;
            const item = new DataItem_1.default(bytes);
            item.rawId = _id;
            items[counter] = item;
            counter++;
        }
        return items;
    }
}
exports.Bundle = Bundle;
exports.default = Bundle;
//# sourceMappingURL=Bundle.js.map