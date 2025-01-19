# @near-js/crypto

A collection of classes and types for working with cryptographic key pairs.

## Modules

- [PublicKey](src/public_key.ts) representation of a public key capable of verifying signatures
- [KeyPairBase](src/key_pair_base.ts) abstract class representing a key pair
- [KeyPair](src/key_pair.ts) abstract extension of `KeyPairBase` with static methods for parsing and generating key pairs
- [KeyPairEd25519](src/key_pair_ed25519.ts) implementation of `KeyPairBase` using [Ed25519](https://en.wikipedia.org/wiki/EdDSA#Ed25519)
- [Constants](src/constants.ts) keypair-specific constants

# License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](https://github.com/near/near-api-js/blob/master/LICENSE) and [LICENSE-APACHE](https://github.com/near/near-api-js/blob/master/LICENSE-APACHE) for details.
