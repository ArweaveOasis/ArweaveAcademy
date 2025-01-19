/**
 * This file is a wrapper of msgpack.js.
 * The wrapper was written in order to ensure correct encoding of Algorand Transaction and other formats.
 * In particular, it matches go-algorand blockchain client, written in go (https://www.github.com/algorand/go-algorand.
 * Algorand's msgpack encoding follows to following rules -
 *  1. Every integer must be encoded to the smallest type possible (0-255-\>8bit, 256-65535-\>16bit, etx)
 *  2. All fields names must be sorted
 *  3. All empty and 0 fields should be omitted
 *  4. Every positive number must be encoded as uint
 *  5. Binary blob should be used for binary data and string for strings
 *  */
export declare const ERROR_CONTAINS_EMPTY_STRING = "The object contains empty or 0 values. First empty or 0 value encountered during encoding: ";
/**
 * encode encodes objects using msgpack
 * @param obj - a dictionary to be encoded. Must not contain empty or 0 values.
 * @returns msgpack representation of the object
 * @throws Error containing ERROR_CONTAINS_EMPTY_STRING if the object contains empty or zero values
 */
export declare function encode(obj: Record<string | number | symbol, any>): Uint8Array;
export declare function decode(buffer: ArrayLike<number>): unknown;
