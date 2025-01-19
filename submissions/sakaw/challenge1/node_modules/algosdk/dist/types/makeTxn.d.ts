import * as txnBuilder from './transaction';
import { PaymentTxn, KeyRegistrationTxn, MustHaveSuggestedParams, MustHaveSuggestedParamsInline, AssetCreateTxn, AssetConfigTxn, AssetDestroyTxn, AssetFreezeTxn, AssetTransferTxn, AppCreateTxn, AppUpdateTxn, AppDeleteTxn, AppOptInTxn, AppCloseOutTxn, AppClearStateTxn, AppNoOpTxn } from './types/transactions';
import { RenameProperties, RenameProperty, Expand } from './types/utils';
/**
 * makePaymentTxnWithSuggestedParams takes payment arguments and returns a Transaction object
 * @param from - string representation of Algorand address of sender
 * @param to - string representation of Algorand address of recipient
 * @param amount - integer amount to send, in microAlgos
 * @param closeRemainderTo - optionally close out remaining account balance to this account, represented as string rep of Algorand address
 * @param note - uint8array of arbitrary data for sender to store
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param rekeyTo - rekeyTo address, optional
 */
export declare function makePaymentTxnWithSuggestedParams(from: PaymentTxn['from'], to: PaymentTxn['to'], amount: PaymentTxn['amount'], closeRemainderTo: PaymentTxn['closeRemainderTo'], note: PaymentTxn['note'], suggestedParams: MustHaveSuggestedParams<PaymentTxn>['suggestedParams'], rekeyTo?: PaymentTxn['reKeyTo']): txnBuilder.Transaction;
/**
 * makePaymentTxn takes payment arguments and returns a Transaction object
 * @param from - string representation of Algorand address of sender
 * @param to - string representation of Algorand address of recipient
 * @param fee - integer fee per byte, in microAlgos. for a flat fee, overwrite the fee property on the returned object
 * If the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 * @param amount - integer amount to send, in microAlgos
 * @param closeRemainderTo - optionally close out remaining account balance to this account, represented as string rep of Algorand address
 * @param firstRound - integer first protocol round on which this txn is valid
 * @param lastRound - integer last protocol round on which this txn is valid
 * @param note - uint8array of arbitrary data for sender to store
 * @param genesisHash - string specifies hash genesis block of network in use
 * @param genesisID - string specifies genesis ID of network in use
 * @param rekeyTo - rekeyTo address, optional
 * @Deprecated in version 2.0 this will change to use the "WithSuggestedParams" signature.
 */
export declare function makePaymentTxn(from: PaymentTxn['from'], to: PaymentTxn['to'], fee: MustHaveSuggestedParamsInline<PaymentTxn>['fee'], amount: PaymentTxn['amount'], closeRemainderTo: PaymentTxn['closeRemainderTo'], firstRound: MustHaveSuggestedParamsInline<PaymentTxn>['firstRound'], lastRound: MustHaveSuggestedParamsInline<PaymentTxn>['lastRound'], note: PaymentTxn['note'], genesisHash: MustHaveSuggestedParamsInline<PaymentTxn>['genesisHash'], genesisID: MustHaveSuggestedParamsInline<PaymentTxn>['genesisID'], rekeyTo?: PaymentTxn['reKeyTo']): txnBuilder.Transaction;
export declare function makePaymentTxnWithSuggestedParamsFromObject(o: Expand<Pick<RenameProperty<MustHaveSuggestedParams<PaymentTxn>, 'reKeyTo', 'rekeyTo'>, 'from' | 'to' | 'amount' | 'closeRemainderTo' | 'note' | 'suggestedParams' | 'rekeyTo'>>): txnBuilder.Transaction;
/**
 * makeKeyRegistrationTxnWithSuggestedParams takes key registration arguments and returns a Transaction object for
 * that key registration operation
 *
 * @param from - string representation of Algorand address of sender
 * @param note - uint8array of arbitrary data for sender to store
 * @param voteKey - voting key. for key deregistration, leave undefined
 * @param selectionKey - selection key. for key deregistration, leave undefined
 * @param voteFirst - first round on which voteKey is valid
 * @param voteLast - last round on which voteKey is valid
 * @param voteKeyDilution - integer
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param rekeyTo - rekeyTo address, optional
 * @param nonParticipation - configure whether the address wants to stop participating. If true,
 *   voteKey, selectionKey, voteFirst, voteLast, and voteKeyDilution must be undefined.
 * @param stateProofKey - state proof key. for key deregistration, leave undefined
 */
export declare function makeKeyRegistrationTxnWithSuggestedParams(from: KeyRegistrationTxn['from'], note: KeyRegistrationTxn['note'], voteKey: KeyRegistrationTxn['voteKey'], selectionKey: KeyRegistrationTxn['selectionKey'], voteFirst: KeyRegistrationTxn['voteFirst'], voteLast: KeyRegistrationTxn['voteLast'], voteKeyDilution: KeyRegistrationTxn['voteKeyDilution'], suggestedParams: MustHaveSuggestedParams<KeyRegistrationTxn>['suggestedParams'], rekeyTo?: KeyRegistrationTxn['reKeyTo'], nonParticipation?: false, stateProofKey?: KeyRegistrationTxn['stateProofKey']): txnBuilder.Transaction;
export declare function makeKeyRegistrationTxnWithSuggestedParams(from: KeyRegistrationTxn['from'], note: KeyRegistrationTxn['note'], voteKey: undefined, selectionKey: undefined, voteFirst: undefined, voteLast: undefined, voteKeyDilution: undefined, suggestedParams: MustHaveSuggestedParams<KeyRegistrationTxn>['suggestedParams'], rekeyTo?: KeyRegistrationTxn['reKeyTo'], nonParticipation?: true, stateProofKey?: undefined): txnBuilder.Transaction;
/**
 * makeKeyRegistrationTxn takes key registration arguments and returns a Transaction object for
 * that key registration operation
 *
 * @param from - string representation of Algorand address of sender
 * @param fee - integer fee per byte, in microAlgos. for a flat fee, overwrite the fee property on the returned object
 *  If the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 * @param firstRound - integer first protocol round on which this txn is valid
 * @param lastRound - integer last protocol round on which this txn is valid
 * @param note - uint8array of arbitrary data for sender to store
 * @param genesisHash - string specifies hash genesis block of network in use
 * @param genesisID - string specifies genesis ID of network in use
 * @param voteKey - voting key. for key deregistration, leave undefined
 * @param selectionKey - selection key. for key deregistration, leave undefined
 * @param voteFirst - first round on which voteKey is valid
 * @param voteLast - last round on which voteKey is valid
 * @param voteKeyDilution - integer
 * @param rekeyTo - rekeyTo address, optional
 * @param nonParticipation - configure whether the address wants to stop participating. If true,
 *   voteKey, selectionKey, voteFirst, voteLast, and voteKeyDilution must be undefined.
 * @param stateProofKey - state proof key. for key deregistration, leave undefined
 * @Deprecated in version 2.0 this will change to use the "WithSuggestedParams" signature.
 */
