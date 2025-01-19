import Api from "./lib/api";
import CryptoInterface from "./lib/crypto/crypto-interface";
import { JWKInterface } from "./lib/wallet";
import "arconnect";
export default class Wallets {
    private api;
    private crypto;
    constructor(api: Api, crypto: CryptoInterface);
    /**
     * Get the wallet balance for the given address.
     *
     * @param {string} address - The arweave address to get the balance for.
     *
     * @returns {Promise<string>} - Promise which resolves with a winston string balance.
     */
    getBalance(address: string): Promise<string>;
    /**
     * Get the last transaction ID for the given wallet address.
     *
     * @param {string} address - The arweave address to get the transaction for.
     *
     * @returns {Promise<string>} - Promise which resolves with a transaction ID.
     */
    getLastTransactionID(address: string): Promise<string>;
    generate(): Promise<JWKInterface>;
    jwkToAddress(jwk?: JWKInterface | "use_wallet"): Promise<string>;
    getAddress(jwk?: JWKInterface | "use_wallet"): Promise<string>;
    ownerToAddress(owner: string): Promise<string>;
}
