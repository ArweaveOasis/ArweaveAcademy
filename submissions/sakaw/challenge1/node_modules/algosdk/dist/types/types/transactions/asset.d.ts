import { TransactionType, TransactionParams } from './base';
import { ConstructTransaction } from './builder';
declare type SpecificParametersForCreate = Pick<TransactionParams, 'assetTotal' | 'assetDecimals' | 'assetDefaultFrozen' | 'assetUnitName' | 'assetName' | 'assetURL' | 'assetMetadataHash' | 'assetManager' | 'assetReserve' | 'assetFreeze' | 'assetClawback'>;
interface OverwritesForCreate {
    type?: TransactionType.acfg;
}
export declare type AssetCreateTransaction = ConstructTransaction<SpecificParametersForCreate, OverwritesForCreate>;
declare type SpecificParametersForConfig = Pick<TransactionParams, 'assetIndex' | 'assetManager' | 'assetReserve' | 'assetFreeze' | 'assetClawback'>;
interface OverwritesForConfig {
    type?: TransactionType.acfg;
}
export declare type AssetConfigurationTransaction = ConstructTransaction<SpecificParametersForConfig, OverwritesForConfig>;
declare type SpecificParametersForDestroy = Pick<TransactionParams, 'assetIndex'>;
interface OverwritesForDestroy {
    type?: TransactionType.acfg;
}
export declare type AssetDestroyTransaction = ConstructTransaction<SpecificParametersForDestroy, OverwritesForDestroy>;
declare type SpecificParametersForFreeze = Pick<TransactionParams, 'assetIndex' | 'freezeAccount' | 'freezeState'>;
interface OverwritesForFreeze {
    type?: TransactionType.afrz;
}
export declare type AssetFreezeTransaction = ConstructTransaction<SpecificParametersForFreeze, OverwritesForFreeze>;
declare type SpecificParametersForTransfer = Pick<TransactionParams, 'from' | 'to' | 'closeRemainderTo' | 'assetRevocationTarget' | 'amount' | 'assetIndex'>;
interface OverwritesForTransfer {
    type?: TransactionType.axfer;
}
export declare type AssetTransferTransaction = ConstructTransaction<SpecificParametersForTransfer, OverwritesForTransfer>;
export {};
