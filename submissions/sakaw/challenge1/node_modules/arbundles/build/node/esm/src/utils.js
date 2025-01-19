export function longToNByteArray(N, long) {
    const byteArray = new Uint8Array(N);
    if (long < 0)
        throw new Error("Array is unsigned, cannot represent -ve numbers");
    if (long > 2 ** (N * 8) - 1)
        throw new Error(`Number ${long} is too large for an array of ${N} bytes`);
    for (let index = 0; index < byteArray.length; index++) {
        const byte = long & 0xff;
        byteArray[index] = byte;
        long = (long - byte) / 256;
    }
    return byteArray;
}
export function longTo8ByteArray(long) {
    return longToNByteArray(8, long);
}
export function shortTo2ByteArray(short) {
    return longToNByteArray(2, short);
}
export function longTo16ByteArray(long) {
    return longToNByteArray(16, long);
}
export function longTo32ByteArray(long) {
    return longToNByteArray(32, long);
}
export function byteArrayToLong(byteArray) {
    let value = 0;
    for (let i = byteArray.length - 1; i >= 0; i--) {
        value = value * 256 + byteArray[i];
    }
    return value;
}
// this is bugged for comparing buffers
// export function arraybufferEqual(buf1: Uint8Array, buf2: Uint8Array): boolean {
//   const _buf1 = buf1.buffer;
//   const _buf2 = buf2.buffer;
//   if (_buf1 === _buf2) {
//     return true;
//   }
//   if (_buf1.byteLength !== _buf2.byteLength) {
//     return false;
//   }
//   const view1 = new DataView(_buf1);
//   const view2 = new DataView(_buf2);
//   let i = _buf1.byteLength;
//   while (i--) {
//     if (view1.getUint8(i) !== view2.getUint8(i)) {
//       return false;
//     }
//   }
//   return true;
// }
// // @ts-expect-error These variables are defined in extension environments
// const isExtension = typeof browser !== "undefined" || typeof chrome !== "undefined";
//# sourceMappingURL=utils.js.map