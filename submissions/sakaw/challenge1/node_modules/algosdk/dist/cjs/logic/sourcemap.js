"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceMap = void 0;
const vlq = __importStar(require("vlq"));
class SourceMap {
    constructor({ version, sources, names, mappings, }) {
        this.version = version;
        this.sources = sources;
        this.names = names;
        this.mappings = mappings;
        if (this.version !== 3)
            throw new Error(`Only version 3 is supported, got ${this.version}`);
        if (this.mappings === undefined)
            throw new Error('mapping undefined, cannot build source map without `mapping`');
        const pcList = this.mappings.split(';').map((m) => {
            const decoded = vlq.decode(m);
            if (decoded.length > 2)
                return decoded[2];
            return undefined;
        });
        this.pcToLine = {};
        this.lineToPc = {};
        let lastLine = 0;
        for (const [pc, lineDelta] of pcList.entries()) {
            // If the delta is not undefined, the lastLine should be updated with
            // lastLine + the delta
            if (lineDelta !== undefined) {
                lastLine += lineDelta;
            }
            if (!(lastLine in this.lineToPc))
                this.lineToPc[lastLine] = [];
            this.lineToPc[lastLine].push(pc);
            this.pcToLine[pc] = lastLine;
        }
    }
    getLineForPc(pc) {
        return this.pcToLine[pc];
    }
    getPcsForLine(line) {
        return this.lineToPc[line];
    }
}
exports.SourceMap = SourceMap;
//# sourceMappingURL=sourcemap.js.map