"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.defaultDecodeOptions = void 0;
const Decoder_1 = require("./Decoder");
exports.defaultDecodeOptions = {};
/**
 * It decodes a MessagePack-encoded buffer.
 *
 * This is a synchronous decoding function. See other variants for asynchronous decoding: `decodeAsync()`, `decodeStream()`, `decodeArrayStream()`.
 */
function decode(buffer, options = exports.defaultDecodeOptions) {
    const decoder = new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decode(buffer);
}
exports.decode = decode;
//# sourceMappingURL=decode.js.map