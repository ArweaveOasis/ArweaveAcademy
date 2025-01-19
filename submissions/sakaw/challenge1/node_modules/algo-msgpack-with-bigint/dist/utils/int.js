"use strict";
// DataView extension to handle int64 / uint64,
// where the actual range is 53-bits integer (a.k.a. safe integer)
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUint64 = exports.getInt64 = exports.setBigInt64 = exports.setInt64 = exports.setUint64 = void 0;
function setUint64(view, offset, value) {
    const high = value / 4294967296;
    const low = value; // high bits are truncated by DataView
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
exports.setUint64 = setUint64;
function setInt64(view, offset, value) {
    const high = Math.floor(value / 4294967296);
    const low = value; // high bits are truncated by DataView
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
exports.setInt64 = setInt64;
function setBigInt64(view, offset, value) {
    let high = Number(value / BigInt(4294967296));
    const low = Number(value % BigInt(4294967296));
    if (high < 0 && low !== 0) {
        // simulate Math.floor for negative high
        high -= 1;
    }
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
}
exports.setBigInt64 = setBigInt64;
function getInt64(view, offset) {
    const high = view.getInt32(offset);
    const low = view.getUint32(offset + 4);
    const exceeds_min_safe_int = high < Math.floor(Number.MIN_SAFE_INTEGER / 4294967296) ||
        (high === Math.floor(Number.MIN_SAFE_INTEGER / 4294967296) && low === 0);
    const exceeds_max_safe_int = high > Math.floor(Number.MAX_SAFE_INTEGER / 4294967296);
    if (exceeds_min_safe_int || exceeds_max_safe_int) {
        return BigInt(high) * BigInt(4294967296) + BigInt(low);
    }
    return high * 4294967296 + low;
}
exports.getInt64 = getInt64;
function getUint64(view, offset) {
    const high = view.getUint32(offset);
    const low = view.getUint32(offset + 4);
    const exceeds_max_safe_int = high > Math.floor(Number.MAX_SAFE_INTEGER / 4294967296);
    if (exceeds_max_safe_int) {
        return BigInt(high) * BigInt(4294967296) + BigInt(low);
    }
    return high * 4294967296 + low;
}
exports.getUint64 = getUint64;
//# sourceMappingURL=int.js.map