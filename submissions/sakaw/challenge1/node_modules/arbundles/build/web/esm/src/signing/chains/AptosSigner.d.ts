/// <reference types="node" />
import Curve25519 from "../keys/curve25519.js";
export default class AptosSigner extends Curve25519 {
    constructor(privKey: string, pubKey: string);
    get publicKey(): Buffer;
    get key(): Uint8Array;
}
