import * as nacl from './nacl/naclWrappers';
import * as address from './encoding/address';
/**
 * generateAccount returns a new Algorand address and its corresponding secret key
 */
export default function generateAccount() {
    const keys = nacl.keyPair();
    const encodedPk = address.encodeAddress(keys.publicKey);
    return { addr: encodedPk, sk: keys.secretKey };
}
//# sourceMappingURL=account.js.map