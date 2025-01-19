"use strict";
/* eslint-disable no-bitwise */
/**
 * Utilities for working with program bytes.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.langspecLogicSigVersion = exports.langspecEvalMaxVersion = exports.checkPushByteOp = exports.checkPushIntOp = exports.checkByteConstBlock = exports.checkIntConstBlock = exports.checkProgram = exports.readProgram = exports.parseUvarint = void 0;
/** @deprecated langspec.json is deprecated aross all SDKs */
const langspec_json_1 = __importDefault(require("./langspec.json"));
/** @deprecated for langspec.json is deprecated aross all SDKs */
let opcodes;
/** @deprecated for langspec.json is deprecated aross all SDKs */
const maxCost = 20000;
/** @deprecated for langspec.json is deprecated aross all SDKs */
const maxLength = 1000;
/** @deprecated for langspec.json is deprecated aross all SDKs */
function parseUvarint(array) {
    let x = 0;
    let s = 0;
    for (let i = 0; i < array.length; i++) {
        const b = array[i];
        if (b < 0x80) {
            if (i > 9 || (i === 9 && b > 1)) {
                return [0, -(i + 1)];
            }
            return [x | (b << s), i + 1];
        }
        x += (b & 0x7f) << s;
        s += 7;
    }
    return [0, 0];
}
exports.parseUvarint = parseUvarint;
/** @deprecated for langspec.json is deprecated aross all SDKs */
function readIntConstBlock(program, pc) {
    let size = 1;
    const parsed = parseUvarint(program.slice(pc + size));
    const numInts = parsed[0];
    let bytesUsed = parsed[1];
    if (bytesUsed <= 0) {
        throw new Error(`could not decode int const block size at pc=${pc + size}`);
    }
    const ints = [];
    size += bytesUsed;
    for (let i = 0; i < numInts; i++) {
        if (pc + size >= program.length) {
            throw new Error('intcblock ran past end of program');
        }
        let numberFound;
        [numberFound, bytesUsed] = parseUvarint(program.slice(pc + size));
        if (bytesUsed <= 0) {
            throw new Error(`could not decode int const[${i}] block size at pc=${pc + size}`);
        }
        ints.push(numberFound);
        size += bytesUsed;
    }
    return [size, ints];
}
/** @deprecated for langspec.json is deprecated aross all SDKs */
function readByteConstBlock(program, pc) {
    let size = 1;
    const parsed = parseUvarint(program.slice(pc + size));
    const numInts = parsed[0];
    let bytesUsed = parsed[1];
    if (bytesUsed <= 0) {
        throw new Error(`could not decode []byte const block size at pc=${pc + size}`);
    }
    const byteArrays = [];
    size += bytesUsed;
    for (let i = 0; i < numInts; i++) {
        if (pc + size >= program.length) {
            throw new Error('bytecblock ran past end of program');
        }
        let itemLen;
        [itemLen, bytesUsed] = parseUvarint(program.slice(pc + size));
        if (bytesUsed <= 0) {
            throw new Error(`could not decode []byte] const[${i}] block size at pc=${pc + size}`);
        }
        size += bytesUsed;
        if (pc + size + itemLen > program.length) {
            throw new Error('bytecblock ran past end of program');
        }
        const byteArray = program.slice(pc + size, pc + size + itemLen);
        byteArrays.push(byteArray);
        size += itemLen;
    }
    return [size, byteArrays];
}
/** @deprecated for langspec.json is deprecated aross all SDKs */
function readPushIntOp(program, pc) {
    let size = 1;
    const [numberFound, bytesUsed] = parseUvarint(program.slice(pc + size));
    if (bytesUsed <= 0) {
        throw new Error(`could not decode push int const at pc=${pc + size}`);
    }
    size += bytesUsed;
    return [size, numberFound];
}
/** @deprecated for langspec.json is deprecated aross all SDKs */
function readPushByteOp(program, pc) {
    let size = 1;
    const [itemLen, bytesUsed] = parseUvarint(program.slice(pc + size));
    if (bytesUsed <= 0) {
        throw new Error(`could not decode push []byte const size at pc=${pc + size}`);
    }
    size += bytesUsed;
    if (pc + size + itemLen > program.length) {
        throw new Error('pushbytes ran past end of program');
    }
    const byteArray = program.slice(pc + size, pc + size + itemLen);
    size += itemLen;
    return [size, byteArray];
}
/** readProgram validates program for length and running cost,
 * and additionally provides the found int variables and byte blocks
 *
 * @deprecated Validation relies on metadata (`langspec.json`) that
 * does not accurately represent opcode behavior across program versions.
 * The behavior of `readProgram` relies on `langspec.json`.
 * Thus, this method is being deprecated.
 *
 * @param program - Program to check
 * @param args - Program arguments as array of Uint8Array arrays
 * @throws
 * @returns
 */
