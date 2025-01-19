"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportForTesting = exports.keccak256 = void 0;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer");
const keccak_1 = __importDefault(require("keccak"));
function keccak256(value) {
    value = toBuffer(value);
    return (0, keccak_1.default)("keccak256")
        .update(value)
        .digest();
}
exports.keccak256 = keccak256;
function toBuffer(value) {
    if (!buffer_1.Buffer.isBuffer(value)) {
        if (Array.isArray(value)) {
            value = buffer_1.Buffer.from(value);
        }
        else if (typeof value === "string") {
            if (isHexString(value)) {
                value = buffer_1.Buffer.from(padToEven(stripHexPrefix(value)), "hex");
            }
            else {
                value = buffer_1.Buffer.from(value);
            }
        }
        else if (typeof value === "number") {
            value = intToBuffer(value);
        }
        else if (value === null || value === undefined) {
            value = buffer_1.Buffer.allocUnsafe(0);
        }
        else if (bn_js_1.default.isBN(value)) {
            value = value.toArrayLike(buffer_1.Buffer);
        }
        else if (value.toArray) {
            // converts a BN to a Buffer
            value = buffer_1.Buffer.from(value.toArray());
        }
        else {
            throw new Error("invalid type");
        }
    }
    return value;
}
function isHexString(value, length) {
    if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
        return false;
    }
    if (length && value.length !== 2 + 2 * length) {
        return false;
    }
    return true;
}
function padToEven(value) {
    if (typeof value !== "string") {
        throw new Error(`while padding to even, value must be string, is currently ${typeof value}, while padToEven.`);
    }
    if (value.length % 2) {
        value = `0${value}`;
    }
    return value;
}
function stripHexPrefix(value) {
    if (typeof value !== "string") {
        return value;
    }
    return isHexPrefixed(value) ? value.slice(2) : value;
}
function isHexPrefixed(value) {
    if (typeof value !== "string") {
        throw new Error("value must be type 'string', is currently type " + typeof value + ", while checking isHexPrefixed.");
    }
    return value.startsWith("0x");
}
function intToBuffer(i) {
    const hex = intToHex(i);
    return buffer_1.Buffer.from(padToEven(hex.slice(2)), "hex");
}
function intToHex(i) {
    const hex = i.toString(16);
    return `0x${hex}`;
}
if (typeof window !== "undefined") {
    window.keccak256 = keccak256;
}
exports.default = keccak256;
exports.exportForTesting = {
    intToBuffer,
    intToHex,
    isHexPrefixed,
    stripHexPrefix,
    padToEven,
    isHexString,
    toBuffer,
};
//# sourceMappingURL=keccak256.js.map