"use strict";
// Main Functions:
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTimestampExtension = exports.encodeTimestampExtension = exports.decodeTimestampToTimeSpec = exports.encodeTimeSpecToTimestamp = exports.encodeDateToTimeSpec = exports.EXT_TIMESTAMP = exports.ExtData = exports.ExtensionCodec = exports.Encoder = exports.Decoder = exports.decodeStream = exports.decodeArrayStream = exports.decodeAsync = exports.decode = exports.encode = void 0;
var encode_1 = require("./encode");
Object.defineProperty(exports, "encode", { enumerable: true, get: function () { return encode_1.encode; } });
var decode_1 = require("./decode");
Object.defineProperty(exports, "decode", { enumerable: true, get: function () { return decode_1.decode; } });
var decodeAsync_1 = require("./decodeAsync");
Object.defineProperty(exports, "decodeAsync", { enumerable: true, get: function () { return decodeAsync_1.decodeAsync; } });
Object.defineProperty(exports, "decodeArrayStream", { enumerable: true, get: function () { return decodeAsync_1.decodeArrayStream; } });
Object.defineProperty(exports, "decodeStream", { enumerable: true, get: function () { return decodeAsync_1.decodeStream; } });
/**
 * @experimental `Decoder` is exported for experimental use.
 */
var Decoder_1 = require("./Decoder");
Object.defineProperty(exports, "Decoder", { enumerable: true, get: function () { return Decoder_1.Decoder; } });
/**
 * @experimental `Encoder` is exported for experimental use.
 */
var Encoder_1 = require("./Encoder");
Object.defineProperty(exports, "Encoder", { enumerable: true, get: function () { return Encoder_1.Encoder; } });
// Utilitiies for Extension Types:
var ExtensionCodec_1 = require("./ExtensionCodec");
Object.defineProperty(exports, "ExtensionCodec", { enumerable: true, get: function () { return ExtensionCodec_1.ExtensionCodec; } });
var ExtData_1 = require("./ExtData");
Object.defineProperty(exports, "ExtData", { enumerable: true, get: function () { return ExtData_1.ExtData; } });
var timestamp_1 = require("./timestamp");
Object.defineProperty(exports, "EXT_TIMESTAMP", { enumerable: true, get: function () { return timestamp_1.EXT_TIMESTAMP; } });
Object.defineProperty(exports, "encodeDateToTimeSpec", { enumerable: true, get: function () { return timestamp_1.encodeDateToTimeSpec; } });
Object.defineProperty(exports, "encodeTimeSpecToTimestamp", { enumerable: true, get: function () { return timestamp_1.encodeTimeSpecToTimestamp; } });
Object.defineProperty(exports, "decodeTimestampToTimeSpec", { enumerable: true, get: function () { return timestamp_1.decodeTimestampToTimeSpec; } });
Object.defineProperty(exports, "encodeTimestampExtension", { enumerable: true, get: function () { return timestamp_1.encodeTimestampExtension; } });
Object.defineProperty(exports, "decodeTimestampExtension", { enumerable: true, get: function () { return timestamp_1.decodeTimestampExtension; } });
//# sourceMappingURL=index.js.map