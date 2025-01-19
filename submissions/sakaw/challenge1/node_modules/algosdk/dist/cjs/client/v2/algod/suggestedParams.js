"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
/**
 * Returns the common needed parameters for a new transaction, in a format the transaction builder expects
 */
class SuggestedParamsRequest extends jsonrequest_1.default {
    /* eslint-disable class-methods-use-this */
    path() {
        return '/v2/transactions/params';
    }
    prepare(body) {
        return {
            flatFee: false,
            fee: body.fee,
            firstRound: body['last-round'],
            lastRound: body['last-round'] + 1000,
            genesisID: body['genesis-id'],
            genesisHash: body['genesis-hash'],
        };
    }
}
exports.default = SuggestedParamsRequest;
//# sourceMappingURL=suggestedParams.js.map