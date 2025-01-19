"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class AccountApplicationInformation extends jsonrequest_1.default {
    constructor(c, intDecoding, account, applicationID) {
        super(c, intDecoding);
        this.account = account;
        this.applicationID = applicationID;
        this.account = account;
        this.applicationID = applicationID;
    }
    path() {
        return `/v2/accounts/${this.account}/applications/${this.applicationID}`;
    }
}
exports.default = AccountApplicationInformation;
//# sourceMappingURL=accountApplicationInformation.js.map