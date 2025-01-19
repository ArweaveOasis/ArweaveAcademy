/// <reference types="node" />
import SolanaSigner from "./SolanaSigner";
export default class HexSolanaSigner extends SolanaSigner {
    signatureType: number;
    constructor(provider: any);
    sign(message: Uint8Array): Promise<Uint8Array>;
    static verify(pk: Buffer, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
}
