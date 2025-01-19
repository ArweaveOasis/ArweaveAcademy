"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIContract = void 0;
const method_1 = require("./method");
class ABIContract {
    constructor(params) {
        if (typeof params.name !== 'string' ||
            !Array.isArray(params.methods) ||
            (params.networks && typeof params.networks !== 'object')) {
            throw new Error('Invalid ABIContract parameters');
        }
        this.name = params.name;
        this.description = params.desc;
        this.networks = params.networks ? { ...params.networks } : {};
        this.methods = params.methods.map((method) => new method_1.ABIMethod(method));
    }
    toJSON() {
        return {
            name: this.name,
            desc: this.description,
            networks: this.networks,
            methods: this.methods.map((method) => method.toJSON()),
        };
    }
    getMethodByName(name) {
        return (0, method_1.getMethodByName)(this.methods, name);
    }
}
exports.ABIContract = ABIContract;
//# sourceMappingURL=contract.js.map