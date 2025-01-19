"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encode = void 0;
const Encoder_1 = require("./Encoder");
const defaultEncodeOptions = {};
/**
 * It encodes `value` in the MessagePack format and
 * returns a byte buffer.
 *
 * The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
 */
function encode(value, options = defaultEncodeOptions) {
    const encoder = new Encoder_1.Encoder(options.extensionCodec, options.context, options.maxDepth, options.initialBufferSize, options.sortKeys, options.forceFloat32, options.ignoreUndefined, options.forceIntegerToFloat);
    return encoder.encode(value);
}
exports.encode = encode;
//# sourceMappingURL=encode.js.map