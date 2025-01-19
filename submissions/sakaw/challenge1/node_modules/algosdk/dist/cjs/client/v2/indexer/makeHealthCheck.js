"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
/**
 * Returns the health object for the service.
 * Returns 200 if healthy.
 *
 * #### Example
 * ```typescript
 * const health = await indexerClient.makeHealthCheck().do();
 * ```
 *
 * [Response data schema details](https://developer.algorand.org/docs/rest-apis/indexer/#get-health)
 * @category GET
 */
class MakeHealthCheck extends jsonrequest_1.default {
    /**
     * @returns `/health`
     */
    // eslint-disable-next-line class-methods-use-this
    path() {
        return '/health';
    }
}
exports.default = MakeHealthCheck;
//# sourceMappingURL=makeHealthCheck.js.map