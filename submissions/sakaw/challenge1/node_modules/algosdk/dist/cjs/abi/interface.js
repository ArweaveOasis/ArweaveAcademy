"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIInterface = void 0;
const method_1 = require("./method");
class ABIInterface {
    constructor(params) {
        if (typeof params.name !== 'string' || !Array.isArray(params.methods)) {
            throw new Error('Invalid ABIInterface parameters');
        }
        this.name = params.name;
        this.description = params.desc;
        this.methods = params.methods.map((method) => new method_1.ABIMethod(method));
    }
    toJSON() {
        return {
            name: this.name,
            desc: this.description,
            methods: this.methods.map((method) => method.toJSON()),
        };
    }
    getMethodByName(name) {
        return (0, method_1.getMethodByName)(this.methods, name);
    }
}
exports.ABIInterface = ABIInterface;
//# sourceMappingURL=interface.js.map