/**
 * NEAR RPC API request types and responses
 * @module
 */
import BN from 'bn.js';
export interface SyncInfo {
    latest_block_hash: string;
    latest_block_height: number;
    latest_block_time: string;
    latest_state_root: string;
    syncing: boolean;
}
interface Version {
    version: string;
    build: string;
}
export interface NodeStatusResult {
    chain_id: string;
    rpc_addr: string;
    sync_info: SyncInfo;
    validators: string[];
    version: Version;
}
export type BlockHash = string;
export type BlockHeight = number;
export type BlockId = BlockHash | BlockHeight;
export type Finality = 'optimistic' | 'near-final' | 'final';
export type BlockReference = {
    blockId: BlockId;
} | {
    finality: Finality;
} | {
    sync_checkpoint: 'genesis' | 'earliest_available';
};
export interface TotalWeight {
    num: number;
}
export interface BlockHeader {
    height: number;
    epoch_id: string;
    next_epoch_id: string;
    hash: string;
    prev_hash: string;
    prev_state_root: string;
    chunk_receipts_root: string;
    chunk_headers_root: string;
    chunk_tx_root: string;
    outcome_root: string;
    chunks_included: number;
    challenges_root: string;
    timestamp: number;
    timestamp_nanosec: string;
    random_value: string;
    validator_proposals: any[];
    chunk_mask: boolean[];
    gas_price: string;
    rent_paid: string;
    validator_reward: string;
    total_supply: string;
    challenges_result: any[];
    last_final_block: string;
    last_ds_final_block: string;
    next_bp_hash: string;
    block_merkle_root: string;
    approvals: string[];
    signature: string;
    latest_protocol_version: number;
}
export type ChunkHash = string;
export type ShardId = number;
export type BlockShardId = [BlockId, ShardId];
export type ChunkId = ChunkHash | BlockShardId;
export interface ChunkHeader {
    balance_burnt: string;
    chunk_hash: ChunkHash;
    encoded_length: number;
    encoded_merkle_root: string;
    gas_limit: number;
    gas_used: number;
    height_created: number;
    height_included: number;
    outcome_root: string;
    outgoing_receipts_root: string;
    prev_block_hash: string;
    prev_state_root: string;
    rent_paid: string;
    shard_id: number;
    signature: string;
    tx_root: string;
    validator_proposals: any[];
    validator_reward: string;
}
export interface ChunkResult {
    author: string;
    header: ChunkHeader;
    receipts: any[];
    transactions: Transaction[];
}
export interface Chunk {
    chunk_hash: string;
    prev_block_hash: string;
    outcome_root: string;
    prev_state_root: string;
    encoded_merkle_root: string;
    encoded_length: number;
    height_created: number;
    height_included: number;
    shard_id: number;
    gas_used: number;
    gas_limit: number;
    rent_paid: string;
    validator_reward: string;
    balance_burnt: string;
    outgoing_receipts_root: string;
    tx_root: string;
    validator_proposals: any[];
    signature: string;
}
export interface Transaction {
    actions: Array<any>;
    hash: string;
    nonce: BN;
    public_key: string;
    receiver_id: string;
    signature: string;
    signer_id: string;
}
export interface BlockResult {
    author: string;
    header: BlockHeader;
    chunks: Chunk[];
}
export interface BlockChange {
    type: string;
    account_id: string;
}
export interface BlockChangeResult {
    block_hash: string;
    changes: BlockChange[];
}
export interface ChangeResult {
    block_hash: string;
    changes: any[];
}
export interface NearProtocolConfig {
    runtime_config: NearProtocolRuntimeConfig;
}
export interface NearProtocolRuntimeConfig {
    storage_amount_per_byte: string;
}
export interface MerkleNode {
    hash: string;
    direction: string;
}
export type MerklePath = MerkleNode[];
export interface BlockHeaderInnerLiteView {
    height: number;
    epoch_id: string;
    next_epoch_id: string;
    prev_state_root: string;
    outcome_root: string;
    timestamp: number;
    timestamp_nanosec: string;
    next_bp_hash: string;
    block_merkle_root: string;
}
export interface GasPrice {
    gas_price: string;
}
export interface AccessKeyWithPublicKey {
    account_id: string;
    public_key: string;
}
export {};
