import Transaction from "./transaction";
import Api from "./api";
export interface SerializedUploader {
    chunkIndex: number;
    txPosted: boolean;
    transaction: any;
    lastRequestTimeEnd: number;
    lastResponseStatus: number;
    lastResponseError: string;
}
export declare class TransactionUploader {
    private api;
    private chunkIndex;
    private txPosted;
    private transaction;
    private lastRequestTimeEnd;
    private totalErrors;
    data: Uint8Array;
    lastResponseStatus: number;
    lastResponseError: string;
    get isComplete(): boolean;
    get totalChunks(): number;
    get uploadedChunks(): number;
    get pctComplete(): number;
    constructor(api: Api, transaction: Transaction);
    /**
     * Uploads the next part of the transaction.
     * On the first call this posts the transaction
     * itself and on any subsequent calls uploads the
     * next chunk until it completes.
     */
    uploadChunk(chunkIndex_?: number): Promise<void>;
    /**
     * Reconstructs an upload from its serialized state and data.
     * Checks if data matches the expected data_root.
     *
     * @param serialized
     * @param data
     */
    static fromSerialized(api: Api, serialized: SerializedUploader, data: Uint8Array): Promise<TransactionUploader>;
    /**
     * Reconstruct an upload from the tx metadata, ie /tx/<id>.
     *
     * @param api
     * @param id
     * @param data
     */
    static fromTransactionId(api: Api, id: string): Promise<SerializedUploader>;
    toJSON(): {
        chunkIndex: number;
        transaction: Transaction;
        lastRequestTimeEnd: number;
        lastResponseStatus: number;
        lastResponseError: string;
        txPosted: boolean;
    };
    private postTransaction;
}
