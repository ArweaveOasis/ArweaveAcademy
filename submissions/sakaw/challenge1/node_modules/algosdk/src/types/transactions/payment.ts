import { TransactionType, TransactionParams } from './base';
import { ConstructTransaction } from './builder';

type SpecificParameters = Pick<
  TransactionParams,
  'to' | 'amount' | 'closeRemainderTo'
>;

interface Overwrites {
  type?: TransactionType.pay;
}

type PaymentTransaction = ConstructTransaction<SpecificParameters, Overwrites>;
export default PaymentTransaction;
