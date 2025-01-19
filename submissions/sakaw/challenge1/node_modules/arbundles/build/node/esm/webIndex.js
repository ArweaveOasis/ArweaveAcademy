import * as arbundlesSrc from "./src/index.js";
import * as stream from "./src/stream/index.js";
const expObj = { ...arbundlesSrc, stream };
globalThis.arbundles ??= expObj;
export * from "./src/index.js";
export * from "./src/stream/index.js";
export default expObj;
export const arbundles = expObj;
//# sourceMappingURL=webIndex.js.map