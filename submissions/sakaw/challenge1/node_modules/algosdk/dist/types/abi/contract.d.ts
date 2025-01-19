import { ABIMethod, ABIMethodParams } from './method';
export interface ABIContractNetworkInfo {
    appID: number;
}
export interface ABIContractNetworks {
    [network: string]: ABIContractNetworkInfo;
}
export interface ABIContractParams {
    name: string;
    desc?: string;
    networks?: ABIContractNetworks;
    methods: ABIMethodParams[];
}
export declare class ABIContract {
    readonly name: string;
    readonly description?: string;
    readonly networks: ABIContractNetworks;
    readonly methods: ABIMethod[];
    constructor(params: ABIContractParams);
    toJSON(): ABIContractParams;
    getMethodByName(name: string): ABIMethod;
}
