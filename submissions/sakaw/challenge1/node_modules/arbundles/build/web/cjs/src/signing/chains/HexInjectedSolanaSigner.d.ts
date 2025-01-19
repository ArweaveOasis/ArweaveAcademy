/// <reference types="node" />
import InjectedSolanaSigner from "./injectedSolanaSigner";
export default class HexSolanaSigner extends InjectedSolanaSigner {
    signatureType: number;
    constructor(provider: any);
    sign(message: Uint8Array): Promise<Uint8Array>;
    static verify(pk: Buffer, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
}
