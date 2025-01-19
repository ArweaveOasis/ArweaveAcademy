import { TransactionType, TransactionParams } from './base';
import { ConstructTransaction } from './builder';

type SpecificParameters = Pick<
  TransactionParams,
  'stateProofType' | 'stateProof' | 'stateProofMessage'
>;

interface Overwrites {
  type?: TransactionType.stpf;
}

type StateProofTransaction = ConstructTransaction<
  SpecificParameters,
  Overwrites
>;
export default StateProofTransaction;