export declare function makeKeyRegistrationTxn(from: KeyRegistrationTxn['from'], fee: MustHaveSuggestedParamsInline<KeyRegistrationTxn>['fee'], firstRound: MustHaveSuggestedParamsInline<KeyRegistrationTxn>['firstRound'], lastRound: MustHaveSuggestedParamsInline<KeyRegistrationTxn>['lastRound'], note: KeyRegistrationTxn['note'], genesisHash: MustHaveSuggestedParamsInline<KeyRegistrationTxn>['genesisHash'], genesisID: MustHaveSuggestedParamsInline<KeyRegistrationTxn>['genesisID'], voteKey: KeyRegistrationTxn['voteKey'], selectionKey: KeyRegistrationTxn['selectionKey'], voteFirst: KeyRegistrationTxn['voteFirst'], voteLast: KeyRegistrationTxn['voteLast'], voteKeyDilution: KeyRegistrationTxn['voteKeyDilution'], rekeyTo?: KeyRegistrationTxn['reKeyTo'], nonParticipation?: false, stateProofKey?: KeyRegistrationTxn['stateProofKey']): txnBuilder.Transaction;
export declare function makeKeyRegistrationTxn(from: KeyRegistrationTxn['from'], fee: MustHaveSuggestedParamsInline<KeyRegistrationTxn>['fee'], firstRound: MustHaveSuggestedParamsInline<KeyRegistrationTxn>['firstRound'], lastRound: MustHaveSuggestedParamsInline<KeyRegistrationTxn>['lastRound'], note: KeyRegistrationTxn['note'], genesisHash: MustHaveSuggestedParamsInline<KeyRegistrationTxn>['genesisHash'], genesisID: MustHaveSuggestedParamsInline<KeyRegistrationTxn>['genesisID'], voteKey: undefined, selectionKey: undefined, voteFirst: undefined, voteLast: undefined, voteKeyDilution: undefined, rekeyTo?: KeyRegistrationTxn['reKeyTo'], nonParticipation?: true, stateProofKey?: undefined): txnBuilder.Transaction;
export declare function makeKeyRegistrationTxnWithSuggestedParamsFromObject(o: Expand<Pick<RenameProperty<MustHaveSuggestedParams<KeyRegistrationTxn>, 'reKeyTo', 'rekeyTo'>, 'from' | 'note' | 'voteKey' | 'selectionKey' | 'stateProofKey' | 'voteFirst' | 'voteLast' | 'voteKeyDilution' | 'suggestedParams' | 'rekeyTo'> & {
    nonParticipation?: false;
}>): txnBuilder.Transaction;
export declare function makeKeyRegistrationTxnWithSuggestedParamsFromObject(o: Expand<Pick<RenameProperty<MustHaveSuggestedParams<KeyRegistrationTxn>, 'reKeyTo', 'rekeyTo'>, 'from' | 'note' | 'suggestedParams' | 'rekeyTo'> & {
    nonParticipation: true;
}>): txnBuilder.Transaction;
/** makeAssetCreateTxnWithSuggestedParams takes asset creation arguments and returns a Transaction object
 * for creating that asset
 *
 * @param from - string representation of Algorand address of sender
 * @param note - uint8array of arbitrary data for sender to store
 * @param total - integer total supply of the asset
 * @param decimals - integer number of decimals for asset unit calculation
 * @param defaultFrozen - boolean whether asset accounts should default to being frozen
 * @param manager - string representation of Algorand address in charge of reserve, freeze, clawback, destruction, etc
 * @param reserve - string representation of Algorand address representing asset reserve
 * @param freeze - string representation of Algorand address with power to freeze/unfreeze asset holdings
 * @param clawback - string representation of Algorand address with power to revoke asset holdings
 * @param unitName - string units name for this asset
 * @param assetName - string name for this asset
 * @param assetURL - string URL relating to this asset
 * @param assetMetadataHash - Uint8Array or UTF-8 string representation of a hash commitment with respect to the asset. Must be exactly 32 bytes long.
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param rekeyTo - rekeyTo address, optional
 */
