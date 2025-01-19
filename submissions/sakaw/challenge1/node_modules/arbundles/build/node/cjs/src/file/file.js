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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExportForTesting = exports.signedFileStream = exports.getTags = exports.getAnchor = exports.getTarget = exports.getOwner = exports.getSignature = exports.getId = exports.getHeaders = exports.getHeaderAt = exports.numberOfItems = exports.fileToJson = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
const utils_1 = require("../utils");
const base64url_1 = __importDefault(require("base64url"));
const index_1 = require("../stream/index");
const tags_1 = require("../tags");
const read = (0, util_1.promisify)(fs_1.read);
const fileToFd = (f) => __awaiter(void 0, void 0, void 0, function* () { return (typeof f === "string" ? yield fs_1.promises.open(f, "r") : f); });
function fileToJson(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const handle = yield fs_1.promises.open(filename, "r");
        const fd = handle.fd;
        let tagsStart = 512 + 512 + 2;
        const targetPresent = yield read(fd, Buffer.alloc(1), 1024, 64, null).then((value) => value.buffer[0] == 1);
        tagsStart += targetPresent ? 32 : 0;
        const anchorPresentByte = targetPresent ? 1057 : 1025;
        const anchorPresent = yield read(fd, Buffer.alloc(1), anchorPresentByte, 64, null).then((value) => value.buffer[0] == 1);
        tagsStart += anchorPresent ? 32 : 0;
        const numberOfTags = (0, utils_1.byteArrayToLong)(yield read(fd, Buffer.alloc(8), tagsStart, 8, 0).then((value) => value.buffer));
        let tags = [];
        if (numberOfTags > 0) {
            const numberOfTagBytesArray = yield read(fd, Buffer.alloc(8), tagsStart + 8, 8, 0).then((value) => value.buffer);
            const numberOfTagBytes = (0, utils_1.byteArrayToLong)(numberOfTagBytesArray);
            const tagBytes = yield read(fd, Buffer.alloc(8), tagsStart + 16, numberOfTagBytes, 0).then((value) => value.buffer);
            tags = (0, tags_1.deserializeTags)(tagBytes);
        }
        const id = filename;
        const owner = "";
        const target = "";
        const data_size = 0;
        const fee = 0;
        const signature = "";
        yield handle.close();
        return {
            id,
            owner,
            tags,
            target,
            data_size,
            fee,
            signature,
        };
    });
}
exports.fileToJson = fileToJson;
function numberOfItems(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const fd = yield fileToFd(file);
        const headerBuffer = yield read(fd.fd, Buffer.allocUnsafe(32), 0, 32, 0).then((v) => v.buffer);
        yield fd.close();
        return (0, utils_1.byteArrayToLong)(headerBuffer);
    });
}
exports.numberOfItems = numberOfItems;
function getHeaderAt(file, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const fd = yield fileToFd(file);
        const headerBuffer = yield read(fd.fd, Buffer.alloc(64), 0, 64, 32 + 64 * index).then((v) => v.buffer);
        yield fd.close();
        return {
            offset: (0, utils_1.byteArrayToLong)(headerBuffer.subarray(0, 32)),
            id: base64url_1.default.encode(headerBuffer.subarray(32, 64)),
        };
    });
}
exports.getHeaderAt = getHeaderAt;
function getHeaders(file) {
    return __asyncGenerator(this, arguments, function* getHeaders_1() {
        const count = yield __await(numberOfItems(file));
        for (let i = 0; i < count; i++) {
            yield yield __await(getHeaderAt(file, i));
        }
    });
}
exports.getHeaders = getHeaders;
function getId(file, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fd = yield fileToFd(file);
        const offset = (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : 0;
        const buffer = yield read(fd.fd, Buffer.allocUnsafe(512), offset, 512, null).then((r) => r.buffer);
        yield fd.close();
        return buffer;
    });
}
exports.getId = getId;
function getSignature(file, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fd = yield fileToFd(file);
        const offset = (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : 0;
        const buffer = yield read(fd.fd, Buffer.allocUnsafe(512), offset, 512, null).then((r) => r.buffer);
        yield fd.close();
        return buffer;
    });
}
exports.getSignature = getSignature;
function getOwner(file, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fd = yield fileToFd(file);
        const offset = (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : 0;
        const buffer = yield read(fd.fd, Buffer.allocUnsafe(512), offset + 512, 512, null).then((r) => r.buffer);
        yield fd.close();
        return base64url_1.default.encode(buffer);
    });
}
exports.getOwner = getOwner;
function getTarget(file, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fd = yield fileToFd(file);
        const offset = (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : 0;
        const targetStart = offset + 1024;
        const targetPresent = yield read(fd.fd, Buffer.allocUnsafe(1), targetStart, 1, null).then((value) => value.buffer[0] == 1);
        if (!targetPresent) {
            yield fd.close();
            return undefined;
        }
        const buffer = yield read(fd.fd, Buffer.allocUnsafe(32), targetStart + 1, 32, null).then((r) => r.buffer);
        yield fd.close();
        return base64url_1.default.encode(buffer);
    });
}
exports.getTarget = getTarget;
function getAnchor(file, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fd = yield fileToFd(file);
        const offset = (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : 0;
        const targetPresent = yield read(fd.fd, Buffer.allocUnsafe(1), 1024, 1, null).then((value) => value.buffer[0] == 1);
        let anchorStart = offset + 1025;
        if (targetPresent) {
            anchorStart += 32;
        }
        const anchorPresent = yield read(fd.fd, Buffer.allocUnsafe(1), anchorStart, 1, null).then((value) => value.buffer[0] == 1);
        if (!anchorPresent) {
            yield fd.close();
            return undefined;
        }
        const buffer = yield read(fd.fd, Buffer.allocUnsafe(32), anchorStart + 1, 32, null).then((r) => r.buffer);
        yield fd.close();
        return base64url_1.default.encode(buffer);
    });
}
exports.getAnchor = getAnchor;
function getTags(file, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const fd = yield fileToFd(file);
        const offset = (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : 0;
        let tagsStart = 512 + 512 + 2 + ((_b = options === null || options === void 0 ? void 0 : options.offset) !== null && _b !== void 0 ? _b : 0);
        const targetPresent = yield read(fd.fd, Buffer.allocUnsafe(1), 0, 1, offset + 1024).then((value) => value.buffer[0] == 1);
        tagsStart += targetPresent ? 32 : 0;
        const anchorPresentByte = offset + (targetPresent ? 1057 : 1025);
        const anchorPresent = yield read(fd.fd, Buffer.allocUnsafe(1), 0, 1, anchorPresentByte).then((value) => value.buffer[0] == 1);
        tagsStart += anchorPresent ? 32 : 0;
        const numberOfTags = (0, utils_1.byteArrayToLong)(yield read(fd.fd, Buffer.allocUnsafe(8), 0, 8, tagsStart).then((value) => value.buffer));
        if (numberOfTags == 0) {
            yield fd.close();
            return [];
        }
        const numberOfTagBytesArray = yield read(fd.fd, Buffer.allocUnsafe(8), 0, 8, tagsStart + 8).then((value) => value.buffer);
        const numberOfTagBytes = (0, utils_1.byteArrayToLong)(numberOfTagBytesArray);
        const tagBytes = yield read(fd.fd, Buffer.allocUnsafe(numberOfTagBytes), 0, numberOfTagBytes, tagsStart + 16).then((value) => value.buffer);
        yield fd.close();
        return (0, tags_1.deserializeTags)(tagBytes);
    });
}
exports.getTags = getTags;
function signedFileStream(path, signer, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, index_1.streamSigner)((0, fs_1.createReadStream)(path), (0, fs_1.createReadStream)(path), signer, opts);
    });
}
exports.signedFileStream = signedFileStream;
exports.fileExportForTesting = {
    fileToFd,
};
//# sourceMappingURL=file.js.map