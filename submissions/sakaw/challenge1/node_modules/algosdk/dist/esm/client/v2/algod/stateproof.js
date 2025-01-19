import JSONRequest from '../jsonrequest';
export default class StateProof extends JSONRequest {
    constructor(c, intDecoding, round) {
        super(c, intDecoding);
        this.round = round;
        this.round = round;
    }
    path() {
        return `/v2/stateproofs/${this.round}`;
    }
}
//# sourceMappingURL=stateproof.js.map