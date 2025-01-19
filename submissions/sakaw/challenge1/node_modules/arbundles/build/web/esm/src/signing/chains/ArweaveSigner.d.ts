/// <reference types="node" />
import Rsa4096Pss from "../keys/Rsa4096Pss.js";
import type { JWKInterface } from "../../interface-jwk.js";
export default class ArweaveSigner extends Rsa4096Pss {
    protected jwk: JWKInterface;
    constructor(jwk: JWKInterface);
    get publicKey(): Buffer;
    sign(message: Uint8Array): Uint8Array;
    static verify(pk: string, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
}
