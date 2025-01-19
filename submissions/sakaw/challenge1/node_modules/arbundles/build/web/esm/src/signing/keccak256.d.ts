/// <reference types="node" />
import BN from "bn.js";
import { Buffer } from "buffer";
export declare function keccak256(value: Buffer | BN | string | number): any;
declare function toBuffer(value: any): any;
declare function isHexString(value: any, length?: number): boolean;
declare function padToEven(value: any): any;
declare function stripHexPrefix(value: any): any;
declare function isHexPrefixed(value: any): boolean;
declare function intToBuffer(i: number): Buffer;
declare function intToHex(i: number): string;
export default keccak256;
export declare const exportForTesting: {
    intToBuffer: typeof intToBuffer;
    intToHex: typeof intToHex;
    isHexPrefixed: typeof isHexPrefixed;
    stripHexPrefix: typeof stripHexPrefix;
    padToEven: typeof padToEven;
    isHexString: typeof isHexString;
    toBuffer: typeof toBuffer;
};
