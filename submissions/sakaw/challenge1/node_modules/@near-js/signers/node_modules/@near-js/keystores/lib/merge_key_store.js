"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeKeyStore = void 0;
const keystore_1 = require("./keystore");
class MergeKeyStore extends keystore_1.KeyStore {
    /**
     * @param keyStores read calls are attempted from start to end of array
     * @param options.writeKeyStoreIndex the keystore index that will receive all write calls
     */
    constructor(keyStores, options = { writeKeyStoreIndex: 0 }) {
        super();
        this.options = options;
        this.keyStores = keyStores;
    }
    /**
     * Store a {@link utils/key_pair!KeyPair} to the first index of a key store array
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     */
    setKey(networkId, accountId, keyPair) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.keyStores[this.options.writeKeyStoreIndex].setKey(networkId, accountId, keyPair);
        });
    }
    /**
     * Gets a {@link utils/key_pair!KeyPair} from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const keyStore of this.keyStores) {
                const keyPair = yield keyStore.getKey(networkId, accountId);
                if (keyPair) {
                    return keyPair;
                }
            }
            return null;
        });
    }
    /**
     * Removes a {@link utils/key_pair!KeyPair} from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     */
    removeKey(networkId, accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const keyStore of this.keyStores) {
                yield keyStore.removeKey(networkId, accountId);
            }
        });
    }
    /**
     * Removes all items from each key store
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const keyStore of this.keyStores) {
                yield keyStore.clear();
            }
        });
    }
    /**
     * Get the network(s) from the array of key stores
     * @returns {Promise<string[]>}
     */
    getNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new Set();
            for (const keyStore of this.keyStores) {
                for (const network of yield keyStore.getNetworks()) {
                    result.add(network);
                }
            }
            return Array.from(result);
        });
    }
    /**
     * Gets the account(s) from the array of key stores
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    getAccounts(networkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = new Set();
            for (const keyStore of this.keyStores) {
                for (const account of yield keyStore.getAccounts(networkId)) {
                    result.add(account);
                }
            }
            return Array.from(result);
        });
    }
    /** @hidden */
    toString() {
        return `MergeKeyStore(${this.keyStores.join(', ')})`;
    }
}
exports.MergeKeyStore = MergeKeyStore;
