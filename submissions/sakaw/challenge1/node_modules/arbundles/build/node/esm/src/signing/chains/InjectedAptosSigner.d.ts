/// <reference types="node" />
import type { Signer } from "../index.js";
export default class InjectedAptosSigner implements Signer {
    private _publicKey;
    readonly ownerLength: number;
    readonly signatureLength: number;
    readonly signatureType: number;
    pem?: string | Buffer;
    protected provider: any;
    constructor(provider: any, publicKey: Buffer);
    get publicKey(): Buffer;
    /**
     * signMessage constructs a message and then signs it.
     * the format is "APTOS(\n)
     * message: <hexString>(\n)
     * nonce: bundlr"
     */
    sign(message: Uint8Array): Promise<Uint8Array>;
    static verify(pk: Buffer, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
}
