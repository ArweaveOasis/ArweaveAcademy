/**
 * NEAR RPC API request types and responses
 * @module
 */
import { SignedTransaction } from '@near-js/transactions';
import { AccessKeyWithPublicKey, BlockChangeResult, BlockId, BlockReference, BlockResult, ChangeResult, ChunkId, ChunkResult, FinalExecutionOutcome, GasPrice, LightClientProof, LightClientProofRequest, NextLightClientBlockRequest, NextLightClientBlockResponse, NearProtocolConfig, NodeStatusResult, QueryResponseKind, RpcQueryRequest, EpochValidatorInfo } from '@near-js/types';
/** @hidden */
export declare abstract class Provider {
    abstract status(): Promise<NodeStatusResult>;
    abstract sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    abstract sendTransactionAsync(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome>;
    abstract txStatus(txHash: Uint8Array | string, accountId: string): Promise<FinalExecutionOutcome>;
    abstract txStatusReceipts(txHash: Uint8Array | string, accountId: string): Promise<FinalExecutionOutcome>;
    abstract query<T extends QueryResponseKind>(params: RpcQueryRequest): Promise<T>;
    abstract query<T extends QueryResponseKind>(path: string, data: string): Promise<T>;
    abstract block(blockQuery: BlockId | BlockReference): Promise<BlockResult>;
    abstract blockChanges(blockQuery: BlockId | BlockReference): Promise<BlockChangeResult>;
    abstract chunk(chunkId: ChunkId): Promise<ChunkResult>;
    abstract validators(blockId: BlockId | null): Promise<EpochValidatorInfo>;
    abstract experimental_protocolConfig(blockReference: BlockReference): Promise<NearProtocolConfig>;
    abstract lightClientProof(request: LightClientProofRequest): Promise<LightClientProof>;
    abstract nextLightClientBlock(request: NextLightClientBlockRequest): Promise<NextLightClientBlockResponse>;
    abstract gasPrice(blockId: BlockId): Promise<GasPrice>;
    abstract accessKeyChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    abstract singleAccessKeyChanges(accessKeyArray: AccessKeyWithPublicKey[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    abstract accountChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
    abstract contractStateChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference, keyPrefix: string): Promise<ChangeResult>;
    abstract contractCodeChanges(accountIdArray: string[], BlockQuery: BlockId | BlockReference): Promise<ChangeResult>;
}
