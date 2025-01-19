import { TransactionType, TransactionParams } from './base';
import { ConstructTransaction } from './builder';

type SpecificParameters = Pick<
  TransactionParams,
  | 'voteKey'
  | 'selectionKey'
  | 'stateProofKey'
  | 'voteFirst'
  | 'voteLast'
  | 'voteKeyDilution'
  | 'nonParticipation'
>;

interface Overwrites {
  type?: TransactionType.keyreg;
}

type KeyRegistrationTransaction = ConstructTransaction<
  SpecificParameters,
  Overwrites
>;
export default KeyRegistrationTransaction;
