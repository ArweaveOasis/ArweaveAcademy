/// <reference types="node" />
import Curve25519 from "../keys/curve25519";
export default class SolanaSigner extends Curve25519 {
    get publicKey(): Buffer;
    get key(): Uint8Array;
    constructor(_key: string);
}