export declare function makeAssetCreateTxnWithSuggestedParams(from: AssetCreateTxn['from'], note: AssetCreateTxn['note'], total: AssetCreateTxn['assetTotal'], decimals: AssetCreateTxn['assetDecimals'], defaultFrozen: AssetCreateTxn['assetDefaultFrozen'], manager: AssetCreateTxn['assetManager'], reserve: AssetCreateTxn['assetReserve'], freeze: AssetCreateTxn['assetFreeze'], clawback: AssetCreateTxn['assetClawback'], unitName: AssetCreateTxn['assetUnitName'], assetName: AssetCreateTxn['assetName'], assetURL: AssetCreateTxn['assetURL'], assetMetadataHash: AssetCreateTxn['assetMetadataHash'] | undefined, suggestedParams: MustHaveSuggestedParams<AssetCreateTxn>['suggestedParams'], rekeyTo?: AssetCreateTxn['reKeyTo']): txnBuilder.Transaction;
/** makeAssetCreateTxn takes asset creation arguments and returns a Transaction object
 * for creating that asset
 *
 * @param from - string representation of Algorand address of sender
 * @param fee - integer fee per byte, in microAlgos. for a flat fee, overwrite the fee property on the returned object
 *  If the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 * @param firstRound - integer first protocol round on which this txn is valid
 * @param lastRound - integer last protocol round on which this txn is valid
 * @param note - uint8array of arbitrary data for sender to store
 * @param genesisHash - string specifies hash genesis block of network in use
 * @param genesisID - string specifies genesis ID of network in use
 * @param total - integer total supply of the asset
 * @param decimals - integer number of decimals for asset unit calculation
 * @param defaultFrozen - boolean whether asset accounts should default to being frozen
 * @param manager - string representation of Algorand address in charge of reserve, freeze, clawback, destruction, etc
 * @param reserve - string representation of Algorand address representing asset reserve
 * @param freeze - string representation of Algorand address with power to freeze/unfreeze asset holdings
 * @param clawback - string representation of Algorand address with power to revoke asset holdings
 * @param unitName - string units name for this asset
 * @param assetName - string name for this asset
 * @param assetURL - string URL relating to this asset
 * @param assetMetadataHash - Uint8Array or UTF-8 string representation of a hash commitment with respect to the asset. Must be exactly 32 bytes long.
 * @param rekeyTo - rekeyTo address, optional
 * @Deprecated in version 2.0 this will change to use the "WithSuggestedParams" signature.
 */
export declare function makeAssetCreateTxn(from: AssetCreateTxn['from'], fee: MustHaveSuggestedParamsInline<AssetCreateTxn>['fee'], firstRound: MustHaveSuggestedParamsInline<AssetCreateTxn>['firstRound'], lastRound: MustHaveSuggestedParamsInline<AssetCreateTxn>['lastRound'], note: AssetCreateTxn['note'], genesisHash: MustHaveSuggestedParamsInline<AssetCreateTxn>['genesisHash'], genesisID: MustHaveSuggestedParamsInline<AssetCreateTxn>['genesisID'], total: AssetCreateTxn['assetTotal'], decimals: AssetCreateTxn['assetDecimals'], defaultFrozen: AssetCreateTxn['assetDefaultFrozen'], manager: AssetCreateTxn['assetManager'], reserve: AssetCreateTxn['assetManager'], freeze: AssetCreateTxn['assetFreeze'], clawback: AssetCreateTxn['assetClawback'], unitName: AssetCreateTxn['assetUnitName'], assetName: AssetCreateTxn['assetName'], assetURL: AssetCreateTxn['assetURL'], assetMetadataHash?: AssetCreateTxn['assetMetadataHash'], rekeyTo?: AssetCreateTxn['reKeyTo']): txnBuilder.Transaction;
export declare function makeAssetCreateTxnWithSuggestedParamsFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AssetCreateTxn>, {
    reKeyTo: 'rekeyTo';
    assetTotal: 'total';
    assetDecimals: 'decimals';
    assetDefaultFrozen: 'defaultFrozen';
    assetManager: 'manager';
    assetReserve: 'reserve';
    assetFreeze: 'freeze';
    assetClawback: 'clawback';
    assetUnitName: 'unitName';
}>, 'from' | 'note' | 'total' | 'decimals' | 'defaultFrozen' | 'manager' | 'reserve' | 'freeze' | 'clawback' | 'unitName' | 'assetName' | 'assetURL' | 'assetMetadataHash' | 'suggestedParams' | 'rekeyTo'>>): txnBuilder.Transaction;
/** makeAssetConfigTxnWithSuggestedParams can be issued by the asset manager to change the manager, reserve, freeze, or clawback
 * you must respecify existing addresses to keep them the same; leaving a field blank is the same as turning
 * that feature off for this asset
 *
 * @param from - string representation of Algorand address of sender
 * @param note - uint8array of arbitrary data for sender to store
 * @param assetIndex - int asset index uniquely specifying the asset
 * @param manager - string representation of new asset manager Algorand address
 * @param reserve - string representation of new reserve Algorand address
 * @param freeze - string representation of new freeze manager Algorand address
 * @param clawback - string representation of new revocation manager Algorand address
 * @param strictEmptyAddressChecking - boolean - throw an error if any of manager, reserve, freeze, or clawback are undefined. optional, defaults to true.
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param rekeyTo - rekeyTo address, optional
 */
export declare function makeAssetConfigTxnWithSuggestedParams(from: AssetConfigTxn['from'], note: AssetConfigTxn['note'], assetIndex: AssetConfigTxn['assetIndex'], manager: AssetConfigTxn['assetManager'], reserve: AssetConfigTxn['assetReserve'], freeze: AssetConfigTxn['assetFreeze'], clawback: AssetConfigTxn['assetClawback'], suggestedParams: MustHaveSuggestedParams<AssetConfigTxn>['suggestedParams'], strictEmptyAddressChecking?: boolean, rekeyTo?: AssetConfigTxn['reKeyTo']): txnBuilder.Transaction;
/** makeAssetConfigTxn can be issued by the asset manager to change the manager, reserve, freeze, or clawback
 * you must respecify existing addresses to keep them the same; leaving a field blank is the same as turning
 * that feature off for this asset
 *
 * @param from - string representation of Algorand address of sender
 * @param fee - integer fee per byte, in microAlgos. for a flat fee, overwrite the fee property on the returned object
 *  If the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 * @param firstRound - integer first protocol round on which this txn is valid
 * @param lastRound - integer last protocol round on which this txn is valid
 * @param note - uint8array of arbitrary data for sender to store
 * @param genesisHash - string specifies hash genesis block of network in use
 * @param genesisID - string specifies genesis ID of network in use
 * @param assetIndex - int asset index uniquely specifying the asset
 * @param manager - string representation of new asset manager Algorand address
 * @param reserve - string representation of new reserve Algorand address
 * @param freeze - string representation of new freeze manager Algorand address
 * @param clawback - string representation of new revocation manager Algorand address
 * @param strictEmptyAddressChecking - boolean - throw an error if any of manager, reserve, freeze, or clawback are undefined. optional, defaults to true.
 * @param rekeyTo - rekeyTo address, optional
 * @Deprecated in version 2.0 this will change to use the "WithSuggestedParams" signature.
 */
