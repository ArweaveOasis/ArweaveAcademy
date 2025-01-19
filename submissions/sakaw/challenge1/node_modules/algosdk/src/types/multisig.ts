/**
 * Required options for creating a multisignature
 *
 * Documentation available at: https://developer.algorand.org/docs/features/transactions/signatures/#multisignatures
 */
export interface MultisigMetadata {
  /**
   * Multisig version
   */
  version: number;

  /**
   * Multisig threshold value. Authorization requires a subset of signatures,
   * equal to or greater than the threshold value.
   */
  threshold: number;

  /**
   * A list of Algorand addresses representing possible signers for this multisig. Order is important.
   */
  addrs: string[];
}
