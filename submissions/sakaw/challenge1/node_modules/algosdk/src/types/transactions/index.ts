import PaymentTxn from './payment';
import KeyRegistrationTxn from './keyreg';
import {
  AssetCreateTransaction as AssetCreateTxn,
  AssetConfigurationTransaction as AssetConfigTxn,
  AssetDestroyTransaction as AssetDestroyTxn,
  AssetFreezeTransaction as AssetFreezeTxn,
  AssetTransferTransaction as AssetTransferTxn,
} from './asset';
import {
  ApplicationCreateTransaction as AppCreateTxn,
  ApplicationUpdateTransaction as AppUpdateTxn,
  ApplicationDeleteTransaction as AppDeleteTxn,
  ApplicationOptInTransaction as AppOptInTxn,
  ApplicationCloseOutTransaction as AppCloseOutTxn,
  ApplicationClearStateTransaction as AppClearStateTxn,
  ApplicationNoOpTransaction as AppNoOpTxn,
} from './application';
import StateProofTxn from './stateproof';

// Utilities
export {
  TransactionParams,
  TransactionType,
  SuggestedParams,
  BoxReference,
} from './base';
export {
  MustHaveSuggestedParams,
  MustHaveSuggestedParamsInline,
} from './builder';
export * from './encoded';

// Transaction types
export { default as PaymentTxn } from './payment';
export { default as KeyRegistrationTxn } from './keyreg';
export {
  AssetCreateTransaction as AssetCreateTxn,
  AssetConfigurationTransaction as AssetConfigTxn,
  AssetDestroyTransaction as AssetDestroyTxn,
  AssetFreezeTransaction as AssetFreezeTxn,
  AssetTransferTransaction as AssetTransferTxn,
} from './asset';
export {
  ApplicationCreateTransaction as AppCreateTxn,
  ApplicationUpdateTransaction as AppUpdateTxn,
  ApplicationDeleteTransaction as AppDeleteTxn,
  ApplicationOptInTransaction as AppOptInTxn,
  ApplicationCloseOutTransaction as AppCloseOutTxn,
  ApplicationClearStateTransaction as AppClearStateTxn,
  ApplicationNoOpTransaction as AppNoOpTxn,
} from './application';
export { default as StateProofTxn } from './stateproof';

// All possible transaction types
type AnyTransaction =
  | PaymentTxn
  | KeyRegistrationTxn
  | AssetCreateTxn
  | AssetConfigTxn
  | AssetDestroyTxn
  | AssetFreezeTxn
  | AssetTransferTxn
  | AppCreateTxn
  | AppUpdateTxn
  | AppDeleteTxn
  | AppOptInTxn
  | AppCloseOutTxn
  | AppClearStateTxn
  | AppNoOpTxn
  | StateProofTxn;
export default AnyTransaction;
