import JSONRequest from '../jsonrequest';
import { concatArrays } from '../../../utils/utils';
/**
 * Sets the default header (if not previously set) for sending a raw
 * transaction.
 * @param headers - A headers object
 */
export function setSendTransactionHeaders(headers = {}) {
    let hdrs = headers;
    if (Object.keys(hdrs).every((key) => key.toLowerCase() !== 'content-type')) {
        hdrs = { ...headers };
        hdrs['Content-Type'] = 'application/x-binary';
    }
    return hdrs;
}
function isByteArray(array) {
    return array && array.byteLength !== undefined;
}
/**
 * broadcasts the passed signed txns to the network
 */
export default class SendRawTransaction extends JSONRequest {
    constructor(c, stxOrStxs) {
        super(c);
        let forPosting = stxOrStxs;
        if (Array.isArray(stxOrStxs)) {
            if (!stxOrStxs.every(isByteArray)) {
                throw new TypeError('Array elements must be byte arrays');
            }
            // Flatten into a single Uint8Array
            forPosting = concatArrays(...stxOrStxs);
        }
        else if (!isByteArray(forPosting)) {
            throw new TypeError('Argument must be byte array');
        }
        this.txnBytesToPost = forPosting;
    }
    // eslint-disable-next-line class-methods-use-this
    path() {
        return '/v2/transactions';
    }
    async do(headers = {}) {
        const txHeaders = setSendTransactionHeaders(headers);
        const res = await this.c.post(this.path(), Buffer.from(this.txnBytesToPost), txHeaders);
        return res.body;
    }
}
//# sourceMappingURL=sendRawTransaction.js.map