/// <reference types="node" />
import type { Signer } from "./signing/index.js";
import type { Buffer } from "buffer";
type ResolvesTo<T> = T | Promise<T> | ((...args: any[]) => Promise<T>);
export declare abstract class BundleItem {
    readonly signatureType: ResolvesTo<number>;
    readonly rawSignature: ResolvesTo<Buffer>;
    readonly signature: ResolvesTo<string>;
    readonly signatureLength: ResolvesTo<number>;
    readonly rawOwner: ResolvesTo<Buffer>;
    readonly owner: ResolvesTo<string>;
    readonly ownerLength: ResolvesTo<number>;
    readonly rawTarget: ResolvesTo<Buffer>;
    readonly target: ResolvesTo<string>;
    readonly rawAnchor: ResolvesTo<Buffer>;
    readonly anchor: ResolvesTo<string>;
    readonly rawTags: ResolvesTo<Buffer>;
    readonly tags: ResolvesTo<{
        name: string;
        value: string;
    }[]>;
    readonly rawData: ResolvesTo<Buffer>;
    readonly data: ResolvesTo<string>;
    abstract sign(signer: Signer): Promise<Buffer>;
    abstract isValid(): Promise<boolean>;
    static verify(..._: any[]): Promise<boolean>;
}
export {};
