import { ABIMethod, getMethodByName } from './method';
export class ABIInterface {
    constructor(params) {
        if (typeof params.name !== 'string' || !Array.isArray(params.methods)) {
            throw new Error('Invalid ABIInterface parameters');
        }
        this.name = params.name;
        this.description = params.desc;
        this.methods = params.methods.map((method) => new ABIMethod(method));
    }
    toJSON() {
        return {
            name: this.name,
            desc: this.description,
            methods: this.methods.map((method) => method.toJSON()),
        };
    }
    getMethodByName(name) {
        return getMethodByName(this.methods, name);
    }
}
//# sourceMappingURL=interface.js.map