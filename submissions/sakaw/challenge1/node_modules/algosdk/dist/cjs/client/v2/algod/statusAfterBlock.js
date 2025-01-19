"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
class StatusAfterBlock extends jsonrequest_1.default {
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
exports.default = StatusAfterBlock;
//# sourceMappingURL=statusAfterBlock.js.map