function readProgram(program, args) {
    const intcblockOpcode = 32;
    const bytecblockOpcode = 38;
    const pushbytesOpcode = 128;
    const pushintOpcode = 129;
    if (!program) {
        throw new Error('empty program');
    }
    if (typeof args === 'undefined') {
        // eslint-disable-next-line no-param-reassign
        args = [];
    }
    if (!Array.isArray(args)) {
        throw new Error('invalid arguments');
    }
    const [version, vlen] = parseUvarint(program);
    if (vlen <= 0) {
        throw new Error('version parsing error');
    }
    if (version > langspec_json_1.default.EvalMaxVersion) {
        throw new Error('unsupported version');
    }
    let cost = 0;
    let { length } = program;
    for (const arg of args) {
        length += arg.length;
    }
    if (length > maxLength) {
        throw new Error('program too long');
    }
    if (!opcodes) {
        opcodes = {};
        for (const op of langspec_json_1.default.Ops) {
            opcodes[op.Opcode] = op;
        }
    }
    let pc = vlen;
    let ints = [];
    let byteArrays = [];
    while (pc < program.length) {
        const op = opcodes[program[pc]];
        if (op === undefined) {
            throw new Error('invalid instruction');
        }
        cost += op.Cost;
        let size = op.Size;
        if (size === 0) {
            switch (op.Opcode) {
                case intcblockOpcode: {
                    let foundInts;
                    [size, foundInts] = readIntConstBlock(program, pc);
                    ints = ints.concat(foundInts);
                    break;
                }
                case bytecblockOpcode: {
                    let foundByteArrays;
                    [size, foundByteArrays] = readByteConstBlock(program, pc);
                    byteArrays = byteArrays.concat(foundByteArrays);
                    break;
                }
                case pushintOpcode: {
                    let foundInt;
                    [size, foundInt] = readPushIntOp(program, pc);
                    ints.push(foundInt);
                    break;
                }
                case pushbytesOpcode: {
                    let foundByteArray;
                    [size, foundByteArray] = readPushByteOp(program, pc);
                    byteArrays.push(foundByteArray);
                    break;
                }
                default: {
                    throw new Error('invalid instruction');
                }
            }
        }
        pc += size;
    }
    // costs calculated dynamically starting in v4
    if (version < 4 && cost > maxCost) {
        throw new Error('program too costly for version < 4. consider using v4.');
    }
    return [ints, byteArrays, true];
}
exports.readProgram = readProgram;
/**
 * checkProgram validates program for length and running cost
 *
 * @deprecated Validation relies on metadata (`langspec.json`) that
 * does not accurately represent opcode behavior across program versions.
 * The behavior of `checkProgram` relies on `langspec.json`.
 * Thus, this method is being deprecated.
 *
 * @param program - Program to check
 * @param args - Program arguments as array of Uint8Array arrays
 * @throws
 * @returns true if success
 */
function checkProgram(program, args) {
    const [, , success] = readProgram(program, args);
    return success;
}
exports.checkProgram = checkProgram;
/** @deprecated for langspec.json is deprecated aross all SDKs */
function checkIntConstBlock(program, pc) {
    const [size] = readIntConstBlock(program, pc);
    return size;
}
exports.checkIntConstBlock = checkIntConstBlock;
/** @deprecated for langspec.json is deprecated aross all SDKs */
function checkByteConstBlock(program, pc) {
    const [size] = readByteConstBlock(program, pc);
    return size;
}
exports.checkByteConstBlock = checkByteConstBlock;
/** @deprecated for langspec.json is deprecated aross all SDKs */
function checkPushIntOp(program, pc) {
    const [size] = readPushIntOp(program, pc);
    return size;
}
exports.checkPushIntOp = checkPushIntOp;
/** @deprecated for langspec.json is deprecated aross all SDKs */
function checkPushByteOp(program, pc) {
    const [size] = readPushByteOp(program, pc);
    return size;
}
exports.checkPushByteOp = checkPushByteOp;
/** @deprecated for langspec.json is deprecated aross all SDKs */
exports.langspecEvalMaxVersion = langspec_json_1.default.EvalMaxVersion;
/** @deprecated for langspec.json is deprecated aross all SDKs */
exports.langspecLogicSigVersion = langspec_json_1.default.LogicSigVersion;
//# sourceMappingURL=logic.js.map