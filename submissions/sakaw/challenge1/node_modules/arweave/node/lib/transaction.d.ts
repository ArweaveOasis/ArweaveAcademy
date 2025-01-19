import { Chunk, Proof } from "./merkle";
declare class BaseObject {
    [key: string]: any;
    get(field: string): string;
    get(field: string, options: {
        decode: true;
        string: false;
    }): Uint8Array;
    get(field: string, options: {
        decode: true;
        string: true;
    }): string;
}
export declare class Tag extends BaseObject {
    readonly name: string;
    readonly value: string;
    constructor(name: string, value: string, decode?: boolean);
}
export interface TransactionInterface {
    format: number;
    id: string;
    last_tx: string;
    owner: string;
    tags: Tag[];
    target: string;
    quantity: string;
    data: Uint8Array;
    reward: string;
    signature: string;
    data_size: string;
    data_root: string;
}
export default class Transaction extends BaseObject implements TransactionInterface {
    readonly format: number;
    id: string;
    readonly last_tx: string;
    owner: string;
    tags: Tag[];
    readonly target: string;
    readonly quantity: string;
    readonly data_size: string;
    data: Uint8Array;
    data_root: string;
    reward: string;
    signature: string;
    chunks?: {
        data_root: Uint8Array;
        chunks: Chunk[];
        proofs: Proof[];
    };
    constructor(attributes?: Partial<TransactionInterface>);
    addTag(name: string, value: string): void;
    toJSON(): {
        format: number;
        id: string;
        last_tx: string;
        owner: string;
        tags: Tag[];
        target: string;
        quantity: string;
        data: string;
        data_size: string;
        data_root: string;
        data_tree: any;
        reward: string;
        signature: string;
    };
    setOwner(owner: string): void;
    setSignature({ id, owner, reward, tags, signature, }: {
        id: string;
        owner: string;
        reward?: string;
        tags?: Tag[];
        signature: string;
    }): void;
    prepareChunks(data: Uint8Array): Promise<void>;
    getChunk(idx: number, data: Uint8Array): {
        data_root: string;
        data_size: string;
        data_path: string;
        offset: string;
        chunk: string;
    };
    getSignatureData(): Promise<Uint8Array>;
}
export {};
