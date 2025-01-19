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
import * as msgpack from 'algo-msgpack-with-bigint';
// Errors
export const ERROR_CONTAINS_EMPTY_STRING = 'The object contains empty or 0 values. First empty or 0 value encountered during encoding: ';
/**
 * containsEmpty returns true if any of the object's values are empty, false otherwise.
 * Empty arrays considered empty
 * @param obj - The object to check
 * @returns \{true, empty key\} if contains empty, \{false, undefined\} otherwise
 */
function containsEmpty(obj) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (!obj[key] || obj[key].length === 0) {
                return { containsEmpty: true, firstEmptyKey: key };
            }
        }
    }
    return { containsEmpty: false, firstEmptyKey: undefined };
}
/**
 * encode encodes objects using msgpack
 * @param obj - a dictionary to be encoded. Must not contain empty or 0 values.
 * @returns msgpack representation of the object
 * @throws Error containing ERROR_CONTAINS_EMPTY_STRING if the object contains empty or zero values
 */
export function encode(obj) {
    // Check for empty values
    const emptyCheck = containsEmpty(obj);
    if (emptyCheck.containsEmpty) {
        throw new Error(ERROR_CONTAINS_EMPTY_STRING + emptyCheck.firstEmptyKey);
    }
    // enable the canonical option
    const options = { sortKeys: true };
    return msgpack.encode(obj, options);
}
export function decode(buffer) {
    return msgpack.decode(buffer);
}
//# sourceMappingURL=encoding.js.map