import { Wallet, verifyTypedData } from "@ethersproject/wallet";
import { SignatureConfig, SIG_CONFIG } from "../../constants.js";
import keccak256 from "../keccak256.js";
import EthereumSigner from "./ethereumSigner.js";
export default class TypedEthereumSigner extends EthereumSigner {
    ownerLength = SIG_CONFIG[SignatureConfig.TYPEDETHEREUM].pubLength;
    signatureLength = SIG_CONFIG[SignatureConfig.TYPEDETHEREUM].sigLength;
    signatureType = SignatureConfig.TYPEDETHEREUM;
    address;
    signer;
    constructor(key) {
        super(key);
        this.address = "0x" + keccak256(super.publicKey.slice(1)).slice(-20).toString("hex");
        this.signer = new Wallet(key);
    }
    get publicKey() {
        return Buffer.from(this.address);
    }
    async sign(message) {
        const signature = await this.signer._signTypedData(domain, types, {
            address: this.address,
            "Transaction hash": message,
        });
        return Buffer.from(signature.slice(2), "hex"); // trim leading 0x, convert to hex.
    }
    static async verify(pk, message, signature) {
        const address = pk.toString();
        const addr = verifyTypedData(domain, types, { address, "Transaction hash": message }, signature);
        return address.toLowerCase() === addr.toLowerCase();
    }
}
export const domain = {
    name: "Bundlr",
    version: "1",
};
export const types = {
    Bundlr: [
        { name: "Transaction hash", type: "bytes" },
        { name: "address", type: "address" },
    ],
};
export const MESSAGE = "Bundlr(bytes Transaction hash, address address)";
export const DOMAIN = "EIP712Domain(string name,string version)";
//# sourceMappingURL=TypedEthereumSigner.js.map