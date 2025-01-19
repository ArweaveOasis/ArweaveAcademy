"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class AccountInformation extends jsonrequest_1.default {
    constructor(c, intDecoding, account) {
        super(c, intDecoding);
        this.account = account;
        this.account = account;
    }
    path() {
        return `/v2/accounts/${this.account}`;
    }
    /**
     * Exclude assets and application data from results
     *
     * #### Example
     * ```typescript
     * const address = "XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA";
     * const accountInfo = await algodClient.accountInformation(address)
     *        .exclude('all')
     *        .do();
     * ```
     *
     * @param round
     * @category query
     */
    exclude(exclude) {
        this.query.exclude = exclude;
        return this;
    }
}
exports.default = AccountInformation;
//# sourceMappingURL=accountInformation.js.map