import * as encoding from '../../../encoding/encoding';
import JSONRequest from '../jsonrequest';
/**
 * block gets the block info for the given round. this call may block
 */
export default class Block extends JSONRequest {
    constructor(c, roundNumber) {
        super(c);
        if (!Number.isInteger(roundNumber))
            throw Error('roundNumber should be an integer');
        this.round = roundNumber;
        this.query = { format: 'msgpack' };
    }
    path() {
        return `/v2/blocks/${this.round}`;
    }
    // eslint-disable-next-line class-methods-use-this
    prepare(body) {
        if (body && body.byteLength > 0) {
            return encoding.decode(body);
        }
        return undefined;
    }
}
//# sourceMappingURL=block.js.map