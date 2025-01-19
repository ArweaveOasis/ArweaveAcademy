import { ABIMethod, ABIMethodParams } from './method';
export interface ABIInterfaceParams {
    name: string;
    desc?: string;
    methods: ABIMethodParams[];
}
export declare class ABIInterface {
    readonly name: string;
    readonly description?: string;
    readonly methods: ABIMethod[];
    constructor(params: ABIInterfaceParams);
    toJSON(): ABIInterfaceParams;
    getMethodByName(name: string): ABIMethod;
}
