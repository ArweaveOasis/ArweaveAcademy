"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class GetBlockHash extends jsonrequest_1.default {
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
exports.default = GetBlockHash;
//# sourceMappingURL=getBlockHash.js.map