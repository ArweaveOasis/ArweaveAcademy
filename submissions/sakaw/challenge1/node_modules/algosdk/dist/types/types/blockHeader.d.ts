/**
 * Represents the metadata and state of a block.
 *
 * For more information, refer to: https://github.com/algorand/go-algorand/blob/master/data/bookkeeping/block.go
 */
export default interface BlockHeader {
    /**
     * Transaction fees
     */
    fees: string;
    /**
     * The number of leftover MicroAlgos after rewards distribution
     */
    frac: number;
    /**
     * Genesis ID to which this block belongs
     */
    gen: string;
    /**
     * Genesis hash to which this block belongs.
     */
    gh: string;
    /**
     * The hash of the previous block
     */
    prev: string;
    /**
     * Current protocol
     */
    proto: string;
    /**
     * Rewards rate
     */
    rate: number;
    /**
     * Round number
     */
    rnd: number;
    /**
     * Rewards recalculation round
     */
    rwcalr: number;
    /**
     * Rewards pool
     */
    rwd: string;
    /**
     * Sortition seed
     */
    seed: string;
    /**
     * Timestamp in seconds since epoch
     */
    ts: number;
    /**
     * Transaction root SHA512_256
     */
    txn: string;
    /**
     * Transaction root SHA256
     */
    txn256: string;
    /**
     * StateProofTracking map of type to tracking data
     */
    spt: Map<number, Uint8Array>;
}
