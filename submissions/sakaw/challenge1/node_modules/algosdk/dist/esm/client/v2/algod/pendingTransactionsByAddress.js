import JSONRequest from '../jsonrequest';
import * as encoding from '../../../encoding/encoding';
/**
 * returns all transactions for a PK [addr] in the [first, last] rounds range.
 */
export default class PendingTransactionsByAddress extends JSONRequest {
    constructor(c, address) {
        super(c);
        this.address = address;
        this.address = address;
        this.query.format = 'msgpack';
    }
    // eslint-disable-next-line class-methods-use-this
    prepare(body) {
        if (body && body.byteLength > 0) {
            return encoding.decode(body);
        }
        return undefined;
    }
    path() {
        return `/v2/accounts/${this.address}/transactions/pending`;
    }
    // max sets the maximum number of txs to return
    max(max) {
        this.query.max = max;
        return this;
    }
}
//# sourceMappingURL=pendingTransactionsByAddress.js.map