export declare function makeAssetConfigTxn(from: AssetConfigTxn['from'], fee: MustHaveSuggestedParamsInline<AssetConfigTxn>['fee'], firstRound: MustHaveSuggestedParamsInline<AssetConfigTxn>['firstRound'], lastRound: MustHaveSuggestedParamsInline<AssetConfigTxn>['lastRound'], note: AssetConfigTxn['note'], genesisHash: MustHaveSuggestedParamsInline<AssetConfigTxn>['genesisHash'], genesisID: MustHaveSuggestedParamsInline<AssetConfigTxn>['genesisID'], assetIndex: AssetConfigTxn['assetIndex'], manager: AssetConfigTxn['assetManager'], reserve: AssetConfigTxn['assetReserve'], freeze: AssetConfigTxn['assetFreeze'], clawback: AssetConfigTxn['assetClawback'], strictEmptyAddressChecking?: boolean, rekeyTo?: AssetConfigTxn['reKeyTo']): txnBuilder.Transaction;
export declare function makeAssetConfigTxnWithSuggestedParamsFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AssetConfigTxn>, {
    reKeyTo: 'rekeyTo';
    assetManager: 'manager';
    assetReserve: 'reserve';
    assetFreeze: 'freeze';
    assetClawback: 'clawback';
}>, 'from' | 'note' | 'assetIndex' | 'manager' | 'reserve' | 'freeze' | 'clawback' | 'suggestedParams' | 'rekeyTo'> & {
    strictEmptyAddressChecking: boolean;
}>): txnBuilder.Transaction;
/** makeAssetDestroyTxnWithSuggestedParams will allow the asset's manager to remove this asset from the ledger, so long
 * as all outstanding assets are held by the creator.
 *
 * @param from - string representation of Algorand address of sender
 * @param note - uint8array of arbitrary data for sender to store
 * @param assetIndex - int asset index uniquely specifying the asset
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param rekeyTo - rekeyTo address, optional
 */
export declare function makeAssetDestroyTxnWithSuggestedParams(from: AssetDestroyTxn['from'], note: AssetDestroyTxn['note'], assetIndex: AssetDestroyTxn['assetIndex'], suggestedParams: MustHaveSuggestedParams<AssetDestroyTxn>['suggestedParams'], rekeyTo?: AssetDestroyTxn['reKeyTo']): txnBuilder.Transaction;
/** makeAssetDestroyTxn will allow the asset's manager to remove this asset from the ledger, so long
 * as all outstanding assets are held by the creator.
 *
 * @param from - string representation of Algorand address of sender
 * @param fee - integer fee per byte, in microAlgos. for a flat fee, overwrite the fee property on the returned object
 *  If the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 * @param firstRound - integer first protocol round on which this txn is valid
 * @param lastRound - integer last protocol round on which this txn is valid
 * @param note - uint8array of arbitrary data for sender to store
 * @param genesisHash - string specifies hash genesis block of network in use
 * @param genesisID - string specifies genesis ID of network in use
 * @param assetIndex - int asset index uniquely specifying the asset
 * @param rekeyTo - rekeyTo address, optional
 * @Deprecated in version 2.0 this will change to use the "WithSuggestedParams" signature.
 */
export declare function makeAssetDestroyTxn(from: AssetDestroyTxn['from'], fee: MustHaveSuggestedParamsInline<AssetDestroyTxn>['fee'], firstRound: MustHaveSuggestedParamsInline<AssetDestroyTxn>['firstRound'], lastRound: MustHaveSuggestedParamsInline<AssetDestroyTxn>['lastRound'], note: AssetDestroyTxn['note'], genesisHash: MustHaveSuggestedParamsInline<AssetDestroyTxn>['genesisHash'], genesisID: MustHaveSuggestedParamsInline<AssetDestroyTxn>['genesisID'], assetIndex: AssetDestroyTxn['assetIndex'], rekeyTo?: AssetDestroyTxn['reKeyTo']): txnBuilder.Transaction;
export declare function makeAssetDestroyTxnWithSuggestedParamsFromObject(o: Expand<Pick<RenameProperty<MustHaveSuggestedParams<AssetDestroyTxn>, 'reKeyTo', 'rekeyTo'>, 'from' | 'note' | 'assetIndex' | 'suggestedParams' | 'rekeyTo'>>): txnBuilder.Transaction;
/** makeAssetFreezeTxnWithSuggestedParams will allow the asset's freeze manager to freeze or un-freeze an account,
 * blocking or allowing asset transfers to and from the targeted account.
 *
 * @param from - string representation of Algorand address of sender
 * @param note - uint8array of arbitrary data for sender to store
 * @param assetIndex - int asset index uniquely specifying the asset
 * @param freezeTarget - string representation of Algorand address being frozen or unfrozen
 * @param freezeState - true if freezeTarget should be frozen, false if freezeTarget should be allowed to transact
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param rekeyTo - rekeyTo address, optional
 */
