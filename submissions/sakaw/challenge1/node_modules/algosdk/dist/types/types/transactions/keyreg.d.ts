import { TransactionType, TransactionParams } from './base';
import { ConstructTransaction } from './builder';
declare type SpecificParameters = Pick<TransactionParams, 'voteKey' | 'selectionKey' | 'stateProofKey' | 'voteFirst' | 'voteLast' | 'voteKeyDilution' | 'nonParticipation'>;
interface Overwrites {
    type?: TransactionType.keyreg;
}
declare type KeyRegistrationTransaction = ConstructTransaction<SpecificParameters, Overwrites>;
export default KeyRegistrationTransaction;
