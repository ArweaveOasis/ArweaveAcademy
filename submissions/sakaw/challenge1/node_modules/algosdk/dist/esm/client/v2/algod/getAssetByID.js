import JSONRequest from '../jsonrequest';
export default class GetAssetByID extends JSONRequest {
    constructor(c, intDecoding, index) {
        super(c, intDecoding);
        this.index = index;
        this.index = index;
    }
    path() {
        return `/v2/assets/${this.index}`;
    }
}
//# sourceMappingURL=getAssetByID.js.map