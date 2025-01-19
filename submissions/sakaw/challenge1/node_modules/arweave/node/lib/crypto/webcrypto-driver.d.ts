/// <reference types="node" />
import { JWKInterface } from "../wallet";
import CryptoInterface, { SignatureOptions } from "./crypto-interface";
export default class WebCryptoDriver implements CryptoInterface {
    readonly keyLength = 4096;
    readonly publicExponent = 65537;
    readonly hashAlgorithm = "sha256";
    readonly driver: SubtleCrypto;
    constructor();
    generateJWK(): Promise<JWKInterface>;
    sign(jwk: JWKInterface, data: Uint8Array, { saltLength }?: SignatureOptions): Promise<Uint8Array>;
    hash(data: Uint8Array, algorithm?: string): Promise<Uint8Array>;
    verify(publicModulus: string, data: Uint8Array, signature: Uint8Array): Promise<boolean>;
    private jwkToCryptoKey;
    private jwkToPublicCryptoKey;
    private detectWebCrypto;
    encrypt(data: Buffer, key: string | Buffer, salt?: string): Promise<Uint8Array>;
    decrypt(encrypted: Buffer, key: string | Buffer, salt?: string): Promise<Uint8Array>;
}
