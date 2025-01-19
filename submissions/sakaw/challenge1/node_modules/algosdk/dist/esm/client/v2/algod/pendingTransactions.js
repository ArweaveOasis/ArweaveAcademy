import JSONRequest from '../jsonrequest';
import * as encoding from '../../../encoding/encoding';
/**
 * pendingTransactionsInformation returns transactions that are pending in the pool
 */
export default class PendingTransactions extends JSONRequest {
    constructor(c) {
        super(c);
        this.query.format = 'msgpack';
    }
    /* eslint-disable class-methods-use-this */
    path() {
        return '/v2/transactions/pending';
    }
    prepare(body) {
        if (body && body.byteLength > 0) {
            return encoding.decode(body);
        }
        return undefined;
    }
    /* eslint-enable class-methods-use-this */
    // max sets the maximum number of txs to return
    max(max) {
        this.query.max = max;
        return this;
    }
}
//# sourceMappingURL=pendingTransactions.js.map