"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionAsync = void 0;
const transaction_1 = __importDefault(require("arweave/node/lib/transaction"));
const utils_1 = require("arweave/node/lib/utils");
const promises_1 = require("stream/promises");
const generate_transaction_chunks_async_1 = require("./generate-transaction-chunks-async");
/**
 * Creates an Arweave transaction from the piped data stream.
 */
function createTransactionAsync(attributes, arweave, jwk) {
    return async (source) => {
        var _a, _b, _c;
        const chunks = await promises_1.pipeline(source, generate_transaction_chunks_async_1.generateTransactionChunksAsync());
        const txAttrs = Object.assign({}, attributes);
        (_a = txAttrs.owner) !== null && _a !== void 0 ? _a : (txAttrs.owner = jwk === null || jwk === void 0 ? void 0 : jwk.n);
        (_b = txAttrs.last_tx) !== null && _b !== void 0 ? _b : (txAttrs.last_tx = await arweave.transactions.getTransactionAnchor());
        const lastChunk = chunks.chunks[chunks.chunks.length - 1];
        const dataByteLength = lastChunk.maxByteRange;
        (_c = txAttrs.reward) !== null && _c !== void 0 ? _c : (txAttrs.reward = await arweave.transactions.getPrice(dataByteLength, txAttrs.target));
        txAttrs.data_size = dataByteLength.toString();
        const tx = new transaction_1.default(txAttrs);
        tx.chunks = chunks;
        tx.data_root = utils_1.bufferTob64Url(chunks.data_root);
        return tx;
    };
}
exports.createTransactionAsync = createTransactionAsync;
