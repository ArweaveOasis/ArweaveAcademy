# @near-js/keystores

A collection of classes for managing NEAR-compatible cryptographic keys.

## Modules

- [KeyStore](src/keystore.ts) abstract class for managing account keys
- [InMemoryKeyStore](src/in_memory_key_store.ts) implementation of `KeyStore` using an in-memory data structure local to the instance
- [MergeKeyStore](src/merge_key_store.ts) implementation of `KeyStore` aggregating multiple `KeyStore` implementations

# License

This repository is distributed under the terms of both the MIT license and the Apache License (Version 2.0).
See [LICENSE](https://github.com/near/near-api-js/blob/master/LICENSE) and [LICENSE-APACHE](https://github.com/near/near-api-js/blob/master/LICENSE-APACHE) for details.
