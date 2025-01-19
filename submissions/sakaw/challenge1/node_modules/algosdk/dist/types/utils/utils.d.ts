import IntDecoding from '../types/intDecoding';
export interface JSONOptions {
    intDecoding?: IntDecoding;
}
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
export declare function parseJSON(str: string, options?: JSONOptions): any;
/**
 * ArrayEqual takes two arrays and return true if equal, false otherwise
 */
export declare function arrayEqual(a: ArrayLike<any>, b: ArrayLike<any>): boolean;
/**
 * ConcatArrays takes n number arrays and returns a joint Uint8Array
 * @param arrs - An arbitrary number of n array-like number list arguments
 * @returns [a,b]
 */
export declare function concatArrays(...arrs: ArrayLike<number>[]): Uint8Array;
/**
 * Remove undefined properties from an object
 * @param obj - An object, preferably one with some undefined properties
 * @returns A copy of the object with undefined properties removed
 */
export declare function removeUndefinedProperties(obj: Record<string | number | symbol, any>): {
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
};
/**
 * Check whether the environment is Node.js (as opposed to the browser)
 * @returns True if Node.js environment, false otherwise
 */
export declare function isNode(): boolean;
