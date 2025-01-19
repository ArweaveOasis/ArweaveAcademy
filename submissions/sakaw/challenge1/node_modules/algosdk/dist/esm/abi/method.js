import { genericHash } from '../nacl/naclWrappers';
import { ABIType, ABITupleType } from './abi_type';
import { abiTypeIsTransaction } from './transaction';
import { abiTypeIsReference } from './reference';
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
        args: ABITupleType.parseTupleContent(signature.slice(argsStart + 1, argsEnd)),
        returns: signature.slice(argsEnd + 1),
    };
}
export class ABIMethod {
    constructor(params) {
        if (typeof params.name !== 'string' ||
            typeof params.returns !== 'object' ||
            !Array.isArray(params.args)) {
            throw new Error('Invalid ABIMethod parameters');
        }
        this.name = params.name;
        this.description = params.desc;
        this.args = params.args.map(({ type, name, desc }) => {
            if (abiTypeIsTransaction(type) || abiTypeIsReference(type)) {
                return {
                    type,
                    name,
                    description: desc,
                };
            }
            return {
                type: ABIType.from(type),
                name,
                description: desc,
            };
        });
        this.returns = {
            type: params.returns.type === 'void'
                ? params.returns.type
                : ABIType.from(params.returns.type),
            description: params.returns.desc,
        };
    }
    getSignature() {
        const args = this.args.map((arg) => arg.type.toString()).join(',');
        const returns = this.returns.type.toString();
        return `${this.name}(${args})${returns}`;
    }
    getSelector() {
        const hash = genericHash(this.getSignature());
        return new Uint8Array(hash.slice(0, 4));
    }
    txnCount() {
        let count = 1;
        for (const arg of this.args) {
            if (typeof arg.type === 'string' && abiTypeIsTransaction(arg.type)) {
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
export function getMethodByName(methods, name) {
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
//# sourceMappingURL=method.js.map