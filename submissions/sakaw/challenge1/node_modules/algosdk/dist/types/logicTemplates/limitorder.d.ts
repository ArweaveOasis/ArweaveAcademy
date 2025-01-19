export class LimitOrder {
    /**
     * MakeLimitOrder allows a user to exchange some number of assets for some number of algos.
     * Fund the contract with some number of Algos to limit the maximum number of
     * Algos you're willing to trade for some other asset.
     *
     * Works on two cases:
     * * trading Algos for some other asset
     * * closing out Algos back to the originator after a timeout
     *
     * trade case, a 2 transaction group:
     * gtxn[0] (this txn) Algos from Me to Other
     * gtxn[1] asset from Other to Me
     *
     * We want to get _at least_ some amount of the other asset per our Algos
     * gtxn[1].AssetAmount / gtxn[0].Amount >= N / D
     * ===
     * gtxn[1].AssetAmount * D >= gtxn[0].Amount * N
     *
     * close-out case:
     * txn alone, close out value after timeout
     *
     * @deprecated This class will be removed in v2.
     *
     * Constructor Parameters:
     * @param {string} owner: the address to refund funds to on timeout
     * @param {int} assetid: the ID of the transferred asset
     * @param {int} ratn: exchange rate (N asset per D Algos, or better)
     * @param {int} ratd: exchange rate (N asset per D Algos, or better)
     * @param {int} expiryRound: the round at which the account expires
     * @param {int} minTrade: the minimum amount (of Algos) to be traded away
     * @param {int} maxFee: maximum fee used by the limit order transaction
     * @returns {LimitOrder}
     */
    constructor(owner: string, assetid: int, ratn: int, ratd: int, expiryRound: int, minTrade: int, maxFee: int);
    programBytes: any;
    address: string;
    owner: string;
    assetid: int;
    /**
     * returns the program bytes
     * @returns {Uint8Array}
     */
    getProgram(): Uint8Array;
    /**
     * returns the string address of the contract
     * @returns {string}
     */
    getAddress(): string;
}
/**
 * returns a group transactions array which transfer funds according to the contract's ratio
 *
 * @deprecated This feature will be removed in v2.
 *
 * @param {Uint8Array} contract: byteform of the contract from the payer
 * @param {int} assetAmount: the amount of assets to be sent
 * @param {int} microAlgoAmount: number of microAlgos to transfer
 * @param {Uint8Array} secretKey: secret key for signing transaction
 * @param {int} fee: the fee per byte to pay in microAlgos
 * @param {int} firstRound: the first round on which these txns will be valid
 * @param {int} lastRound: the last round on which these txns will be valid
 * @param {string} genesisHash: the b64-encoded genesis hash indicating the network for this transaction
 * @returns {Uint8Array}
 * the first payment sends money (Algos) from contract to the recipient (we'll call him Buyer), closing the rest of the account to Owner
 * the second payment sends money (the asset) from Buyer to the Owner
 * these transactions will be rejected if they do not meet the restrictions set by the contract
 * @throws error if arguments fail contract validation
 */
export function getSwapAssetsTransaction(contract: Uint8Array, assetAmount: int, microAlgoAmount: int, secretKey: Uint8Array, fee: int, firstRound: int, lastRound: int, genesisHash: string): Uint8Array;
