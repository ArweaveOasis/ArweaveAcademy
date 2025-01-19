import { TransactionType, TransactionParams } from './base';
import { ConstructTransaction } from './builder';
declare type SpecificParameters = Pick<TransactionParams, 'stateProofType' | 'stateProof' | 'stateProofMessage'>;
interface Overwrites {
    type?: TransactionType.stpf;
}
declare type StateProofTransaction = ConstructTransaction<SpecificParameters, Overwrites>;
export default StateProofTransaction;
