"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeStream = exports.decodeArrayStream = exports.decodeAsync = void 0;
const Decoder_1 = require("./Decoder");
const decode_1 = require("./decode");
const stream_1 = require("./utils/stream");
async function decodeAsync(streamLike, options = decode_1.defaultDecodeOptions) {
    const stream = stream_1.ensureAsyncIterabe(streamLike);
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeAsync(stream);
}
exports.decodeAsync = decodeAsync;
function decodeArrayStream(streamLike, options = decode_1.defaultDecodeOptions) {
    const stream = stream_1.ensureAsyncIterabe(streamLike);
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeArrayStream(stream);
}
exports.decodeArrayStream = decodeArrayStream;
function decodeStream(streamLike, options = decode_1.defaultDecodeOptions) {
    const stream = stream_1.ensureAsyncIterabe(streamLike);
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeStream(stream);
}
exports.decodeStream = decodeStream;
//# sourceMappingURL=decodeAsync.js.map