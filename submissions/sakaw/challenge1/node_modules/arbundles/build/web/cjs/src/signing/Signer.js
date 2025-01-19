"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signer = void 0;
class Signer {
    static verify(_pk, _message, _signature, _opts) {
        throw new Error("You must implement verify method on child");
    }
}
exports.Signer = Signer;
//# sourceMappingURL=Signer.js.map