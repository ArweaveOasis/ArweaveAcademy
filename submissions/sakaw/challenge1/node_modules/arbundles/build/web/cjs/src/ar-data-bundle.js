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
exports.sign = exports.getSignatureAndId = exports.bundleAndSignData = exports.unbundleData = void 0;
const ar_data_base_1 = __importDefault(require("./ar-data-base"));
const utils_1 = require("./utils");
const Bundle_1 = __importDefault(require("./Bundle"));
const utils_2 = require("./nodeUtils.js");
/**
 * Unbundles a transaction into an Array of DataItems.
 *
 * Takes either a json string or object. Will throw if given an invalid json
 * string but otherwise, it will return an empty array if
 *
 * a) the json object is the wrong format
 * b) the object contains no valid DataItems.
 *
 * It will verify all DataItems and discard ones that don't pass verification.
 *
 * @param txData
 */
function unbundleData(txData) {
    return new Bundle_1.default(txData);
}
exports.unbundleData = unbundleData;
/**
 * Verifies all data items and returns a json object with an items array.
 * Throws if any of the data items fail verification.
 *
 * @param dataItems
 * @param signer
 */
function bundleAndSignData(dataItems, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const headers = new Uint8Array(64 * dataItems.length);
        const binaries = yield Promise.all(dataItems.map((d, index) => __awaiter(this, void 0, void 0, function* () {
            // Sign DataItem
            const id = d.isSigned() ? d.rawId : yield sign(d, signer);
            // Create header array
            const header = new Uint8Array(64);
            // Set offset
            header.set((0, utils_1.longTo32ByteArray)(d.getRaw().byteLength), 0);
            // Set id
            header.set(id, 32);
            // Add header to array of headers
            headers.set(header, 64 * index);
            // Convert to array for flattening
            return d.getRaw();
        }))).then((a) => {
            return Buffer.concat(a);
        });
        const buffer = Buffer.concat([Buffer.from((0, utils_1.longTo32ByteArray)(dataItems.length)), Buffer.from(headers), binaries]);
        return new Bundle_1.default(buffer);
    });
}
exports.bundleAndSignData = bundleAndSignData;
/**
 * Signs a single
 *
 * @param item
 * @param signer
 * @returns signings - signature and id in byte-arrays
 */
function getSignatureAndId(item, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const signatureData = yield (0, ar_data_base_1.default)(item);
        const signatureBytes = yield signer.sign(signatureData);
        const idBytes = yield (0, utils_2.getCryptoDriver)().hash(signatureBytes);
        return { signature: Buffer.from(signatureBytes), id: Buffer.from(idBytes) };
    });
}
exports.getSignatureAndId = getSignatureAndId;
/**
 * Signs and returns item id
 *
 * @param item
 * @param jwk
 */
function sign(item, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const { signature, id } = yield getSignatureAndId(item, signer);
        item.getRaw().set(signature, 2);
        return id;
    });
}
exports.sign = sign;
//# sourceMappingURL=ar-data-bundle.js.map