/// <reference types="node" />
import type { BundleItem } from "./BundleItem.js";
import type Arweave from "arweave";
import type { JWKInterface } from "./interface-jwk.js";
import type { CreateTransactionInterface, Transaction } from "./nodeUtils.js";
type ResolvesTo<T> = T | Promise<T> | ((...args: any[]) => Promise<T>);
export interface BundleInterface {
    readonly length: ResolvesTo<number>;
    readonly items: BundleItem[] | AsyncGenerator<BundleItem>;
    get(index: number | string): BundleItem | Promise<BundleItem>;
    getIds(): string[] | Promise<string[]>;
    getRaw(): ResolvesTo<Buffer>;
    toTransaction(attributes: Partial<CreateTransactionInterface>, arweave: Arweave, jwk: JWKInterface): Promise<Transaction>;
}
export {};
