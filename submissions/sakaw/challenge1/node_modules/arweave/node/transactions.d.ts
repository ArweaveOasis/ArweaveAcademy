/// <reference types="node" />
import Api from "./lib/api";
import CryptoInterface, { SignatureOptions } from "./lib/crypto/crypto-interface";
import Transaction from "./lib/transaction";
import { JWKInterface } from "./lib/wallet";
import { TransactionUploader, SerializedUploader } from "./lib/transaction-uploader";
import Chunks from "./chunks";
import "arconnect";
export interface TransactionConfirmedData {
    block_indep_hash: string;
    block_height: number;
    number_of_confirmations: number;
}
export interface TransactionStatusResponse {
    status: number;
    confirmed: TransactionConfirmedData | null;
}
export default class Transactions {
    private api;
    private crypto;
    private chunks;
    constructor(api: Api, crypto: CryptoInterface, chunks: Chunks);
    getTransactionAnchor(): Promise<string>;
    getPrice(byteSize: number, targetAddress?: string): Promise<string>;
    get(id: string): Promise<Transaction>;
    fromRaw(attributes: object): Transaction;
    search(tagName: string, tagValue: string): Promise<string[]>;
    getStatus(id: string): Promise<TransactionStatusResponse>;
    getData(id: string, options?: {
        decode?: boolean;
        string?: boolean;
    }): Promise<string | Uint8Array>;
    sign(transaction: Transaction, jwk?: JWKInterface | "use_wallet", options?: SignatureOptions): Promise<void>;
    verify(transaction: Transaction): Promise<boolean>;
    post(transaction: Transaction | Buffer | string | object): Promise<{
        status: number;
        statusText: string;
        data: any;
    }>;
    /**
     * Gets an uploader than can be used to upload a transaction chunk by chunk, giving progress
     * and the ability to resume.
     *
     * Usage example:
     *
     * ```
     * const uploader = arweave.transactions.getUploader(transaction);
     * while (!uploader.isComplete) {
     *   await uploader.uploadChunk();
     *   console.log(`${uploader.pctComplete}%`);
     * }
     * ```
     *
     * @param upload a Transaction object, a previously save progress object, or a transaction id.
     * @param data the data of the transaction. Required when resuming an upload.
     */
    getUploader(upload: Transaction | SerializedUploader | string, data?: Uint8Array | ArrayBuffer): Promise<TransactionUploader>;
    /**
     * Async generator version of uploader
     *
     * Usage example:
     *
     * ```
     * for await (const uploader of arweave.transactions.upload(tx)) {
     *  console.log(`${uploader.pctComplete}%`);
     * }
     * ```
     *
     * @param upload a Transaction object, a previously save uploader, or a transaction id.
     * @param data the data of the transaction. Required when resuming an upload.
     */
    upload(upload: Transaction | SerializedUploader | string, data: Uint8Array): AsyncGenerator<TransactionUploader, TransactionUploader, unknown>;
}
