import Api from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import Transactions from "./transactions";
import Transaction from "./lib/transaction";
export default class Silo {
    private api;
    private crypto;
    private transactions;
    constructor(api: Api, crypto: CryptoInterface, transactions: Transactions);
    get(siloURI: string): Promise<Uint8Array>;
    readTransactionData(transaction: Transaction, siloURI: string): Promise<Uint8Array>;
    parseUri(siloURI: string): Promise<SiloResource>;
    private hash;
}
export declare class SiloResource {
    private uri;
    private accessKey;
    private encryptionKey;
    constructor(uri: string, accessKey: string, encryptionKey: Uint8Array);
    getUri(): string;
    getAccessKey(): string;
    getEncryptionKey(): Uint8Array;
}
