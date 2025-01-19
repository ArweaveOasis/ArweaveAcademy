/// <reference types="node" />
export interface Tag {
    name: string;
    value: string;
}
export declare class AVSCTap {
    protected buf: Buffer;
    protected pos: number;
    constructor(buf?: Buffer, pos?: number);
    writeTags(tags: Tag[]): void;
    toBuffer(): Buffer;
    protected writeLong(n: number): void;
    protected writeString(s: string): void;
    protected readLong(): number;
    protected skipLong(): void;
    readTags(): Tag[];
    protected readString(): string;
}
export declare function serializeTags(tags: Tag[]): Buffer;
export declare function deserializeTags(tagsBuffer: Buffer): Tag[];
