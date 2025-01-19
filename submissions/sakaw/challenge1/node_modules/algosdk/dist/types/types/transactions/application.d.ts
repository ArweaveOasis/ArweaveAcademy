import { TransactionType, TransactionParams } from './base';
import { ConstructTransaction } from './builder';
declare type SpecificParametersForCreate = Pick<TransactionParams, 'appIndex' | 'appOnComplete' | 'appApprovalProgram' | 'appClearProgram' | 'appLocalInts' | 'appLocalByteSlices' | 'appGlobalInts' | 'appGlobalByteSlices' | 'appArgs' | 'appAccounts' | 'appForeignApps' | 'appForeignAssets' | 'boxes' | 'extraPages'>;
interface OverwritesForCreate {
    type?: TransactionType.appl;
}
export declare type ApplicationCreateTransaction = ConstructTransaction<SpecificParametersForCreate, OverwritesForCreate>;
declare type SpecificParametersForUpdate = Pick<TransactionParams, 'appIndex' | 'appOnComplete' | 'appApprovalProgram' | 'appClearProgram' | 'appArgs' | 'appAccounts' | 'appForeignApps' | 'appForeignAssets' | 'boxes'>;
interface OverwritesForUpdate {
    type?: TransactionType.appl;
}
export declare type ApplicationUpdateTransaction = ConstructTransaction<SpecificParametersForUpdate, OverwritesForUpdate>;
declare type SpecificParametersForDelete = Pick<TransactionParams, 'appIndex' | 'appOnComplete' | 'appArgs' | 'appAccounts' | 'appForeignApps' | 'appForeignAssets' | 'boxes'>;
interface OverwritesForDelete {
    type?: TransactionType.appl;
}
export declare type ApplicationDeleteTransaction = ConstructTransaction<SpecificParametersForDelete, OverwritesForDelete>;
export declare type ApplicationOptInTransaction = ApplicationDeleteTransaction;
export declare type ApplicationCloseOutTransaction = ApplicationDeleteTransaction;
export declare type ApplicationClearStateTransaction = ApplicationDeleteTransaction;
export declare type ApplicationNoOpTransaction = ApplicationDeleteTransaction;
export {};
