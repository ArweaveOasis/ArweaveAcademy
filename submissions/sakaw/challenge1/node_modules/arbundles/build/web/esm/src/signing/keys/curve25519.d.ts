/// <reference types="node" />
import type { Signer } from "../Signer.js";
export default class Curve25519 implements Signer {
    protected _key: string;
    pk: string;
    readonly ownerLength: number;
    readonly signatureLength: number;
    private readonly _publicKey;
    get publicKey(): Buffer;
    readonly signatureType: number;
    constructor(_key: string, pk: string);
    get key(): Uint8Array;
    sign(message: Uint8Array): Promise<Uint8Array>;
    static verify(pk: string | Buffer, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
}
