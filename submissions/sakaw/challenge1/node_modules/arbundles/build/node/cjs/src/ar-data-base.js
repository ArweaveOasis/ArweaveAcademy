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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./nodeUtils.js");
function getSignatureData(item) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, utils_1.deepHash)([
            (0, utils_1.stringToBuffer)("dataitem"),
            (0, utils_1.stringToBuffer)("1"),
            (0, utils_1.stringToBuffer)(item.signatureType.toString()),
            item.rawOwner,
            item.rawTarget,
            item.rawAnchor,
            item.rawTags,
            item.rawData,
        ]);
    });
}
exports.default = getSignatureData;
//# sourceMappingURL=ar-data-base.js.map