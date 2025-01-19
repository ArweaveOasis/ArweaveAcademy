import Arweave from "./common";
declare global {
    interface Window {
        Arweave: typeof Arweave;
    }
    module globalThis {
        var Arweave: unknown;
    }
}
export * from "./common";
export default Arweave;
