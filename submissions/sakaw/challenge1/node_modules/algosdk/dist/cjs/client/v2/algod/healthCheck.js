"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonrequest_1 = __importDefault(require("../jsonrequest"));
/**
 * healthCheck returns an empty object iff the node is running
 */
class HealthCheck extends jsonrequest_1.default {
    // eslint-disable-next-line class-methods-use-this
    path() {
        return '/health';
    }
    async do(headers = {}) {
        const res = await this.c.get(this.path(), {}, headers);
        if (!res.ok) {
            throw new Error(`Health response: ${res.status}`);
        }
        return {};
    }
}
exports.default = HealthCheck;
//# sourceMappingURL=healthCheck.js.map