export declare function makeAssetFreezeTxnWithSuggestedParams(from: AssetFreezeTxn['from'], note: AssetFreezeTxn['note'], assetIndex: AssetFreezeTxn['assetIndex'], freezeTarget: AssetFreezeTxn['freezeAccount'], freezeState: AssetFreezeTxn['freezeState'], suggestedParams: MustHaveSuggestedParams<AssetFreezeTxn>['suggestedParams'], rekeyTo?: AssetFreezeTxn['reKeyTo']): txnBuilder.Transaction;
/** makeAssetFreezeTxn will allow the asset's freeze manager to freeze or un-freeze an account,
 * blocking or allowing asset transfers to and from the targeted account.
 *
 * @param from - string representation of Algorand address of sender
 * @param fee - integer fee per byte, in microAlgos. for a flat fee, overwrite the fee property on the returned object
 *  If the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 * @param firstRound - integer first protocol round on which this txn is valid
 * @param lastRound - integer last protocol round on which this txn is valid
 * @param note - uint8array of arbitrary data for sender to store
 * @param genesisHash - string specifies hash genesis block of network in use
 * @param genesisID - string specifies genesis ID of network in use
 * @param assetIndex - int asset index uniquely specifying the asset
 * @param freezeTarget - string representation of Algorand address being frozen or unfrozen
 * @param freezeState - true if freezeTarget should be frozen, false if freezeTarget should be allowed to transact
 * @param rekeyTo - rekeyTo address, optional
 * @Deprecated in version 2.0 this will change to use the "WithSuggestedParams" signature.
 */
export declare function makeAssetFreezeTxn(from: AssetFreezeTxn['from'], fee: MustHaveSuggestedParamsInline<AssetFreezeTxn>['fee'], firstRound: MustHaveSuggestedParamsInline<AssetFreezeTxn>['firstRound'], lastRound: MustHaveSuggestedParamsInline<AssetFreezeTxn>['lastRound'], note: MustHaveSuggestedParamsInline<AssetFreezeTxn>['note'], genesisHash: MustHaveSuggestedParamsInline<AssetFreezeTxn>['genesisHash'], genesisID: MustHaveSuggestedParamsInline<AssetFreezeTxn>['genesisID'], assetIndex: AssetFreezeTxn['assetIndex'], freezeTarget: AssetFreezeTxn['freezeAccount'], freezeState: AssetFreezeTxn['freezeState'], rekeyTo?: AssetFreezeTxn['reKeyTo']): txnBuilder.Transaction;
export declare function makeAssetFreezeTxnWithSuggestedParamsFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AssetFreezeTxn>, {
    freezeAccount: 'freezeTarget';
    reKeyTo: 'rekeyTo';
}>, 'from' | 'note' | 'assetIndex' | 'freezeTarget' | 'freezeState' | 'suggestedParams' | 'rekeyTo'>>): txnBuilder.Transaction;
/** makeAssetTransferTxnWithSuggestedParams allows for the creation of an asset transfer transaction.
 * Special case: to begin accepting assets, set amount=0 and from=to.
 *
 * @param from - string representation of Algorand address of sender
 * @param to - string representation of Algorand address of asset recipient
 * @param closeRemainderTo - optional - string representation of Algorand address - if provided,
 * send all remaining assets after transfer to the "closeRemainderTo" address and close "from"'s asset holdings
 * @param revocationTarget - optional - string representation of Algorand address - if provided,
 * and if "from" is the asset's revocation manager, then deduct from "revocationTarget" rather than "from"
 * @param amount - integer amount of assets to send
 * @param note - uint8array of arbitrary data for sender to store
 * @param assetIndex - int asset index uniquely specifying the asset
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param rekeyTo - rekeyTo address, optional
 */
export declare function makeAssetTransferTxnWithSuggestedParams(from: AssetTransferTxn['from'], to: AssetTransferTxn['to'], closeRemainderTo: AssetTransferTxn['closeRemainderTo'], revocationTarget: AssetTransferTxn['assetRevocationTarget'], amount: AssetTransferTxn['amount'], note: AssetTransferTxn['note'], assetIndex: AssetTransferTxn['assetIndex'], suggestedParams: MustHaveSuggestedParams<AssetTransferTxn>['suggestedParams'], rekeyTo?: AssetTransferTxn['reKeyTo']): txnBuilder.Transaction;
/** makeAssetTransferTxn allows for the creation of an asset transfer transaction.
 * Special case: to begin accepting assets, set amount=0 and from=to.
 *
 * @param from - string representation of Algorand address of sender
 * @param to - string representation of Algorand address of asset recipient
 * @param closeRemainderTo - optional - string representation of Algorand address - if provided,
 * send all remaining assets after transfer to the "closeRemainderTo" address and close "from"'s asset holdings
 * @param revocationTarget - optional - string representation of Algorand address - if provided,
 * and if "from" is the asset's revocation manager, then deduct from "revocationTarget" rather than "from"
 * @param fee - integer fee per byte, in microAlgos. for a flat fee, overwrite the fee property on the returned object
 *  If the final calculated fee is lower than the protocol minimum fee, the fee will be increased to match the minimum.
 * @param amount - integer amount of assets to send
 * @param firstRound - integer first protocol round on which this txn is valid
 * @param lastRound - integer last protocol round on which this txn is valid
 * @param note - uint8array of arbitrary data for sender to store
 * @param genesisHash - string specifies hash genesis block of network in use
 * @param genesisID - string specifies genesis ID of network in use
 * @param assetIndex - int asset index uniquely specifying the asset
 * @param rekeyTo - rekeyTo address, optional
 * @Deprecated in version 2.0 this will change to use the "WithSuggestedParams" signature.
 */
