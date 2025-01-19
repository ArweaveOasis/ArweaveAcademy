import Curve25519 from "./keys/curve25519.js";
import { ArweaveSigner, EthereumSigner, HexInjectedSolanaSigner, InjectedAptosSigner, MultiSignatureAptosSigner, TypedEthereumSigner, } from "./chains/index.js";
export const indexToType = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    1: ArweaveSigner,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    2: Curve25519,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    3: EthereumSigner,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    4: HexInjectedSolanaSigner,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    5: InjectedAptosSigner,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    6: MultiSignatureAptosSigner,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    7: TypedEthereumSigner,
};
//# sourceMappingURL=constants.js.map