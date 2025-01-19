import Api from "./lib/api";
export interface NetworkInfoInterface {
    network: string;
    version: number;
    release: number;
    height: number;
    current: string;
    blocks: number;
    peers: number;
    queue_length: number;
    node_state_latency: number;
}
export interface PeerList extends Array<string> {
}
export default class Network {
    private api;
    constructor(api: Api);
    getInfo(): Promise<NetworkInfoInterface>;
    getPeers(): Promise<PeerList>;
}
