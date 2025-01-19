/// <reference types="node" />
declare type Hex = string;
declare type Path = string;
declare type Keys = {
    key: Buffer;
    chainCode: Buffer;
};
export declare const getMasterKeyFromSeed: (seed: Hex) => Keys;
export declare const getPublicKey: (privateKey: Buffer, withZeroByte?: boolean) => Buffer;
export declare const isValidPath: (path: string) => boolean;
export declare const derivePath: (path: Path, seed: Hex, offset?: number) => Keys;
export {};
