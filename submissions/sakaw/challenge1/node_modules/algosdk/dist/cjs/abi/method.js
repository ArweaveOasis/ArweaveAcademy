"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMethodByName = exports.ABIMethod = void 0;
const naclWrappers_1 = require("../nacl/naclWrappers");
const abi_type_1 = require("./abi_type");
const transaction_1 = require("./transaction");
const reference_1 = require("./reference");
function parseMethodSignature(signature) {
    const argsStart = signature.indexOf('(');
    if (argsStart === -1) {
        throw new Error(`Invalid method signature: ${signature}`);
    }
    let argsEnd = -1;
    let depth = 0;
    for (let i = argsStart; i < signature.length; i++) {
        const char = signature[i];
        if (char === '(') {
            depth += 1;
        }
        else if (char === ')') {
            if (depth === 0) {
                // unpaired parenthesis
                break;
            }
            depth -= 1;
            if (depth === 0) {
                argsEnd = i;
                break;
            }
        }
    }
    if (argsEnd === -1) {
        throw new Error(`Invalid method signature: ${signature}`);
    }
    return {
        name: signature.slice(0, argsStart),
        args: abi_type_1.ABITupleType.parseTupleContent(signature.slice(argsStart + 1, argsEnd)),
        returns: signature.slice(argsEnd + 1),
    };
}
class ABIMethod {
    constructor(params) {
        if (typeof params.name !== 'string' ||
            typeof params.returns !== 'object' ||
            !Array.isArray(params.args)) {
            throw new Error('Invalid ABIMethod parameters');
        }
        this.name = params.name;
        this.description = params.desc;
        this.args = params.args.map(({ type, name, desc }) => {
            if ((0, transaction_1.abiTypeIsTransaction)(type) || (0, reference_1.abiTypeIsReference)(type)) {
                return {
                    type,
                    name,
                    description: desc,
                };
            }
            return {
                type: abi_type_1.ABIType.from(type),
                name,
                description: desc,
            };
        });
        this.returns = {
            type: params.returns.type === 'void'
                ? params.returns.type
                : abi_type_1.ABIType.from(params.returns.type),
            description: params.returns.desc,
        };
    }
    getSignature() {
        const args = this.args.map((arg) => arg.type.toString()).join(',');
        const returns = this.returns.type.toString();
        return `${this.name}(${args})${returns}`;
    }
    getSelector() {
        const hash = (0, naclWrappers_1.genericHash)(this.getSignature());
        return new Uint8Array(hash.slice(0, 4));
    }
    txnCount() {
        let count = 1;
        for (const arg of this.args) {
            if (typeof arg.type === 'string' && (0, transaction_1.abiTypeIsTransaction)(arg.type)) {
                count += 1;
            }
        }
        return count;
    }
    toJSON() {
        return {
            name: this.name,
            desc: this.description,
            args: this.args.map(({ type, name, description }) => ({
                type: type.toString(),
                name,
                desc: description,
            })),
            returns: {
                type: this.returns.type.toString(),
                desc: this.returns.description,
            },
        };
    }
    static fromSignature(signature) {
        const { name, args, returns } = parseMethodSignature(signature);
        return new ABIMethod({
            name,
            args: args.map((arg) => ({ type: arg })),
            returns: { type: returns },
        });
    }
}
exports.ABIMethod = ABIMethod;
function getMethodByName(methods, name) {
    if (methods === null ||
        !Array.isArray(methods) ||
        !methods.every((item) => item instanceof ABIMethod))
        throw new Error('Methods list provided is null or not the correct type');
    const filteredMethods = methods.filter((m) => m.name === name);
    if (filteredMethods.length > 1)
        throw new Error(`found ${filteredMethods.length} methods with the same name ${filteredMethods
            .map((m) => m.getSignature())
            .join(',')}`);
    if (filteredMethods.length === 0)
        throw new Error(`found 0 methods with the name ${name}`);
    return filteredMethods[0];
}
exports.getMethodByName = getMethodByName;
//# sourceMappingURL=method.js.map