import { Signature, PublicKey } from '@near-js/crypto';
/**
 * General signing interface, can be used for in memory signing, RPC singing, external wallet, HSM, etc.
 */
export declare abstract class Signer {
    /**
     * Creates new key and returns public key.
     */
    abstract createKey(accountId: string, networkId?: string): Promise<PublicKey>;
    /**
     * Returns public key for given account / network.
     * @param accountId accountId to retrieve from.
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    abstract getPublicKey(accountId?: string, networkId?: string): Promise<PublicKey>;
    /**
     * Signs given message, by first hashing with sha256.
     * @param message message to sign.
     * @param accountId accountId to use for signing.
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    abstract signMessage(message: Uint8Array, accountId?: string, networkId?: string): Promise<Signature>;
}
