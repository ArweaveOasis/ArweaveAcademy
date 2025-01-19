/**
 * Utilities for working with program bytes.
 */
/** @deprecated for langspec.json is deprecated aross all SDKs */
export declare function parseUvarint(array: Uint8Array): [numberFound: number, size: number];
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
export declare function readProgram(program: Uint8Array, args?: Uint8Array[]): [ints: number[], byteArrays: Uint8Array[], valid: boolean];
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
export declare function checkProgram(program: Uint8Array, args?: Uint8Array[]): boolean;
/** @deprecated for langspec.json is deprecated aross all SDKs */
export declare function checkIntConstBlock(program: Uint8Array, pc: number): number;
/** @deprecated for langspec.json is deprecated aross all SDKs */
export declare function checkByteConstBlock(program: Uint8Array, pc: number): number;
/** @deprecated for langspec.json is deprecated aross all SDKs */
export declare function checkPushIntOp(program: Uint8Array, pc: number): number;
/** @deprecated for langspec.json is deprecated aross all SDKs */
export declare function checkPushByteOp(program: Uint8Array, pc: number): number;
/** @deprecated for langspec.json is deprecated aross all SDKs */
export declare const langspecEvalMaxVersion: number;
/** @deprecated for langspec.json is deprecated aross all SDKs */
export declare const langspecLogicSigVersion: number;
