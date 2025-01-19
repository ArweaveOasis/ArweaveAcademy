import JSONRequest from '../jsonrequest';
export default class GetApplicationByID extends JSONRequest {
    constructor(c, intDecoding, index) {
        super(c, intDecoding);
        this.index = index;
        this.index = index;
    }
    path() {
        return `/v2/applications/${this.index}`;
    }
}
//# sourceMappingURL=getApplicationByID.js.map