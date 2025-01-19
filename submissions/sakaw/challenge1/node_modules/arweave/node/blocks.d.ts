import Api from "./lib/api";
import { Tag } from "./lib/transaction";
import "arconnect";
import Network from "./network";
export interface BlockData {
    nonce: string;
    previous_block: string;
    timestamp: number;
    last_retarget: number;
    diff: string;
    height: number;
    hash: string;
    indep_hash: string;
    txs: string[];
    tx_root: string;
    wallet_list: string;
    reward_addr: string;
    tags: Tag[];
    reward_pool: number;
    weave_size: number;
    block_size: number;
    cumulative_diff: string;
    hash_list_merkle: string;
}
export default class Blocks {
    private readonly api;
    private readonly network;
    private static readonly ENDPOINT;
    constructor(api: Api, network: Network);
    /**
     * Gets a block by its "indep_hash"
     */
    get(indepHash: string): Promise<BlockData>;
    /**
     * Gets current block data (ie. block with indep_hash = Network.getInfo().current)
     */
    getCurrent(): Promise<BlockData>;
}
