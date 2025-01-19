import Ar from "./ar";
import Api, { ApiConfig } from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import Network from "./network";
import Transactions from "./transactions";
import Wallets from "./wallets";
import Transaction, { Tag } from "./lib/transaction";
import { JWKInterface } from "./lib/wallet";
import * as ArweaveUtils from "./lib/utils";
import Silo from "./silo";
import Chunks from "./chunks";
import Blocks from "./blocks";
export interface Config {
    api: ApiConfig;
    crypto: CryptoInterface;
}
export interface CreateTransactionInterface {
    format: number;
    last_tx: string;
    owner: string;
    tags: Tag[];
    target: string;
    quantity: string;
    data: string | Uint8Array | ArrayBuffer;
    data_size: string;
    data_root: string;
    reward: string;
}
export default class Arweave {
    api: Api;
    wallets: Wallets;
    transactions: Transactions;
    network: Network;
    blocks: Blocks;
    ar: Ar;
    silo: Silo;
    chunks: Chunks;
    static init: (apiConfig: ApiConfig) => Arweave;
    static crypto: CryptoInterface;
    static utils: typeof ArweaveUtils;
    constructor(apiConfig: ApiConfig);
    /** @deprecated */
    get crypto(): CryptoInterface;
    /** @deprecated */
    get utils(): typeof ArweaveUtils;
    getConfig(): Config;
    createTransaction(attributes: Partial<CreateTransactionInterface>, jwk?: JWKInterface | "use_wallet"): Promise<Transaction>;
    createSiloTransaction(attributes: Partial<CreateTransactionInterface>, jwk: JWKInterface, siloUri: string): Promise<Transaction>;
    arql(query: object): Promise<string[]>;
}
