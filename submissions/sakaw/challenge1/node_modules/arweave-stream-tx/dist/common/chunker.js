"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunker = exports.ChunkBuffer = void 0;
class ChunkBuffer {
    constructor() {
        this.buffers = [];
    }
    get empty() {
        return this.buffers.length === 0;
    }
    push(...buffers) {
        this.buffers.push(...buffers);
    }
    pop(expectedChunkSize) {
        let totalBufferSize = 0;
        for (const [i, chunk] of this.buffers.entries()) {
            totalBufferSize += chunk.byteLength;
            if (totalBufferSize === expectedChunkSize) {
                return Buffer.concat(this.buffers.splice(0, i + 1));
            }
            else if (totalBufferSize > expectedChunkSize) {
                const chunkOverflowAmount = totalBufferSize - expectedChunkSize;
                const chunkWatermark = chunk.byteLength - chunkOverflowAmount;
                const chunkBelowWatermark = chunk.slice(0, chunkWatermark);
                const chunkOverflow = chunk.slice(chunkWatermark);
                const chunkBuffers = this.buffers.splice(0, i);
                chunkBuffers.push(chunkBelowWatermark);
                this.buffers[0] = chunkOverflow;
                return Buffer.concat(chunkBuffers);
            }
        }
        return null;
    }
    flush() {
        const remaining = Buffer.concat(this.buffers);
        this.buffers.length = 0;
        return remaining;
    }
}
exports.ChunkBuffer = ChunkBuffer;
function chunker(expectedChunkSize, { flush } = { flush: false }) {
    return function (stream) {
        return __asyncGenerator(this, arguments, function* () {
            var e_1, _a;
            const chunkBuffer = new ChunkBuffer();
            try {
                for (var stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield __await(stream_1.next()), !stream_1_1.done;) {
                    const chunk = stream_1_1.value;
                    chunkBuffer.push(chunk);
                    while (true) {
                        const sizedChunk = chunkBuffer.pop(expectedChunkSize);
                        if (!sizedChunk) {
                            break;
                        }
                        yield yield __await(sizedChunk);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (stream_1_1 && !stream_1_1.done && (_a = stream_1.return)) yield __await(_a.call(stream_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (flush) {
                const flushedBuffer = chunkBuffer.flush();
                if (flushedBuffer.byteLength > 0) {
                    yield yield __await(flushedBuffer);
                }
            }
        });
    };
}
exports.chunker = chunker;
