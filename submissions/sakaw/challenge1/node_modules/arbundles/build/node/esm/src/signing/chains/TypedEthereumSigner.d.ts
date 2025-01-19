/// <reference types="node" />
import { SignatureConfig } from "../../constants.js";
import EthereumSigner from "./ethereumSigner.js";
export default class TypedEthereumSigner extends EthereumSigner {
    readonly ownerLength: number;
    readonly signatureLength: number;
    readonly signatureType: SignatureConfig;
    private address;
    private signer;
    constructor(key: string);
    get publicKey(): Buffer;
    sign(message: Uint8Array): Promise<Uint8Array>;
    static verify(pk: string | Buffer, message: Uint8Array, signature: Uint8Array): Promise<boolean>;
}
export declare const domain: {
    name: string;
    version: string;
};
export declare const types: {
    Bundlr: {
        name: string;
        type: string;
    }[];
};
export declare const MESSAGE = "Bundlr(bytes Transaction hash, address address)";
export declare const DOMAIN = "EIP712Domain(string name,string version)";
