import JSONRequest from '../jsonrequest';
import * as encoding from '../../../encoding/encoding';
/**
 * returns the transaction information for a specific txid of a pending transaction
 */
export default class PendingTransactionInformation extends JSONRequest {
    constructor(c, txid) {
        super(c);
        this.txid = txid;
        this.txid = txid;
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
        return `/v2/transactions/pending/${this.txid}`;
    }
    // max sets the maximum number of txs to return
    max(max) {
        this.query.max = max;
        return this;
    }
}
//# sourceMappingURL=pendingTransactionInformation.js.map