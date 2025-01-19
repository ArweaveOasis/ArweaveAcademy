/// <reference types="node" />
export declare class ChunkBuffer {
    readonly buffers: Buffer[];
    get empty(): boolean;
    push(...buffers: Buffer[]): void;
    pop(expectedChunkSize: number): Buffer | null;
    flush(): Buffer;
}
export interface ChunkerOptions {
    flush: boolean;
}
export declare function chunker(expectedChunkSize: number, { flush }?: ChunkerOptions): (stream: AsyncIterable<Buffer>) => AsyncIterable<Buffer>;
