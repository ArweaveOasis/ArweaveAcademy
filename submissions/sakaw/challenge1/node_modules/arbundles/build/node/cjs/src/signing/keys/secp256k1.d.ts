/// <reference types="node" />
import type { Signer } from "../Signer";
import { SignatureConfig } from "../../constants";
export default class Secp256k1 implements Signer {
    protected _key: string;
    readonly ownerLength: number;
    readonly signatureLength: number;
    readonly signatureType: SignatureConfig;
    readonly pk: string;
    constructor(_key: string, pk: Buffer);
    get publicKey(): Buffer;
    get key(): Uint8Array;
    static verify(pk: string | Buffer, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
    sign(message: Uint8Array): Promise<Uint8Array>;
}
