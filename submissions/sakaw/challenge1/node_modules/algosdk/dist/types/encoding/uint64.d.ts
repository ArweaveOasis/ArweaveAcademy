/**
 * encodeUint64 converts an integer to its binary representation.
 * @param num - The number to convert. This must be an unsigned integer less than
 *   2^64.
 * @returns An 8-byte typed array containing the big-endian encoding of the input
 *   integer.
 */
export declare function encodeUint64(num: number | bigint): Uint8Array;
/**
 * decodeUint64 produces an integer from a binary representation.
 * @param data - An typed array containing the big-endian encoding of an unsigned integer
 *   less than 2^64. This array must be at most 8 bytes long.
 * @param decodingMode - Configure how the integer will be
 *   decoded.
 *
 *   The options are:
 *   * "safe": The integer will be decoded as a Number, but if it is greater than
 *     Number.MAX_SAFE_INTEGER an error will be thrown.
 *   * "mixed": The integer will be decoded as a Number if it is less than or equal to
 *     Number.MAX_SAFE_INTEGER, otherwise it will be decoded as a BigInt.
 *   * "bigint": The integer will always be decoded as a BigInt.
 *
 *   Defaults to "safe" if not included.
 * @returns The integer that was encoded in the input data. The return type will
 *   be determined by the parameter decodingMode.
 */
export declare function decodeUint64(data: Uint8Array, decodingMode: 'safe'): number;
export declare function decodeUint64(data: Uint8Array, decodingMode: 'mixed'): number | bigint;
export declare function decodeUint64(data: Uint8Array, decodingMode: 'bigint'): bigint;
