"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const httpAgent = new http_1.default.Agent({ keepAlive: true });
const httpsAgent = new https_1.default.Agent({ keepAlive: true });
function agent(_parsedURL) {
    if (_parsedURL.protocol === 'http:') {
        return httpAgent;
    }
    else {
        return httpsAgent;
    }
}
function default_1(resource, init) {
    return (0, node_fetch_1.default)(resource, Object.assign({ agent: agent(new URL(resource.toString())) }, init));
}
exports.default = default_1;
