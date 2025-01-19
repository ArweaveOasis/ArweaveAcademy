/**
 * Decoded Algorand address. Includes public key and checksum.
 */
export interface Address {
  publicKey: Uint8Array;
  checksum: Uint8Array;
}
