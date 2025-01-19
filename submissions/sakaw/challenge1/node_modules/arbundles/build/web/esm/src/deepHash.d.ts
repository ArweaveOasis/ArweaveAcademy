/// <reference types="node" />
export type DeepHashChunk = Uint8Array | AsyncIterable<Buffer> | DeepHashChunks;
export type DeepHashChunks = DeepHashChunk[];
export declare function deepHash(data: DeepHashChunk): Promise<Uint8Array>;
export declare function deepHashChunks(chunks: DeepHashChunks, acc: Uint8Array): Promise<Uint8Array>;
export declare function hashStream(stream: AsyncIterable<Buffer>): Promise<Buffer>;
export default deepHash;
