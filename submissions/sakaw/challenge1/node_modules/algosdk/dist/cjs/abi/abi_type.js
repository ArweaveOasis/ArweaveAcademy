"use strict";
/* eslint-disable no-bitwise */
/* eslint-disable no-use-before-define */
/* eslint-disable class-methods-use-this */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABITupleType = exports.ABIArrayDynamicType = exports.ABIArrayStaticType = exports.ABIStringType = exports.ABIByteType = exports.ABIBoolType = exports.ABIAddressType = exports.ABIUfixedType = exports.ABIUintType = exports.ABIType = exports.LENGTH_ENCODE_BYTE_SIZE = exports.SINGLE_BOOL_SIZE = exports.SINGLE_BYTE_SIZE = exports.ADDR_BYTE_SIZE = exports.MAX_LEN = void 0;
/**
    //ABI-Types: uint<N>: An N-bit unsigned integer (8 <= N <= 512 and N % 8 = 0).
    // | byte (alias for uint8)
    // | ufixed <N> x <M> (8 <= N <= 512, N % 8 = 0, and 0 < M <= 160)
    // | bool
    // | address (alias for byte[32])
    // | <type> [<N>]
    // | <type> []
    // | string
    // | (T1, ..., Tn)
*/
const address_1 = require("../encoding/address");
const bigint_1 = require("../encoding/bigint");
const utils_1 = require("../utils/utils");
exports.MAX_LEN = 2 ** 16 - 1;
exports.ADDR_BYTE_SIZE = 32;
exports.SINGLE_BYTE_SIZE = 1;
exports.SINGLE_BOOL_SIZE = 1;
exports.LENGTH_ENCODE_BYTE_SIZE = 2;
const staticArrayRegexp = /^([a-z\d[\](),]+)\[(0|[1-9][\d]*)]$/;
const ufixedRegexp = /^ufixed([1-9][\d]*)x([1-9][\d]*)$/;
class ABIType {
    // De-serializes the ABI type from a string using the ABI specs
    static from(str) {
        if (str.endsWith('[]')) {
            const arrayArgType = ABIType.from(str.slice(0, str.length - 2));
            return new ABIArrayDynamicType(arrayArgType);
        }
        if (str.endsWith(']')) {
            const stringMatches = str.match(staticArrayRegexp);
            // Match the string itself, array element type, then array length
            if (stringMatches.length !== 3) {
                throw new Error(`malformed static array string: ${str}`);
            }
            // Parse static array using regex
            const arrayLengthStr = stringMatches[2];
            const arrayLength = parseInt(arrayLengthStr, 10);
            if (arrayLength > exports.MAX_LEN) {
                throw new Error(`array length exceeds limit ${exports.MAX_LEN}`);
            }
            // Parse the array element type
            const arrayType = ABIType.from(stringMatches[1]);
            return new ABIArrayStaticType(arrayType, arrayLength);
        }
        if (str.startsWith('uint')) {
            // Checks if the parsed number contains only digits, no whitespaces
            const digitsOnly = (string) => [...string].every((c) => '0123456789'.includes(c));
            const typeSizeStr = str.slice(4, str.length);
            if (!digitsOnly(typeSizeStr)) {
                throw new Error(`malformed uint string: ${typeSizeStr}`);
            }
            const typeSize = parseInt(typeSizeStr, 10);
            if (typeSize > exports.MAX_LEN) {
                throw new Error(`malformed uint string: ${typeSize}`);
            }
            return new ABIUintType(typeSize);
        }
        if (str === 'byte') {
            return new ABIByteType();
        }
        if (str.startsWith('ufixed')) {
            const stringMatches = str.match(ufixedRegexp);
            if (stringMatches.length !== 3) {
                throw new Error(`malformed ufixed type: ${str}`);
            }
            const ufixedSize = parseInt(stringMatches[1], 10);
            const ufixedPrecision = parseInt(stringMatches[2], 10);
            return new ABIUfixedType(ufixedSize, ufixedPrecision);
        }
        if (str === 'bool') {
            return new ABIBoolType();
        }
        if (str === 'address') {
            return new ABIAddressType();
        }
        if (str === 'string') {
            return new ABIStringType();
        }
        if (str.length >= 2 && str[0] === '(' && str[str.length - 1] === ')') {
            const tupleContent = ABITupleType.parseTupleContent(str.slice(1, str.length - 1));
            const tupleTypes = [];
            for (let i = 0; i < tupleContent.length; i++) {
                const ti = ABIType.from(tupleContent[i]);
                tupleTypes.push(ti);
            }
            return new ABITupleType(tupleTypes);
        }
        throw new Error(`cannot convert a string ${str} to an ABI type`);
    }
}
exports.ABIType = ABIType;
class ABIUintType extends ABIType {
    constructor(size) {
        super();
        if (size % 8 !== 0 || size < 8 || size > 512) {
            throw new Error(`unsupported uint type bitSize: ${size}`);
        }
        this.bitSize = size;
    }
    toString() {
        return `uint${this.bitSize}`;
    }
    equals(other) {
        return other instanceof ABIUintType && this.bitSize === other.bitSize;
    }
    isDynamic() {
        return false;
    }
    byteLen() {
        return this.bitSize / 8;
    }
    encode(value) {
        if (typeof value !== 'bigint' && typeof value !== 'number') {
            throw new Error(`Cannot encode value as uint${this.bitSize}: ${value}`);
        }
        if (value >= BigInt(2 ** this.bitSize) || value < BigInt(0)) {
            throw new Error(`${value} is not a non-negative int or too big to fit in size uint${this.bitSize}`);
        }
        if (typeof value === 'number' && !Number.isSafeInteger(value)) {
            throw new Error(`${value} should be converted into a BigInt before it is encoded`);
        }
        return (0, bigint_1.bigIntToBytes)(value, this.bitSize / 8);
    }
    decode(byteString) {
        if (byteString.length !== this.bitSize / 8) {
            throw new Error(`byte string must correspond to a uint${this.bitSize}`);
        }
        return (0, bigint_1.bytesToBigInt)(byteString);
    }
}
exports.ABIUintType = ABIUintType;
class ABIUfixedType extends ABIType {
    constructor(size, denominator) {
        super();
        if (size % 8 !== 0 || size < 8 || size > 512) {
            throw new Error(`unsupported ufixed type bitSize: ${size}`);
        }
        if (denominator > 160 || denominator < 1) {
            throw new Error(`unsupported ufixed type precision: ${denominator}`);
        }
        this.bitSize = size;
        this.precision = denominator;
    }
    toString() {
        return `ufixed${this.bitSize}x${this.precision}`;
    }
    equals(other) {
        return (other instanceof ABIUfixedType &&
            this.bitSize === other.bitSize &&
            this.precision === other.precision);
    }
    isDynamic() {
        return false;
    }
    byteLen() {
        return this.bitSize / 8;
    }
    encode(value) {
        if (typeof value !== 'bigint' && typeof value !== 'number') {
            throw new Error(`Cannot encode value as ${this.toString()}: ${value}`);
        }
        if (value >= BigInt(2 ** this.bitSize) || value < BigInt(0)) {
            throw new Error(`${value} is not a non-negative int or too big to fit in size ${this.toString()}`);
        }
        if (typeof value === 'number' && !Number.isSafeInteger(value)) {
            throw new Error(`${value} should be converted into a BigInt before it is encoded`);
        }
        return (0, bigint_1.bigIntToBytes)(value, this.bitSize / 8);
    }
    decode(byteString) {
        if (byteString.length !== this.bitSize / 8) {
            throw new Error(`byte string must correspond to a ${this.toString()}`);
        }
        return (0, bigint_1.bytesToBigInt)(byteString);
    }
}
exports.ABIUfixedType = ABIUfixedType;
class ABIAddressType extends ABIType {
    toString() {
        return 'address';
    }
    equals(other) {
        return other instanceof ABIAddressType;
    }
    isDynamic() {
        return false;
    }
    byteLen() {
        return exports.ADDR_BYTE_SIZE;
    }
    encode(value) {
        if (typeof value !== 'string' && !(value instanceof Uint8Array)) {
            throw new Error(`Cannot encode value as ${this.toString()}: ${value}`);
        }
        if (typeof value === 'string') {
            const decodedAddress = (0, address_1.decodeAddress)(value);
            return decodedAddress.publicKey;
        }
        // Return the address if it is already in bytes
        if (value.byteLength !== 32) {
            throw new Error(`byte string must be 32 bytes long for an address`);
        }
        return value;
    }
    decode(byteString) {
        if (byteString.byteLength !== 32) {
            throw new Error(`byte string must be 32 bytes long for an address`);
        }
        return (0, address_1.encodeAddress)(byteString);
    }
}
exports.ABIAddressType = ABIAddressType;
class ABIBoolType extends ABIType {
    toString() {
        return 'bool';
    }
    equals(other) {
        return other instanceof ABIBoolType;
    }
    isDynamic() {
        return false;
    }
    byteLen() {
        return exports.SINGLE_BOOL_SIZE;
    }
    encode(value) {
        if (typeof value !== 'boolean') {
            throw new Error(`Cannot encode value as bool: ${value}`);
        }
        if (value) {
            return new Uint8Array([128]);
        }
        return new Uint8Array([0]);
    }
    decode(byteString) {
        if (byteString.byteLength !== 1) {
            throw new Error(`bool string must be 1 byte long`);
        }
        const value = byteString[0];
        if (value === 128) {
            return true;
        }
        if (value === 0) {
            return false;
        }
        throw new Error(`boolean could not be decoded from the byte string`);
    }
}
exports.ABIBoolType = ABIBoolType;
class ABIByteType extends ABIType {
    toString() {
        return 'byte';
    }
    equals(other) {
        return other instanceof ABIByteType;
    }
    isDynamic() {
        return false;
    }
    byteLen() {
        return exports.SINGLE_BYTE_SIZE;
    }
    encode(value) {
        if (typeof value !== 'number' && typeof value !== 'bigint') {
            throw new Error(`Cannot encode value as byte: ${value}`);
        }
        if (typeof value === 'bigint') {
            // eslint-disable-next-line no-param-reassign
            value = Number(value);
        }
        if (value < 0 || value > 255) {
            throw new Error(`${value} cannot be encoded into a byte`);
        }
        return new Uint8Array([value]);
    }
    decode(byteString) {
        if (byteString.byteLength !== 1) {
            throw new Error(`byte string must be 1 byte long`);
        }
        return byteString[0];
    }
}
exports.ABIByteType = ABIByteType;
class ABIStringType extends ABIType {
    toString() {
        return 'string';
    }
    equals(other) {
        return other instanceof ABIStringType;
    }
    isDynamic() {
        return true;
    }
    byteLen() {
        throw new Error(`${this.toString()} is a dynamic type`);
    }
    encode(value) {
        if (typeof value !== 'string' && !(value instanceof Uint8Array)) {
            throw new Error(`Cannot encode value as string: ${value}`);
        }
        const encodedBytes = Buffer.from(value);
        const encodedLength = (0, bigint_1.bigIntToBytes)(encodedBytes.length, exports.LENGTH_ENCODE_BYTE_SIZE);
        const mergedBytes = new Uint8Array(encodedBytes.length + exports.LENGTH_ENCODE_BYTE_SIZE);
        mergedBytes.set(encodedLength);
        mergedBytes.set(encodedBytes, exports.LENGTH_ENCODE_BYTE_SIZE);
        return mergedBytes;
    }
    decode(byteString) {
        if (byteString.length < exports.LENGTH_ENCODE_BYTE_SIZE) {
            throw new Error(`byte string is too short to be decoded. Actual length is ${byteString.length}, but expected at least ${exports.LENGTH_ENCODE_BYTE_SIZE}`);
        }
        const buf = Buffer.from(byteString);
        const byteLength = buf.readUIntBE(0, exports.LENGTH_ENCODE_BYTE_SIZE);
        const byteValue = byteString.slice(exports.LENGTH_ENCODE_BYTE_SIZE, byteString.length);
        if (byteLength !== byteValue.length) {
            throw new Error(`string length bytes do not match the actual length of string. Expected ${byteLength}, got ${byteValue.length}`);
        }
        return Buffer.from(byteValue).toString('utf-8');
    }
}
exports.ABIStringType = ABIStringType;
class ABIArrayStaticType extends ABIType {
    constructor(argType, arrayLength) {
        super();
        if (arrayLength < 0) {
            throw new Error(`static array must have a non negative length: ${arrayLength}`);
        }
        this.childType = argType;
        this.staticLength = arrayLength;
    }
    toString() {
        return `${this.childType.toString()}[${this.staticLength}]`;
    }
    equals(other) {
        return (other instanceof ABIArrayStaticType &&
            this.staticLength === other.staticLength &&
            this.childType.equals(other.childType));
    }
    isDynamic() {
        return this.childType.isDynamic();
    }
    byteLen() {
        if (this.childType.constructor === ABIBoolType) {
            return Math.ceil(this.staticLength / 8);
        }
        return this.staticLength * this.childType.byteLen();
    }
    encode(value) {
        if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
            throw new Error(`Cannot encode value as ${this.toString()}: ${value}`);
        }
        if (value.length !== this.staticLength) {
            throw new Error(`Value array does not match static array length. Expected ${this.staticLength}, got ${value.length}`);
        }
        const convertedTuple = this.toABITupleType();
        return convertedTuple.encode(value);
    }
    decode(byteString) {
        const convertedTuple = this.toABITupleType();
        return convertedTuple.decode(byteString);
    }
    toABITupleType() {
        return new ABITupleType(Array(this.staticLength).fill(this.childType));
    }
}
exports.ABIArrayStaticType = ABIArrayStaticType;
class ABIArrayDynamicType extends ABIType {
    constructor(argType) {
        super();
        this.childType = argType;
    }
    toString() {
        return `${this.childType.toString()}[]`;
    }
    equals(other) {
        return (other instanceof ABIArrayDynamicType &&
            this.childType.equals(other.childType));
    }
    isDynamic() {
        return true;
    }
    byteLen() {
        throw new Error(`${this.toString()} is a dynamic type`);
    }
    encode(value) {
        if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
            throw new Error(`Cannot encode value as ${this.toString()}: ${value}`);
        }
        const convertedTuple = this.toABITupleType(value.length);
        const encodedTuple = convertedTuple.encode(value);
        const encodedLength = (0, bigint_1.bigIntToBytes)(convertedTuple.childTypes.length, exports.LENGTH_ENCODE_BYTE_SIZE);
        const mergedBytes = (0, utils_1.concatArrays)(encodedLength, encodedTuple);
        return mergedBytes;
    }
    decode(byteString) {
        const buf = Buffer.from(byteString);
        const byteLength = buf.readUIntBE(0, exports.LENGTH_ENCODE_BYTE_SIZE);
        const convertedTuple = this.toABITupleType(byteLength);
        return convertedTuple.decode(byteString.slice(exports.LENGTH_ENCODE_BYTE_SIZE, byteString.length));
    }
    toABITupleType(length) {
        return new ABITupleType(Array(length).fill(this.childType));
    }
}
exports.ABIArrayDynamicType = ABIArrayDynamicType;
class ABITupleType extends ABIType {
    constructor(argTypes) {
        super();
        if (argTypes.length >= exports.MAX_LEN) {
            throw new Error('tuple type child type number larger than maximum uint16 error');
        }
        this.childTypes = argTypes;
    }
    toString() {
        const typeStrings = [];
        for (let i = 0; i < this.childTypes.length; i++) {
            typeStrings[i] = this.childTypes[i].toString();
        }
        return `(${typeStrings.join(',')})`;
    }
    equals(other) {
        return (other instanceof ABITupleType &&
            this.childTypes.length === other.childTypes.length &&
            this.childTypes.every((child, index) => child.equals(other.childTypes[index])));
    }
    isDynamic() {
        const isDynamic = (child) => child.isDynamic();
        return this.childTypes.some(isDynamic);
    }
    byteLen() {
        let size = 0;
        for (let i = 0; i < this.childTypes.length; i++) {
            if (this.childTypes[i].constructor === ABIBoolType) {
                const after = findBoolLR(this.childTypes, i, 1);
                const boolNum = after + 1;
                i += after;
                size += Math.trunc((boolNum + 7) / 8);
            }
            else {
                const childByteSize = this.childTypes[i].byteLen();
                size += childByteSize;
            }
        }
        return size;
    }
    encode(value) {
        if (!Array.isArray(value) && !(value instanceof Uint8Array)) {
            throw new Error(`Cannot encode value as ${this.toString()}: ${value}`);
        }
        const values = Array.from(value);
        if (value.length > exports.MAX_LEN) {
            throw new Error('length of tuple array should not exceed a uint16');
        }
        const tupleTypes = this.childTypes;
        const heads = [];
        const tails = [];
        const isDynamicIndex = new Map();
        let i = 0;
        while (i < tupleTypes.length) {
            const tupleType = tupleTypes[i];
            if (tupleType.isDynamic()) {
                // Head is not pre-determined for dynamic types; store a placeholder for now
                isDynamicIndex.set(heads.length, true);
                heads.push(new Uint8Array([0, 0]));
                tails.push(tupleType.encode(values[i]));
            }
            else {
                if (tupleType.constructor === ABIBoolType) {
                    const before = findBoolLR(tupleTypes, i, -1);
                    let after = findBoolLR(tupleTypes, i, 1);
                    // Pack bytes to heads and tails
                    if (before % 8 !== 0) {
                        throw new Error('expected before index should have number of bool mod 8 equal 0');
                    }
                    after = Math.min(7, after);
                    const compressedInt = compressMultipleBool(values.slice(i, i + after + 1));
                    heads.push((0, bigint_1.bigIntToBytes)(compressedInt, 1));
                    i += after;
                }
                else {
                    const encodedTupleValue = tupleType.encode(values[i]);
                    heads.push(encodedTupleValue);
                }
                isDynamicIndex.set(i, false);
                tails.push(new Uint8Array());
            }
            i += 1;
        }
        // Adjust head lengths for dynamic types
        let headLength = 0;
        for (const headElement of heads) {
            headLength += headElement.length;
        }
        // encode any placeholders for dynamic types
        let tailLength = 0;
        for (let j = 0; j < heads.length; j++) {
            if (isDynamicIndex.get(j)) {
                const headValue = headLength + tailLength;
                if (headValue > exports.MAX_LEN) {
                    throw new Error(`byte length of ${headValue} should not exceed a uint16`);
                }
                heads[j] = (0, bigint_1.bigIntToBytes)(headValue, exports.LENGTH_ENCODE_BYTE_SIZE);
            }
            tailLength += tails[j].length;
        }
        return (0, utils_1.concatArrays)(...heads, ...tails);
    }
    decode(byteString) {
        const tupleTypes = this.childTypes;
        const dynamicSegments = [];
        const valuePartition = [];
        let i = 0;
        let iterIndex = 0;
        const buf = Buffer.from(byteString);
        while (i < tupleTypes.length) {
            const tupleType = tupleTypes[i];
            if (tupleType.isDynamic()) {
                if (byteString.slice(iterIndex, byteString.length).length <
                    exports.LENGTH_ENCODE_BYTE_SIZE) {
                    throw new Error('dynamic type in tuple is too short to be decoded');
                }
                const dynamicIndex = buf.readUIntBE(iterIndex, exports.LENGTH_ENCODE_BYTE_SIZE);
                if (dynamicSegments.length > 0) {
                    dynamicSegments[dynamicSegments.length - 1].right = dynamicIndex;
                    // Check that right side of segment is greater than the left side
                    if (dynamicIndex < dynamicSegments[dynamicSegments.length - 1].left) {
                        throw new Error('dynamic index segment miscalculation: left is greater than right index');
                    }
                }
                // Since we do not know where the current dynamic element ends, put a placeholder and update later
                const seg = {
                    left: dynamicIndex,
                    right: -1,
                };
                dynamicSegments.push(seg);
                valuePartition.push(null);
                iterIndex += exports.LENGTH_ENCODE_BYTE_SIZE;
            }
            else {
                // eslint-disable-next-line no-lonely-if
                if (tupleType.constructor === ABIBoolType) {
                    const before = findBoolLR(this.childTypes, i, -1);
                    let after = findBoolLR(this.childTypes, i, 1);
                    if (before % 8 !== 0) {
                        throw new Error('expected before bool number mod 8 === 0');
                    }
                    after = Math.min(7, after);
                    // Parse bool in a byte to multiple byte strings
                    for (let boolIndex = 0; boolIndex <= after; boolIndex++) {
                        const boolMask = 0x80 >> boolIndex;
                        if ((byteString[iterIndex] & boolMask) > 0) {
                            valuePartition.push(new Uint8Array([128]));
                        }
                        else {
                            valuePartition.push(new Uint8Array([0]));
                        }
                    }
                    i += after;
                    iterIndex += 1;
                }
                else {
                    const currLen = tupleType.byteLen();
                    valuePartition.push(byteString.slice(iterIndex, iterIndex + currLen));
                    iterIndex += currLen;
                }
            }
            if (i !== tupleTypes.length - 1 && iterIndex >= byteString.length) {
                throw new Error('input byte not enough to decode');
            }
            i += 1;
        }
        if (dynamicSegments.length > 0) {
            dynamicSegments[dynamicSegments.length - 1].right = byteString.length;
            iterIndex = byteString.length;
        }
        if (iterIndex < byteString.length) {
            throw new Error('input byte not fully consumed');
        }
        // Check segment indices are valid
        // If the dynamic segment are not consecutive and well-ordered, we return error
        for (let j = 0; j < dynamicSegments.length; j++) {
            const seg = dynamicSegments[j];
            if (seg.left > seg.right) {
                throw new Error('dynamic segment should display a [l, r] space with l <= r');
            }
            if (j !== dynamicSegments.length - 1 &&
                seg.right !== dynamicSegments[j + 1].left) {
                throw new Error('dynamic segment should be consecutive');
            }
        }
        // Check dynamic element partitions
        let segIndex = 0;
        for (let j = 0; j < tupleTypes.length; j++) {
            if (tupleTypes[j].isDynamic()) {
                valuePartition[j] = byteString.slice(dynamicSegments[segIndex].left, dynamicSegments[segIndex].right);
                segIndex += 1;
            }
        }
        // Decode each tuple element
        const returnValues = [];
        for (let j = 0; j < tupleTypes.length; j++) {
            const valueTi = tupleTypes[j].decode(valuePartition[j]);
            returnValues.push(valueTi);
        }
        return returnValues;
    }
    static parseTupleContent(str) {
        if (str.length === 0) {
            return [];
        }
        if (str.endsWith(',') || str.startsWith(',')) {
            throw new Error('tuple string should not start with comma');
        }
        if (str.includes(',,')) {
            throw new Error('tuple string should not have consecutive commas');
        }
        const tupleStrings = [];
        let depth = 0;
        let word = '';
        for (const char of str) {
            word += char;
            if (char === '(') {
                depth += 1;
            }
            else if (char === ')') {
                depth -= 1;
            }
            else if (char === ',') {
                // If the comma is at depth 0, then append the word as token.
                if (depth === 0) {
                    tupleStrings.push(word.slice(0, word.length - 1));
                    word = '';
                }
            }
        }
        if (word.length !== 0) {
            tupleStrings.push(word);
        }
        if (depth !== 0) {
            throw new Error('tuple string has mismatched parentheses');
        }
        return tupleStrings;
    }
}
exports.ABITupleType = ABITupleType;
// compressMultipleBool compresses consecutive bool values into a byte in ABI tuple / array value.
function compressMultipleBool(valueList) {
    let res = 0;
    if (valueList.length > 8) {
        throw new Error('value list passed in should be no greater than length 8');
    }
    for (let i = 0; i < valueList.length; i++) {
        const boolVal = valueList[i];
        if (typeof boolVal !== 'boolean') {
            throw new Error('non-boolean values cannot be compressed into a byte');
        }
        if (boolVal) {
            res |= 1 << (7 - i);
        }
    }
    return res;
}
// Assume that the current index on the list of type is an ABI bool type.
// It returns the difference between the current index and the index of the furthest consecutive Bool type.
function findBoolLR(typeList, index, delta) {
    let until = 0;
    while (true) {
        const curr = index + delta * until;
        if (typeList[curr].constructor === ABIBoolType) {
            if (curr !== typeList.length - 1 && delta === 1) {
                until += 1;
            }
            else if (curr > 0 && delta === -1) {
                until += 1;
            }
            else {
                break;
            }
        }
        else {
            until -= 1;
            break;
        }
    }
    return until;
}
//# sourceMappingURL=abi_type.js.map