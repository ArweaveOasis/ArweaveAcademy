import Account from '../types/account';
export declare const FAIL_TO_DECODE_MNEMONIC_ERROR_MSG = "failed to decode mnemonic";
export declare const NOT_IN_WORDS_LIST_ERROR_MSG = "the mnemonic contains a word that is not in the wordlist";
/**
 * mnemonicFromSeed converts a 32-byte key into a 25 word mnemonic. The generated mnemonic includes a checksum.
 * Each word in the mnemonic represents 11 bits of data, and the last 11 bits are reserved for the checksum.
 * @param seed - 32 bytes long seed
 * @returns 25 words mnemonic
 */
export declare function mnemonicFromSeed(seed: Uint8Array): string;
/**
 * seedFromMnemonic converts a mnemonic generated using this library into the source key used to create it.
 * It returns an error if the passed mnemonic has an incorrect checksum, if the number of words is unexpected, or if one
 * of the passed words is not found in the words list.
 * @param mnemonic - 25 words mnemonic
 * @returns 32 bytes long seed
 */
export declare function seedFromMnemonic(mnemonic: string): Uint8Array;
/**
 * mnemonicToSecretKey takes a mnemonic string and returns the corresponding Algorand address and its secret key.
 * @param mn - 25 words Algorand mnemonic
 * @throws error if fails to decode the mnemonic
 */
export declare function mnemonicToSecretKey(mn: string): Account;
/**
 * secretKeyToMnemonic takes an Algorand secret key and returns the corresponding mnemonic.
 * @param sk - Algorand secret key
 * @returns Secret key's associated mnemonic
 */
export declare function secretKeyToMnemonic(sk: Uint8Array): string;
/**
 * mnemonicToMasterDerivationKey takes a mnemonic string and returns the corresponding master derivation key.
 * @param mn - 25 words Algorand mnemonic
 * @returns Uint8Array
 * @throws error if fails to decode the mnemonic
 */
export declare function mnemonicToMasterDerivationKey(mn: string): Uint8Array;
/**
 * masterDerivationKeyToMnemonic takes a master derivation key and returns the corresponding mnemonic.
 * @param mdk - Uint8Array
 * @returns string mnemonic
 */
export declare function masterDerivationKeyToMnemonic(mdk: Uint8Array): string;