export declare function makeAssetTransferTxn(from: AssetTransferTxn['from'], to: AssetTransferTxn['to'], closeRemainderTo: AssetTransferTxn['closeRemainderTo'], revocationTarget: AssetTransferTxn['assetRevocationTarget'], fee: MustHaveSuggestedParamsInline<AssetTransferTxn>['fee'], amount: AssetTransferTxn['amount'], firstRound: MustHaveSuggestedParamsInline<AssetTransferTxn>['firstRound'], lastRound: MustHaveSuggestedParamsInline<AssetTransferTxn>['lastRound'], note: AssetTransferTxn['note'], genesisHash: MustHaveSuggestedParamsInline<AssetTransferTxn>['genesisHash'], genesisID: MustHaveSuggestedParamsInline<AssetTransferTxn>['genesisID'], assetIndex: AssetTransferTxn['assetIndex'], rekeyTo?: AssetTransferTxn['reKeyTo']): txnBuilder.Transaction;
export declare function makeAssetTransferTxnWithSuggestedParamsFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AssetTransferTxn>, {
    assetRevocationTarget: 'revocationTarget';
    reKeyTo: 'rekeyTo';
}>, 'from' | 'to' | 'closeRemainderTo' | 'revocationTarget' | 'amount' | 'note' | 'assetIndex' | 'suggestedParams' | 'rekeyTo'>>): txnBuilder.Transaction;
/**
 * Make a transaction that will create an application.
 * @param from - address of sender
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param onComplete - algosdk.OnApplicationComplete, what application should do once the program is done being run
 * @param approvalProgram - Uint8Array, the compiled TEAL that approves a transaction
 * @param clearProgram - Uint8Array, the compiled TEAL that runs when clearing state
 * @param numLocalInts - restricts number of ints in per-user local state
 * @param numLocalByteSlices - restricts number of byte slices in per-user local state
 * @param numGlobalInts - restricts number of ints in global state
 * @param numGlobalByteSlices - restricts number of byte slices in global state
 * @param appArgs - Array of Uint8Array, any additional arguments to the application
 * @param accounts - Array of Address strings, any additional accounts to supply to the application
 * @param foreignApps - Array of int, any other apps used by the application, identified by index
 * @param foreignAssets - Array of int, any assets used by the application, identified by index
 * @param note - Arbitrary data for sender to store
 * @param lease - Lease a transaction
 * @param rekeyTo - String representation of the Algorand address that will be used to authorize all future transactions
 * @param extraPages - integer extra pages of memory to rent on creation of application
 * @param boxes - Array of BoxReference, app ID and name of box to be accessed
 */
export declare function makeApplicationCreateTxn(from: AppCreateTxn['from'], suggestedParams: MustHaveSuggestedParams<AppCreateTxn>['suggestedParams'], onComplete: AppCreateTxn['appOnComplete'], approvalProgram: AppCreateTxn['appApprovalProgram'], clearProgram: AppCreateTxn['appClearProgram'], numLocalInts: AppCreateTxn['appLocalInts'], numLocalByteSlices: AppCreateTxn['appLocalByteSlices'], numGlobalInts: AppCreateTxn['appGlobalInts'], numGlobalByteSlices: AppCreateTxn['appGlobalByteSlices'], appArgs?: AppCreateTxn['appArgs'], accounts?: AppCreateTxn['appAccounts'], foreignApps?: AppCreateTxn['appForeignApps'], foreignAssets?: AppCreateTxn['appForeignAssets'], note?: AppCreateTxn['note'], lease?: AppCreateTxn['lease'], rekeyTo?: AppCreateTxn['reKeyTo'], extraPages?: AppCreateTxn['extraPages'], boxes?: AppCreateTxn['boxes']): txnBuilder.Transaction;
export declare function makeApplicationCreateTxnFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AppCreateTxn>, {
    appOnComplete: 'onComplete';
    appApprovalProgram: 'approvalProgram';
    appClearProgram: 'clearProgram';
    appLocalInts: 'numLocalInts';
    appLocalByteSlices: 'numLocalByteSlices';
    appGlobalInts: 'numGlobalInts';
    appGlobalByteSlices: 'numGlobalByteSlices';
    appAccounts: 'accounts';
    appForeignApps: 'foreignApps';
    appForeignAssets: 'foreignAssets';
    reKeyTo: 'rekeyTo';
}>, 'from' | 'suggestedParams' | 'onComplete' | 'approvalProgram' | 'clearProgram' | 'numLocalInts' | 'numLocalByteSlices' | 'numGlobalInts' | 'numGlobalByteSlices' | 'appArgs' | 'accounts' | 'foreignApps' | 'foreignAssets' | 'boxes' | 'note' | 'lease' | 'rekeyTo' | 'extraPages'>>): txnBuilder.Transaction;
/**
 * Make a transaction that changes an application's approval and clear programs
 * @param from - address of sender
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param appIndex - the ID of the app to be updated
 * @param approvalProgram - Uint8Array, the compiled TEAL that approves a transaction
 * @param clearProgram - Uint8Array, the compiled TEAL that runs when clearing state
 * @param appArgs - Array of Uint8Array, any additional arguments to the application
 * @param accounts - Array of Address strings, any additional accounts to supply to the application
 * @param foreignApps - Array of int, any other apps used by the application, identified by index
 * @param foreignAssets - Array of int, any assets used by the application, identified by index
 * @param note - Arbitrary data for sender to store
 * @param lease - Lease a transaction
 * @param rekeyTo - String representation of the Algorand address that will be used to authorize all future transactions
 * @param boxes - Array of BoxReference, app ID and name of box to be accessed
 */
