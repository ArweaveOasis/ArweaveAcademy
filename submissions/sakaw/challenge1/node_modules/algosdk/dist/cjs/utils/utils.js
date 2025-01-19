"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNode = exports.removeUndefinedProperties = exports.concatArrays = exports.arrayEqual = exports.parseJSON = void 0;
const json_bigint_1 = __importDefault(require("json-bigint"));
const intDecoding_1 = __importDefault(require("../types/intDecoding"));
const JSONbig = (0, json_bigint_1.default)({ useNativeBigInt: true, strict: true });
/**
 * Parse JSON with additional options.
 * @param str - The JSON string to parse.
 * @param options - Options object to configure how integers in
 *   this request's JSON response will be decoded. Use the `intDecoding`
 *   property with one of the following options:
 *
 *   * "default": All integers will be decoded as Numbers, meaning any values greater than
 *     Number.MAX_SAFE_INTEGER will lose precision.
 *   * "safe": All integers will be decoded as Numbers, but if any values are greater than
 *     Number.MAX_SAFE_INTEGER an error will be thrown.
 *   * "mixed": Integers will be decoded as Numbers if they are less than or equal to
 *     Number.MAX_SAFE_INTEGER, otherwise they will be decoded as BigInts.
 *   * "bigint": All integers will be decoded as BigInts.
 *
 *   Defaults to "default" if not included.
 */
function parseJSON(str, options) {
    const intDecoding = options && options.intDecoding ? options.intDecoding : intDecoding_1.default.DEFAULT;
    return JSONbig.parse(str, (_, value) => {
        if (value != null &&
            typeof value === 'object' &&
            Object.getPrototypeOf(value) == null) {
            // JSONbig.parse objects are created with Object.create(null) and thus have a null prototype
            // let us remedy that
            Object.setPrototypeOf(value, Object.prototype);
        }
        if (typeof value === 'bigint') {
            if (intDecoding === 'safe' && value > Number.MAX_SAFE_INTEGER) {
                throw new Error(`Integer exceeds maximum safe integer: ${value.toString()}. Try parsing with a different intDecoding option.`);
            }
            if (intDecoding === 'bigint' ||
                (intDecoding === 'mixed' && value > Number.MAX_SAFE_INTEGER)) {
                return value;
            }
            // JSONbig.parse converts number to BigInts if they are >= 10**15. This is smaller than
            // Number.MAX_SAFE_INTEGER, so we can convert some BigInts back to normal numbers.
            return Number(value);
        }
        if (typeof value === 'number') {
            if (intDecoding === 'bigint' && Number.isInteger(value)) {
                return BigInt(value);
            }
        }
        return value;
    });
}
exports.parseJSON = parseJSON;
/**
 * ArrayEqual takes two arrays and return true if equal, false otherwise
 */
function arrayEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    return Array.from(a).every((val, i) => val === b[i]);
}
exports.arrayEqual = arrayEqual;
/**
 * ConcatArrays takes n number arrays and returns a joint Uint8Array
 * @param arrs - An arbitrary number of n array-like number list arguments
 * @returns [a,b]
 */
function concatArrays(...arrs) {
    const size = arrs.reduce((sum, arr) => sum + arr.length, 0);
    const c = new Uint8Array(size);
    let offset = 0;
    for (let i = 0; i < arrs.length; i++) {
        c.set(arrs[i], offset);
        offset += arrs[i].length;
    }
    return c;
}
exports.concatArrays = concatArrays;
/**
 * Remove undefined properties from an object
 * @param obj - An object, preferably one with some undefined properties
 * @returns A copy of the object with undefined properties removed
 */
function removeUndefinedProperties(obj) {
    const mutableCopy = { ...obj };
    Object.keys(mutableCopy).forEach((key) => {
        if (typeof mutableCopy[key] === 'undefined')
            delete mutableCopy[key];
    });
    return mutableCopy;
}
exports.removeUndefinedProperties = removeUndefinedProperties;
/**
 * Check whether the environment is Node.js (as opposed to the browser)
 * @returns True if Node.js environment, false otherwise
 */
function isNode() {
    return (typeof process === 'object' &&
        typeof process.versions === 'object' &&
        typeof process.versions.node !== 'undefined');
}
exports.isNode = isNode;
//# sourceMappingURL=utils.js.map