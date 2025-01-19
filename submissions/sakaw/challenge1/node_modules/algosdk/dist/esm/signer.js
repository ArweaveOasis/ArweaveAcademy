import { signLogicSigTransactionObject } from './logicsig';
import { signMultisigTransaction, mergeMultisigTransactions } from './multisig';
/**
 * Create a TransactionSigner that can sign transactions for the provided basic Account.
 */
export function makeBasicAccountTransactionSigner(account) {
    return (txnGroup, indexesToSign) => {
        const signed = [];
        for (const index of indexesToSign) {
            signed.push(txnGroup[index].signTxn(account.sk));
        }
        return Promise.resolve(signed);
    };
}
/**
 * Create a TransactionSigner that can sign transactions for the provided LogicSigAccount.
 */
export function makeLogicSigAccountTransactionSigner(account) {
    return (txnGroup, indexesToSign) => {
        const signed = [];
        for (const index of indexesToSign) {
            const { blob } = signLogicSigTransactionObject(txnGroup[index], account);
            signed.push(blob);
        }
        return Promise.resolve(signed);
    };
}
/**
 * Create a TransactionSigner that can sign transactions for the provided Multisig account.
 * @param msig - The Multisig account metadata
 * @param sks - An array of private keys belonging to the msig which should sign the transactions.
 */
export function makeMultiSigAccountTransactionSigner(msig, sks) {
    return (txnGroup, indexesToSign) => {
        const signed = [];
        for (const index of indexesToSign) {
            const txn = txnGroup[index];
            const partialSigs = [];
            for (const sk of sks) {
                const { blob } = signMultisigTransaction(txn, msig, sk);
                partialSigs.push(blob);
            }
            signed.push(mergeMultisigTransactions(partialSigs));
        }
        return Promise.resolve(signed);
    };
}
/**
 * Check if a value conforms to the TransactionWithSigner structure.
 * @param value - The value to check.
 * @returns True if an only if the value has the structure of a TransactionWithSigner.
 */
export function isTransactionWithSigner(value) {
    return (typeof value === 'object' &&
        Object.keys(value).length === 2 &&
        typeof value.txn === 'object' &&
        typeof value.signer === 'function');
}
//# sourceMappingURL=signer.js.map