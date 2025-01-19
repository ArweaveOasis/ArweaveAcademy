import { TransactionType, TransactionParams } from './base';
import { ConstructTransaction } from './builder';

// -----------------------------------
// > Application Create Transaction
// -----------------------------------

type SpecificParametersForCreate = Pick<
  TransactionParams,
  | 'appIndex'
  | 'appOnComplete'
  | 'appApprovalProgram'
  | 'appClearProgram'
  | 'appLocalInts'
  | 'appLocalByteSlices'
  | 'appGlobalInts'
  | 'appGlobalByteSlices'
  | 'appArgs'
  | 'appAccounts'
  | 'appForeignApps'
  | 'appForeignAssets'
  | 'boxes'
  | 'extraPages'
>;

interface OverwritesForCreate {
  type?: TransactionType.appl;
}

export type ApplicationCreateTransaction = ConstructTransaction<
  SpecificParametersForCreate,
  OverwritesForCreate
>;

// -----------------------------------
// > Application Update Transaction
// -----------------------------------

type SpecificParametersForUpdate = Pick<
  TransactionParams,
  | 'appIndex'
  | 'appOnComplete'
  | 'appApprovalProgram'
  | 'appClearProgram'
  | 'appArgs'
  | 'appAccounts'
  | 'appForeignApps'
  | 'appForeignAssets'
  | 'boxes'
>;

interface OverwritesForUpdate {
  type?: TransactionType.appl;
}

export type ApplicationUpdateTransaction = ConstructTransaction<
  SpecificParametersForUpdate,
  OverwritesForUpdate
>;

// -----------------------------------
// > Application Delete Transaction
// -----------------------------------

type SpecificParametersForDelete = Pick<
  TransactionParams,
  | 'appIndex'
  | 'appOnComplete'
  | 'appArgs'
  | 'appAccounts'
  | 'appForeignApps'
  | 'appForeignAssets'
  | 'boxes'
>;

interface OverwritesForDelete {
  type?: TransactionType.appl;
}

export type ApplicationDeleteTransaction = ConstructTransaction<
  SpecificParametersForDelete,
  OverwritesForDelete
>;

// -----------------------------------
// > Application Opt-In Transaction
// -----------------------------------

// Same structure as the application delete transaction
export type ApplicationOptInTransaction = ApplicationDeleteTransaction;

// -----------------------------------
// > Application Close Out Transaction
// -----------------------------------

// Same structure as the application delete transaction
export type ApplicationCloseOutTransaction = ApplicationDeleteTransaction;

// --------------------------------------
// > Application Clear State Transaction
// --------------------------------------

// Same structure as the application delete transaction
export type ApplicationClearStateTransaction = ApplicationDeleteTransaction;

// --------------------------------------
// > Application Call (NoOp) Transaction
// --------------------------------------

// Same structure as the application delete transaction
export type ApplicationNoOpTransaction = ApplicationDeleteTransaction;