export declare function makeApplicationUpdateTxn(from: AppUpdateTxn['from'], suggestedParams: MustHaveSuggestedParams<AppUpdateTxn>['suggestedParams'], appIndex: AppUpdateTxn['appIndex'], approvalProgram: AppUpdateTxn['appApprovalProgram'], clearProgram: AppUpdateTxn['appClearProgram'], appArgs?: AppUpdateTxn['appArgs'], accounts?: AppUpdateTxn['appAccounts'], foreignApps?: AppUpdateTxn['appForeignApps'], foreignAssets?: AppUpdateTxn['appForeignAssets'], note?: AppUpdateTxn['note'], lease?: AppUpdateTxn['lease'], rekeyTo?: AppUpdateTxn['reKeyTo'], boxes?: AppUpdateTxn['boxes']): txnBuilder.Transaction;
export declare function makeApplicationUpdateTxnFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AppUpdateTxn>, {
    appApprovalProgram: 'approvalProgram';
    appClearProgram: 'clearProgram';
    appAccounts: 'accounts';
    appForeignApps: 'foreignApps';
    appForeignAssets: 'foreignAssets';
    reKeyTo: 'rekeyTo';
}>, 'from' | 'suggestedParams' | 'appIndex' | 'approvalProgram' | 'clearProgram' | 'appArgs' | 'accounts' | 'foreignApps' | 'foreignAssets' | 'boxes' | 'note' | 'lease' | 'rekeyTo'>>): txnBuilder.Transaction;
/**
 * Make a transaction that deletes an application
 * @param from - address of sender
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param appIndex - the ID of the app to be deleted
 * @param appArgs - Array of Uint8Array, any additional arguments to the application
 * @param accounts - Array of Address strings, any additional accounts to supply to the application
 * @param foreignApps - Array of int, any other apps used by the application, identified by index
 * @param foreignAssets - Array of int, any assets used by the application, identified by index
 * @param note - Arbitrary data for sender to store
 * @param lease - Lease a transaction
 * @param rekeyTo - String representation of the Algorand address that will be used to authorize all future transactions
 * @param boxes - Array of BoxReference, app ID and name of box to be accessed
 */
export declare function makeApplicationDeleteTxn(from: AppDeleteTxn['from'], suggestedParams: MustHaveSuggestedParams<AppDeleteTxn>['suggestedParams'], appIndex: AppDeleteTxn['appIndex'], appArgs?: AppDeleteTxn['appArgs'], accounts?: AppDeleteTxn['appAccounts'], foreignApps?: AppDeleteTxn['appForeignApps'], foreignAssets?: AppDeleteTxn['appForeignAssets'], note?: AppDeleteTxn['note'], lease?: AppDeleteTxn['lease'], rekeyTo?: AppDeleteTxn['reKeyTo'], boxes?: AppDeleteTxn['boxes']): txnBuilder.Transaction;
export declare function makeApplicationDeleteTxnFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AppDeleteTxn>, {
    appAccounts: 'accounts';
    appForeignApps: 'foreignApps';
    appForeignAssets: 'foreignAssets';
    reKeyTo: 'rekeyTo';
}>, 'from' | 'suggestedParams' | 'appIndex' | 'appArgs' | 'accounts' | 'foreignApps' | 'foreignAssets' | 'boxes' | 'note' | 'lease' | 'rekeyTo'>>): txnBuilder.Transaction;
/**
 * Make a transaction that opts in to use an application
 * @param from - address of sender
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param appIndex - the ID of the app to join
 * @param appArgs - Array of Uint8Array, any additional arguments to the application
 * @param accounts - Array of Address strings, any additional accounts to supply to the application
 * @param foreignApps - Array of int, any other apps used by the application, identified by index
 * @param foreignAssets - Array of int, any assets used by the application, identified by index
 * @param note - Arbitrary data for sender to store
 * @param lease - Lease a transaction
 * @param rekeyTo - String representation of the Algorand address that will be used to authorize all future transactions
 * @param boxes - Array of BoxReference, app ID and name of box to be accessed
 */
export declare function makeApplicationOptInTxn(from: AppOptInTxn['from'], suggestedParams: MustHaveSuggestedParams<AppOptInTxn>['suggestedParams'], appIndex: AppOptInTxn['appIndex'], appArgs?: AppOptInTxn['appArgs'], accounts?: AppOptInTxn['appAccounts'], foreignApps?: AppOptInTxn['appForeignApps'], foreignAssets?: AppOptInTxn['appForeignAssets'], note?: AppOptInTxn['note'], lease?: AppOptInTxn['lease'], rekeyTo?: AppOptInTxn['reKeyTo'], boxes?: AppOptInTxn['boxes']): txnBuilder.Transaction;
export declare function makeApplicationOptInTxnFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AppOptInTxn>, {
    appAccounts: 'accounts';
    appForeignApps: 'foreignApps';
    appForeignAssets: 'foreignAssets';
    reKeyTo: 'rekeyTo';
}>, 'from' | 'suggestedParams' | 'appIndex' | 'appArgs' | 'accounts' | 'foreignApps' | 'foreignAssets' | 'boxes' | 'note' | 'lease' | 'rekeyTo'>>): txnBuilder.Transaction;
/**
 * Make a transaction that closes out a user's state in an application
 * @param from - address of sender
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param appIndex - the ID of the app to use
 * @param appArgs - Array of Uint8Array, any additional arguments to the application
 * @param accounts - Array of Address strings, any additional accounts to supply to the application
 * @param foreignApps - Array of int, any other apps used by the application, identified by index
 * @param foreignAssets - Array of int, any assets used by the application, identified by index
 * @param note - Arbitrary data for sender to store
 * @param lease - Lease a transaction
 * @param rekeyTo - String representation of the Algorand address that will be used to authorize all future transactions
 * @param boxes - Array of BoxReference, app ID and name of box to be accessed
 */
export declare function makeApplicationCloseOutTxn(from: AppCloseOutTxn['from'], suggestedParams: MustHaveSuggestedParams<AppCloseOutTxn>['suggestedParams'], appIndex: AppCloseOutTxn['appIndex'], appArgs?: AppCloseOutTxn['appArgs'], accounts?: AppCloseOutTxn['appAccounts'], foreignApps?: AppCloseOutTxn['appForeignApps'], foreignAssets?: AppCloseOutTxn['appForeignAssets'], note?: AppCloseOutTxn['note'], lease?: AppCloseOutTxn['lease'], rekeyTo?: AppCloseOutTxn['reKeyTo'], boxes?: AppCloseOutTxn['boxes']): txnBuilder.Transaction;
export declare function makeApplicationCloseOutTxnFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AppOptInTxn>, {
    appAccounts: 'accounts';
    appForeignApps: 'foreignApps';
    appForeignAssets: 'foreignAssets';
    reKeyTo: 'rekeyTo';
}>, 'from' | 'suggestedParams' | 'appIndex' | 'appArgs' | 'accounts' | 'foreignApps' | 'foreignAssets' | 'boxes' | 'note' | 'lease' | 'rekeyTo'>>): txnBuilder.Transaction;
/**
 * Make a transaction that clears a user's state in an application
 * @param from - address of sender
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param appIndex - the ID of the app to use
 * @param appArgs - Array of Uint8Array, any additional arguments to the application
 * @param accounts - Array of Address strings, any additional accounts to supply to the application
 * @param foreignApps - Array of int, any other apps used by the application, identified by index
 * @param foreignAssets - Array of int, any assets used by the application, identified by index
 * @param note - Arbitrary data for sender to store
 * @param lease - Lease a transaction
 * @param rekeyTo - String representation of the Algorand address that will be used to authorize all future transactions
 * @param boxes - Array of BoxReference, app ID and name of box to be accessed
 */
