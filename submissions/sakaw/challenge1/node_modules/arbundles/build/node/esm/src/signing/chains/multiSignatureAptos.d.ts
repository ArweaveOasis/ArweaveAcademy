/// <reference types="node" />
import type { Signer } from "../index.js";
export default class MultiSignatureAptosSigner implements Signer {
    private _publicKey;
    readonly ownerLength: number;
    readonly signatureLength: number;
    readonly signatureType: number;
    protected collectSignatures: (message: Uint8Array) => Promise<{
        signatures: Buffer[];
        bitmap: number[];
    }>;
    protected provider: any;
    constructor(publicKey: Buffer, collectSignatures: (message: Uint8Array) => Promise<{
        signatures: Buffer[];
        bitmap: number[];
    }>);
    get publicKey(): Buffer;
    sign(message: Uint8Array): Promise<Uint8Array>;
    static verify(pk: Buffer, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
}
