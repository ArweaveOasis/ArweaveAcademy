import JSONRequest from '../jsonrequest';
export default class GetBlockHash extends JSONRequest {
    constructor(c, intDecoding, roundNumber) {
        super(c, intDecoding);
        if (!Number.isInteger(roundNumber))
            throw Error('roundNumber should be an integer');
        this.round = roundNumber;
    }
    path() {
        return `/v2/blocks/${this.round}/hash`;
    }
}
//# sourceMappingURL=getBlockHash.js.map