export declare function makeApplicationClearStateTxn(from: AppClearStateTxn['from'], suggestedParams: MustHaveSuggestedParams<AppClearStateTxn>['suggestedParams'], appIndex: AppClearStateTxn['appIndex'], appArgs?: AppClearStateTxn['appArgs'], accounts?: AppClearStateTxn['appAccounts'], foreignApps?: AppClearStateTxn['appForeignApps'], foreignAssets?: AppClearStateTxn['appForeignAssets'], note?: AppClearStateTxn['note'], lease?: AppClearStateTxn['lease'], rekeyTo?: AppClearStateTxn['reKeyTo'], boxes?: AppClearStateTxn['boxes']): txnBuilder.Transaction;
export declare function makeApplicationClearStateTxnFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AppOptInTxn>, {
    appAccounts: 'accounts';
    appForeignApps: 'foreignApps';
    appForeignAssets: 'foreignAssets';
    reKeyTo: 'rekeyTo';
}>, 'from' | 'suggestedParams' | 'appIndex' | 'appArgs' | 'accounts' | 'foreignApps' | 'foreignAssets' | 'boxes' | 'note' | 'lease' | 'rekeyTo'>>): txnBuilder.Transaction;
/**
 * Make a transaction that just calls an application, doing nothing on completion
 * @param from - address of sender
 * @param suggestedParams - a dict holding common-to-all-txns args:
 * fee - integer fee per byte, in microAlgos. for a flat fee, set flatFee to true
 * flatFee - bool optionally set this to true to specify fee as microalgos-per-txn
 *       If true, txn fee may fall below the ALGORAND_MIN_TX_FEE
 * firstRound - integer first protocol round on which this txn is valid
 * lastRound - integer last protocol round on which this txn is valid
 * genesisHash - string specifies hash genesis block of network in use
 * genesisID - string specifies genesis ID of network in use
 * @param appIndex - the ID of the app to use
 * @param appArgs - Array of Uint8Array, any additional arguments to the application
 * @param accounts - Array of Address strings, any additional accounts to supply to the application
 * @param foreignApps - Array of int, any other apps used by the application, identified by index
 * @param foreignAssets - Array of int, any assets used by the application, identified by index
 * @param note - Arbitrary data for sender to store
 * @param lease - Lease a transaction
 * @param rekeyTo - String representation of the Algorand address that will be used to authorize all future transactions
 * @param boxes - Array of BoxReference, app ID and name of box to be accessed
 */
export declare function makeApplicationNoOpTxn(from: AppNoOpTxn['from'], suggestedParams: MustHaveSuggestedParams<AppNoOpTxn>['suggestedParams'], appIndex: AppNoOpTxn['appIndex'], appArgs?: AppNoOpTxn['appArgs'], accounts?: AppNoOpTxn['appAccounts'], foreignApps?: AppNoOpTxn['appForeignApps'], foreignAssets?: AppNoOpTxn['appForeignAssets'], note?: AppNoOpTxn['note'], lease?: AppNoOpTxn['lease'], rekeyTo?: AppNoOpTxn['reKeyTo'], boxes?: AppNoOpTxn['boxes']): txnBuilder.Transaction;
export declare function makeApplicationNoOpTxnFromObject(o: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AppOptInTxn>, {
    appAccounts: 'accounts';
    appForeignApps: 'foreignApps';
    appForeignAssets: 'foreignAssets';
    reKeyTo: 'rekeyTo';
}>, 'from' | 'suggestedParams' | 'appIndex' | 'appArgs' | 'accounts' | 'foreignApps' | 'foreignAssets' | 'boxes' | 'note' | 'lease' | 'rekeyTo'>>): txnBuilder.Transaction;
export { OnApplicationComplete } from './types/transactions/base';
/**
 * Generic function for creating any application call transaction.
 */
export declare function makeApplicationCallTxnFromObject(options: Expand<Pick<RenameProperties<MustHaveSuggestedParams<AppCreateTxn>, {
    appOnComplete: 'onComplete';
    appAccounts: 'accounts';
    appForeignApps: 'foreignApps';
    appForeignAssets: 'foreignAssets';
    reKeyTo: 'rekeyTo';
}>, 'from' | 'suggestedParams' | 'appIndex' | 'onComplete' | 'appArgs' | 'accounts' | 'foreignApps' | 'foreignAssets' | 'boxes' | 'note' | 'lease' | 'rekeyTo' | 'extraPages'> & Partial<Pick<RenameProperties<MustHaveSuggestedParams<AppCreateTxn>, {
    appApprovalProgram: 'approvalProgram';
    appClearProgram: 'clearProgram';
    appLocalInts: 'numLocalInts';
    appLocalByteSlices: 'numLocalByteSlices';
    appGlobalInts: 'numGlobalInts';
    appGlobalByteSlices: 'numGlobalByteSlices';
}>, 'approvalProgram' | 'clearProgram' | 'numLocalInts' | 'numLocalByteSlices' | 'numGlobalInts' | 'numGlobalByteSlices'>>>): txnBuilder.Transaction;
