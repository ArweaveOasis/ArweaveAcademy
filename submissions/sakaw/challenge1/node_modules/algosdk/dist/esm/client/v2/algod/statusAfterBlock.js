import JSONRequest from '../jsonrequest';
export default class StatusAfterBlock extends JSONRequest {
    constructor(c, intDecoding, round) {
        super(c, intDecoding);
        this.round = round;
        if (!Number.isInteger(round))
            throw Error('round should be an integer');
        this.round = round;
    }
    path() {
        return `/v2/status/wait-for-block-after/${this.round}`;
    }
}
//# sourceMappingURL=statusAfterBlock.js.map