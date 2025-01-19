// crypto hack - this is to stop arweave-js's import time(!!!) check for `subtleCrypto` - which occurs if you try to use the root import of this SDK.
const hack = () => {
    throw new Error(`Unimplemented`);
};
// @ts-expect-error hack
globalThis.crypto ??= {};
// @ts-expect-error hack
globalThis.crypto.subtle ??= {};
// @ts-expect-error hack
globalThis.crypto.subtle.generateKey ??= hack;
// @ts-expect-error hack
globalThis.crypto.subtle.importKey ??= hack;
// @ts-expect-error hack
globalThis.crypto.subtle.exportKey ??= hack;
// @ts-expect-error hack
globalThis.crypto.subtle.digest ??= hack;
// @ts-expect-error hack
globalThis.crypto.subtle.sign ??= hack;
export default hack;
//# sourceMappingURL=hack.js.map