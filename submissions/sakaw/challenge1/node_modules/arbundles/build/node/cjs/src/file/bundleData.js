"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleAndSignData = void 0;
const tmp_promise_1 = require("tmp-promise");
const utils_1 = require("../utils");
const FileBundle_1 = __importDefault(require("./FileBundle"));
const fs_1 = require("fs");
function bundleAndSignData(dataItems, signer, dir) {
    return __awaiter(this, void 0, void 0, function* () {
        const headerFile = yield (0, tmp_promise_1.file)({ dir });
        const headerStream = (0, fs_1.createWriteStream)(headerFile.path);
        const files = new Array(dataItems.length);
        headerStream.write((0, utils_1.longTo32ByteArray)(dataItems.length));
        for (const [index, item] of dataItems.entries()) {
            const dataItem = item;
            if (!dataItem.isSigned()) {
                yield dataItem.sign(signer);
            }
            files[index] = dataItem.filename;
            headerStream.write(Buffer.concat([Buffer.from((0, utils_1.longTo32ByteArray)(yield dataItem.size())), dataItem.rawId]));
        }
        yield new Promise((resolve) => headerStream.end(resolve));
        headerStream.close();
        return new FileBundle_1.default(headerFile.path, files);
    });
}
exports.bundleAndSignData = bundleAndSignData;
//# sourceMappingURL=bundleData.js.map