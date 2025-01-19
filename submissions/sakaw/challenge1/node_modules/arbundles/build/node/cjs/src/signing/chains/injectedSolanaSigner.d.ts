/// <reference types="node" />
import type { Signer } from "../index";
import type { MessageSignerWalletAdapter } from "@solana/wallet-adapter-base";
export default class InjectedSolanaSigner implements Signer {
    private readonly _publicKey;
    readonly ownerLength: number;
    readonly signatureLength: number;
    readonly signatureType: number;
    pem?: string | Buffer;
    provider: MessageSignerWalletAdapter;
    constructor(provider: any);
    get publicKey(): Buffer;
    sign(message: Uint8Array): Promise<Uint8Array>;
    static verify(pk: Buffer, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
}
