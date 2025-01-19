/// <reference types="node" />
import type { Signer } from "../Signer";
export default class Rsa4096Pss implements Signer {
    private _key;
    pk?: string | undefined;
    readonly signatureType: number;
    readonly ownerLength: number;
    readonly signatureLength: number;
    private readonly _publicKey;
    get publicKey(): Buffer;
    constructor(_key: string, pk?: string | undefined);
    sign(message: Uint8Array): Uint8Array;
    static verify(pk: string | Buffer, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
}
