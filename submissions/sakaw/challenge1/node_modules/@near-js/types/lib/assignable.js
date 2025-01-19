"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignable = void 0;
class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            this[key] = properties[key];
        });
    }
}
exports.Assignable = Assignable;
