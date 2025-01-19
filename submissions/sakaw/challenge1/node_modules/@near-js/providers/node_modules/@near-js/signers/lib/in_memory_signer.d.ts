import { KeyPair, PublicKey, Signature } from '@near-js/crypto';
import { KeyStore } from '@near-js/keystores';
import { Signer } from './signer';
/**
 * Signs using in memory key store.
 */
export declare class InMemorySigner extends Signer {
    readonly keyStore: KeyStore;
    constructor(keyStore: KeyStore);
    /**
     * Creates a single account Signer instance with account, network and keyPair provided.
     *
     * Intended to be useful for temporary keys (e.g. claiming a Linkdrop).
     *
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account to assign the key pair to
     * @param keyPair The keyPair to use for signing
     */
    static fromKeyPair(networkId: string, accountId: string, keyPair: KeyPair): Promise<Signer>;
    /**
     * Creates a public key for the account given
     * @param accountId The NEAR account to assign a public key to
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<PublicKey>}
     */
    createKey(accountId: string, networkId: string): Promise<PublicKey>;
    /**
     * Gets the existing public key for a given account
     * @param accountId The NEAR account to assign a public key to
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<PublicKey>} Returns the public key or null if not found
     */
    getPublicKey(accountId?: string, networkId?: string): Promise<PublicKey>;
    /**
     * @param message A message to be signed, typically a serialized transaction
     * @param accountId the NEAR account signing the message
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @returns {Promise<Signature>}
     */
    signMessage(message: Uint8Array, accountId?: string, networkId?: string): Promise<Signature>;
    toString(): string;
}
