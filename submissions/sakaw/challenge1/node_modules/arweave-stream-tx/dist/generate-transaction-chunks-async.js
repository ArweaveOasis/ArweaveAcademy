"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionChunksAsync = void 0;
const arweave_1 = __importDefault(require("arweave"));
const merkle_1 = require("arweave/node/lib/merkle");
const promises_1 = require("stream/promises");
const common_1 = require("./common");
/**
 * Generates the Arweave transaction chunk information from the piped data stream.
 */
function generateTransactionChunksAsync() {
    return async (source) => {
        const chunks = [];
        /**
         * @param chunkByteIndex the index the start of the specified chunk is located at within its original data stream.
         */
        async function addChunk(chunkByteIndex, chunk) {
            const dataHash = await arweave_1.default.crypto.hash(chunk);
            const chunkRep = {
                dataHash,
                minByteRange: chunkByteIndex,
                maxByteRange: chunkByteIndex + chunk.byteLength,
            };
            chunks.push(chunkRep);
            return chunkRep;
        }
        let chunkStreamByteIndex = 0;
        let previousDataChunk;
        let expectChunkGenerationCompleted = false;
        await promises_1.pipeline(source, common_1.chunker(merkle_1.MAX_CHUNK_SIZE, { flush: true }), async (chunkedSource) => {
            var e_1, _a;
            try {
                for (var chunkedSource_1 = __asyncValues(chunkedSource), chunkedSource_1_1; chunkedSource_1_1 = await chunkedSource_1.next(), !chunkedSource_1_1.done;) {
                    const chunk = chunkedSource_1_1.value;
                    if (expectChunkGenerationCompleted) {
                        throw Error('Expected chunk generation to have completed.');
                    }
                    if (chunk.byteLength >= merkle_1.MIN_CHUNK_SIZE && chunk.byteLength <= merkle_1.MAX_CHUNK_SIZE) {
                        await addChunk(chunkStreamByteIndex, chunk);
                    }
                    else if (chunk.byteLength < merkle_1.MIN_CHUNK_SIZE) {
                        if (previousDataChunk) {
                            // If this final chunk is smaller than the minimum chunk size, rebalance this final chunk and
                            // the previous chunk to keep the final chunk size above the minimum threshold.
                            const remainingBytes = Buffer.concat([previousDataChunk, chunk], previousDataChunk.byteLength + chunk.byteLength);
                            const rebalancedSizeForPreviousChunk = Math.ceil(remainingBytes.byteLength / 2);
                            const previousChunk = chunks.pop();
                            const rebalancedPreviousChunk = await addChunk(previousChunk.minByteRange, remainingBytes.slice(0, rebalancedSizeForPreviousChunk));
                            await addChunk(rebalancedPreviousChunk.maxByteRange, remainingBytes.slice(rebalancedSizeForPreviousChunk));
                        }
                        else {
                            // This entire stream should be smaller than the minimum chunk size, just add the chunk in.
                            await addChunk(chunkStreamByteIndex, chunk);
                        }
                        expectChunkGenerationCompleted = true;
                    }
                    else if (chunk.byteLength > merkle_1.MAX_CHUNK_SIZE) {
                        throw Error('Encountered chunk larger than max chunk size.');
                    }
                    chunkStreamByteIndex += chunk.byteLength;
                    previousDataChunk = chunk;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (chunkedSource_1_1 && !chunkedSource_1_1.done && (_a = chunkedSource_1.return)) await _a.call(chunkedSource_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
        const leaves = await merkle_1.generateLeaves(chunks);
        const root = await merkle_1.buildLayers(leaves);
        const proofs = merkle_1.generateProofs(root);
        return {
            data_root: root.id,
            chunks,
            proofs,
        };
    };
}
exports.generateTransactionChunksAsync = generateTransactionChunksAsync;
