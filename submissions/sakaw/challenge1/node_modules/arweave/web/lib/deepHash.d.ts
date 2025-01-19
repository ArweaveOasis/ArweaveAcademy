type DeepHashChunk = Uint8Array | DeepHashChunks;
interface DeepHashChunks extends Array<DeepHashChunk> {
}
export default function deepHash(data: DeepHashChunk): Promise<Uint8Array>;
export {};
