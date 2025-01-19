/// <reference types="node" />
export declare abstract class Signer {
    readonly publicKey: Buffer;
    readonly signatureType: number;
    readonly signatureLength: number;
    readonly ownerLength: number;
    readonly pem?: string | Buffer;
    abstract sign(message: Uint8Array, _opts?: any): Promise<Uint8Array> | Uint8Array;
    static verify(_pk: string | Buffer, _message: Uint8Array, _signature: Uint8Array, _opts?: any): boolean;
}
