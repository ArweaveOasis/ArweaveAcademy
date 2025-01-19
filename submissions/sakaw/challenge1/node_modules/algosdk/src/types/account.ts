/**
 * An Algorand account object.
 *
 * Contains an Algorand address and secret key.
 */
export default interface Account {
  /**
   * Algorand address
   */
  addr: string;

  /**
   * Secret key belonging to the Algorand address
   */
  sk: Uint8Array;
}
