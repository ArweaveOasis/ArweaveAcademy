"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Network {
    constructor(api) {
        this.api = api;
    }
    getInfo() {
        return this.api.get(`info`).then((response) => {
            return response.data;
        });
    }
    getPeers() {
        return this.api.get(`peers`).then((response) => {
            return response.data;
        });
    }
}
exports.default = Network;
//# sourceMappingURL=network.js.map