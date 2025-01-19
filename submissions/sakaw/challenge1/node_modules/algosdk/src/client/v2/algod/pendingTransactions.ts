import JSONRequest from '../jsonrequest';
import HTTPClient from '../../client';
import * as encoding from '../../../encoding/encoding';

/**
 * pendingTransactionsInformation returns transactions that are pending in the pool
 */
export default class PendingTransactions extends JSONRequest {
  constructor(c: HTTPClient) {
    super(c);
    this.query.format = 'msgpack';
  }

  /* eslint-disable class-methods-use-this */
  path() {
    return '/v2/transactions/pending';
  }

  prepare(body: Uint8Array) {
    if (body && body.byteLength > 0) {
      return encoding.decode(body) as Record<string, any>;
    }
    return undefined;
  }
  /* eslint-enable class-methods-use-this */

  // max sets the maximum number of txs to return
  max(max: number) {
    this.query.max = max;
    return this;
  }
}
