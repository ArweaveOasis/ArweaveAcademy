import { Address } from '../types/address';
import { MultisigMetadata } from '../types/multisig';
export declare const ALGORAND_ZERO_ADDRESS_STRING = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ";
export declare const MALFORMED_ADDRESS_ERROR_MSG = "address seems to be malformed";
export declare const CHECKSUM_ADDRESS_ERROR_MSG = "wrong checksum for address";
export declare const INVALID_MSIG_VERSION_ERROR_MSG = "invalid multisig version";
export declare const INVALID_MSIG_THRESHOLD_ERROR_MSG = "bad multisig threshold";
export declare const INVALID_MSIG_PK_ERROR_MSG = "bad multisig public key - wrong length";
export declare const UNEXPECTED_PK_LEN_ERROR_MSG = "nacl public key length is not 32 bytes";
/**
 * decodeAddress takes an Algorand address in string form and decodes it into a Uint8Array.
 * @param address - an Algorand address with checksum.
 * @returns the decoded form of the address's public key and checksum
 */
export declare function decodeAddress(address: string): Address;
/**
 * isValidAddress checks if a string is a valid Algorand address.
 * @param address - an Algorand address with checksum.
 * @returns true if valid, false otherwise
 */
export declare function isValidAddress(address: string): boolean;
/**
 * encodeAddress takes an Algorand address as a Uint8Array and encodes it into a string with checksum.
 * @param address - a raw Algorand address
 * @returns the address and checksum encoded as a string.
 */
export declare function encodeAddress(address: Uint8Array): string;
/**
 * fromMultisigPreImg takes multisig parameters and returns a 32 byte typed array public key,
 * representing an address that identifies the "exact group, version, and public keys" that are required for signing.
 * Hash("MultisigAddr" || version uint8 || threshold uint8 || PK1 || PK2 || ...)
 * Encoding this output yields a human readable address.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param pks - array of typed array public keys
 */
export declare function fromMultisigPreImg({ version, threshold, pks, }: Omit<MultisigMetadata, 'addrs'> & {
    pks: Uint8Array[];
}): Uint8Array;
/**
 * fromMultisigPreImgAddrs takes multisig parameters and returns a human readable Algorand address.
 * This is equivalent to fromMultisigPreImg, but interfaces with encoded addresses.
 * @param version - multisig version
 * @param threshold - multisig threshold
 * @param addrs - array of encoded addresses
 */
export declare function fromMultisigPreImgAddrs({ version, threshold, addrs, }: {
    version: number;
    threshold: number;
    addrs: string[];
}): string;
/**
 * Get the escrow address of an application.
 * @param appID - The ID of the application.
 * @returns The address corresponding to that application's escrow account.
 */
export declare function getApplicationAddress(appID: number | bigint): string;
