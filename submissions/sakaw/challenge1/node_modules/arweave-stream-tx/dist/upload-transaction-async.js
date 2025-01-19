"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTransactionAsync = void 0;
const merkle_1 = require("arweave/node/lib/merkle");
const utils_1 = require("arweave/node/lib/utils");
const exponential_backoff_1 = require("exponential-backoff");
const promises_1 = require("stream/promises");
const common_1 = require("./common");
// Copied from `arweave-js`.
const FATAL_CHUNK_UPLOAD_ERRORS = [
    'invalid_json',
    'chunk_too_big',
    'data_path_too_big',
    'offset_too_big',
    'data_size_too_big',
    'chunk_proof_ratio_not_attractive',
    'invalid_proof',
];
const MAX_CONCURRENT_CHUNK_UPLOAD_COUNT = 128;
/**
 * Uploads the piped data to the specified transaction.
 *
 * @param createTx whether or not the passed transaction should be created on the network.
 * This can be false if we want to reseed an existing transaction,
 */
function uploadTransactionAsync(tx, arweave, createTx = true) {
    return async (source) => {
        if (!tx.chunks) {
            throw Error('Transaction has no computed chunks!');
        }
        if (createTx) {
            // Ensure the transaction data field is blank.
            // We'll upload this data in chunks instead.
            tx.data = new Uint8Array(0);
            const createTxRes = await arweave.api.post(`tx`, tx);
            if (!(createTxRes.status >= 200 && createTxRes.status < 300)) {
                throw new Error(`Failed to create transaction: ${createTxRes.data}`);
            }
        }
        const txChunkData = tx.chunks;
        const { chunks, proofs } = txChunkData;
        function prepareChunkUploadPayload(chunkIndex, chunkData) {
            const proof = proofs[chunkIndex];
            return {
                data_root: tx.data_root,
                data_size: tx.data_size,
                data_path: utils_1.bufferTob64Url(proof.proof),
                offset: proof.offset.toString(),
                chunk: utils_1.bufferTob64Url(chunkData),
            };
        }
        await promises_1.pipeline(source, common_1.chunker(merkle_1.MAX_CHUNK_SIZE, { flush: true }), async (chunkedSource) => {
            var e_1, _a;
            let chunkIndex = 0;
            let dataRebalancedIntoFinalChunk;
            const activeChunkUploads = [];
            try {
                for (var chunkedSource_1 = __asyncValues(chunkedSource), chunkedSource_1_1; chunkedSource_1_1 = await chunkedSource_1.next(), !chunkedSource_1_1.done;) {
                    const chunkData = chunkedSource_1_1.value;
                    const currentChunk = chunks[chunkIndex];
                    const chunkSize = currentChunk.maxByteRange - currentChunk.minByteRange;
                    const expectedToBeFinalRebalancedChunk = dataRebalancedIntoFinalChunk != null;
                    let chunkPayload;
                    if (chunkData.byteLength === chunkSize) {
                        // If the transaction data chunks was never rebalanced this is the only code path that
                        // will execute as the incoming chunked data as the will always be equivalent to `chunkSize`.
                        chunkPayload = prepareChunkUploadPayload(chunkIndex, chunkData);
                    }
                    else if (chunkData.byteLength > chunkSize) {
                        // If the incoming chunk data is larger than the expected size of the current chunk
                        // it means that the transaction had chunks that were rebalanced to meet the minimum chunk size.
                        //
                        // It also means that the chunk we're currently processing should be the second to last
                        // chunk.
                        chunkPayload = prepareChunkUploadPayload(chunkIndex, chunkData.slice(0, chunkSize));
                        dataRebalancedIntoFinalChunk = chunkData.slice(chunkSize);
                    }
                    else if (chunkData.byteLength < chunkSize && expectedToBeFinalRebalancedChunk) {
                        // If this is the final rebalanced chunk, create the upload payload by concatenating the previous
                        // chunk's data that was moved into this and the remaining stream data.
                        chunkPayload = prepareChunkUploadPayload(chunkIndex, Buffer.concat([dataRebalancedIntoFinalChunk, chunkData], dataRebalancedIntoFinalChunk.length + chunkData.length));
                    }
                    else {
                        throw Error('Transaction data stream terminated incorrectly.');
                    }
                    const chunkValid = await merkle_1.validatePath(txChunkData.data_root, parseInt(chunkPayload.offset), 0, parseInt(chunkPayload.data_size), utils_1.b64UrlToBuffer(chunkPayload.data_path));
                    if (!chunkValid) {
                        throw new Error(`Unable to validate chunk ${chunkIndex}.`);
                    }
                    // Upload multiple transaction chunks in parallel to speed up the upload.
                    // If we are already at the maximum concurrent chunk upload limit,
                    // wait till all of them to complete first before continuing.
                    if (activeChunkUploads.length >= MAX_CONCURRENT_CHUNK_UPLOAD_COUNT) {
                        await Promise.all(activeChunkUploads);
                        // Clear the active chunk uploads array.
                        activeChunkUploads.length = 0;
                    }
                    activeChunkUploads.push(exponential_backoff_1.backOff(() => arweave.api.post('chunk', chunkPayload), {
                        retry: (err) => !FATAL_CHUNK_UPLOAD_ERRORS.includes(err.message),
                    }));
                    chunkIndex++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (chunkedSource_1_1 && !chunkedSource_1_1.done && (_a = chunkedSource_1.return)) await _a.call(chunkedSource_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            await Promise.all(activeChunkUploads);
            if (chunkIndex < chunks.length) {
                throw Error(`Transaction upload incomplete: ${chunkIndex + 1}/${chunks.length} chunks uploaded.`);
            }
        });
    };
}
exports.uploadTransactionAsync = uploadTransactionAsync;
