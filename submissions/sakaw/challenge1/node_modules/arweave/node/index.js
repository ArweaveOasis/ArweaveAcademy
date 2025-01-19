"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const common_1 = __importDefault(require("./common"));
common_1.default.init = function (apiConfig = {}) {
    return new common_1.default(apiConfig);
};
module.exports = common_1.default;
//# sourceMappingURL=index.js.map