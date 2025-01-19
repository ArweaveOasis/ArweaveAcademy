"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class AccountAssetInformation extends jsonrequest_1.default {
    constructor(c, intDecoding, account, assetID) {
        super(c, intDecoding);
        this.account = account;
        this.assetID = assetID;
        this.account = account;
        this.assetID = assetID;
    }
    path() {
        return `/v2/accounts/${this.account}/assets/${this.assetID}`;
    }
}
exports.default = AccountAssetInformation;
//# sourceMappingURL=accountAssetInformation.js.map