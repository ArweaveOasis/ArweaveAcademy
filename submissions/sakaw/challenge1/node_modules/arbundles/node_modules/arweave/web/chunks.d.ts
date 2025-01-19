import Api from "./lib/api";
export interface TransactionOffsetResponse {
    size: string;
    offset: string;
}
export interface TransactionChunkResponse {
    chunk: string;
    data_path: string;
    tx_path: string;
}
export default class Chunks {
    private api;
    constructor(api: Api);
    getTransactionOffset(id: string): Promise<TransactionOffsetResponse>;
    getChunk(offset: string | number | BigInt): Promise<TransactionChunkResponse>;
    getChunkData(offset: string | number | BigInt): Promise<Uint8Array>;
    firstChunkOffset(offsetResponse: TransactionOffsetResponse): number;
    downloadChunkedData(id: string): Promise<Uint8Array>;
}
