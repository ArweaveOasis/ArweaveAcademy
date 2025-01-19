"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BundleError extends Error {
    constructor(message) {
        super(message);
        this.name = "BundleError";
    }
}
exports.default = BundleError;
//# sourceMappingURL=error.js.map