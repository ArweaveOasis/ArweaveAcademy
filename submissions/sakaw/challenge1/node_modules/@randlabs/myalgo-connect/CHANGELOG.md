# MyAlgo Connect Change log

## [1.4.2] - 2022-11-28

 - Update jsdoc for `signTxns` `authAddr` setting

## [1.4.1] - 2022-11-07

 - Update jsdoc for `signTxns` `stxn` setting

## [1.4.0] - 2022-10-24

 - Added new ARC-0001 compliant function `signTxns`.

## [1.3.0] - 2022-08-24

### Added

 - Added new function `signBytes` to sign an arbitrary array of bytes. See also: [algosdk.signBytes](https://algorand.github.io/js-algorand-sdk/modules.html#signBytes). This operation is only supported for mnemonic accounts.

## [1.2.0] - 2022-06-02

### Added

 - Added new function `tealSign` to generate `ed25519` signatures that can be verified by a teal program. See also: [ed25519verify opcode](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/#ed25519verify) and [algosdk.tealSign](https://algorand.github.io/js-algorand-sdk/modules.html#tealSign). This operation is only supported for mnemonic accounts.

## [1.1.3] - 2022-04-13

### Added

 - Added optional object parameter to the `signTransaction` method to force MyAlgoConnect to sign with a specific account

### Fixed

 - Fixed error caused by undefined `window` reference when working with server side applications/frameworks such as Next.js (see related [issue](https://github.com/randlabs/communication-bridge/issues/5))

### Known issue

- MyAlgo Connect package still has the `Buffer is not defined` error (#27).

## [1.1.2] - 2022-01-10

### Added

- Added new param in the constructor `disableLedgerNano`
- Added two new params for connect method `openManager` and `shouldSelectOneAccount`

### Updated

- Removed belterjs from dependencies
- Improved popup handlers

### Known issue

- MyAlgo Connect package still has the `Buffer is not defined` error (#27).

## [1.1.1] - 2021-09-01

### Added

- Added new field `extraPages`
- Allow zero fee (Fee polling)

### Known issue

- MyAlgo Connect package still has the `Buffer is not defined` error (#27).

## [1.1.0] - 2021-07-13

### Added

- Added support for algosdk `EncodedTransaction`.
- Added support for signing transactions array with Ledger Nano wallet.
- Now `connect` method will return the account's name.
- Added new warnings for risk transactions.
- Added new error views.
- Added account name in the header on signing popups.
- Added support for rekeyed accounts.

### Updated

- Updated `connect` method arguments.
- New UI interface that includes account list, transaction list, transaction views and warnings views.
- Errors like `Not Allowed` and `Not supported` will be handled by the popup and not by the dApp.
- Improved the signTransaction popup security, now every transaction field will be validated (by its type) and will not allow additional fields.
- Improved popup security, now after receiving the method it will stop receiving data from the dApp.

### Deleted

- Removed support for `signer` field.
- Removed `strictEmptyAddressChecking` field, going forward will always be false.

### Fixed

- Fixed bug on transactions array when the asset does not display the correct amount.
- Fixed bug on invalid transaction the popup went blank (#28).
- Fixed decimals bug.
- Fixed note bug. Now the `note` field must be an Uint8Array (or a base64 string that must be decoded to an Uint8Array type).

### Known issue

- MyAlgo Connect package still has the `Buffer is not defined` error (#27).

## [1.0.1] - 2021-03-08

### Fixes

- Exported SignedTxn (#14).
- Minor fixes

## [1.0.0] - 2021-03-04

- Initial release.
