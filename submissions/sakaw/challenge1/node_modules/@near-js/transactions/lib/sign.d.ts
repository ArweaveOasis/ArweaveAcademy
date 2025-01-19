import { Signer } from '@near-js/signers';
import BN from 'bn.js';
import { Action, SignedDelegate } from './actions';
import type { DelegateAction } from './delegate';
import { SignedTransaction, Transaction } from './schema';
interface MessageSigner {
    sign(message: Uint8Array): Promise<Uint8Array>;
}
interface SignDelegateOptions {
    delegateAction: DelegateAction;
    signer: MessageSigner;
}
export interface SignedDelegateWithHash {
    hash: Uint8Array;
    signedDelegateAction: SignedDelegate;
}
export declare function signTransaction(transaction: Transaction, signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]>;
export declare function signTransaction(receiverId: string, nonce: BN, actions: Action[], blockHash: Uint8Array, signer: Signer, accountId?: string, networkId?: string): Promise<[Uint8Array, SignedTransaction]>;
/**
 * Sign a delegate action
 * @params.delegateAction Delegate action to be signed by the meta transaction sender
 * @params.signer Signer instance for the meta transaction sender
 */
export declare function signDelegateAction({ delegateAction, signer }: SignDelegateOptions): Promise<SignedDelegateWithHash>;
export {};
