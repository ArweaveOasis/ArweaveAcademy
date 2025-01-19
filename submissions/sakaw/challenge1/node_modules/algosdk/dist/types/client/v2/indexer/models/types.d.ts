/**
 * NOTICE: This file was generated. Editing this file manually is not recommended.
 */
import BaseModel from '../../basemodel';
/**
 * Account information at a given round.
 * Definition:
 * data/basics/userBalance.go : AccountData
 */
export declare class Account extends BaseModel {
    /**
     * the account public key
     */
    address: string;
    /**
     * (algo) total number of MicroAlgos in the account
     */
    amount: number | bigint;
    /**
     * specifies the amount of MicroAlgos in the account, without the pending rewards.
     */
    amountWithoutPendingRewards: number | bigint;
    /**
     * amount of MicroAlgos of pending rewards in this account.
     */
    pendingRewards: number | bigint;
    /**
     * (ern) total rewards of MicroAlgos the account has received, including pending
     * rewards.
     */
    rewards: number | bigint;
    /**
     * The round for which this information is relevant.
     */
    round: number | bigint;
    /**
     * (onl) delegation status of the account's MicroAlgos
     * * Offline - indicates that the associated account is delegated.
     * * Online - indicates that the associated account used as part of the delegation
     * pool.
     * * NotParticipating - indicates that the associated account is neither a
     * delegator nor a delegate.
     */
    status: string;
    /**
     * The count of all applications that have been opted in, equivalent to the count
     * of application local data (AppLocalState objects) stored in this account.
     */
    totalAppsOptedIn: number | bigint;
    /**
     * The count of all assets that have been opted in, equivalent to the count of
     * AssetHolding objects held by this account.
     */
    totalAssetsOptedIn: number | bigint;
    /**
     * For app-accounts only. The total number of bytes allocated for the keys and
     * values of boxes which belong to the associated application.
     */
    totalBoxBytes: number | bigint;
    /**
     * For app-accounts only. The total number of boxes which belong to the associated
     * application.
     */
    totalBoxes: number | bigint;
    /**
     * The count of all apps (AppParams objects) created by this account.
     */
    totalCreatedApps: number | bigint;
    /**
     * The count of all assets (AssetParams objects) created by this account.
     */
    totalCreatedAssets: number | bigint;
    /**
     * (appl) applications local data stored in this account.
     * Note the raw object uses `map[int] -> AppLocalState` for this type.
     */
    appsLocalState?: ApplicationLocalState[];
    /**
     * (teap) the sum of all extra application program pages for this account.
     */
    appsTotalExtraPages?: number | bigint;
    /**
     * (tsch) stores the sum of all of the local schemas and global schemas in this
     * account.
     * Note: the raw account uses `StateSchema` for this type.
     */
    appsTotalSchema?: ApplicationStateSchema;
    /**
     * (asset) assets held by this account.
     * Note the raw object uses `map[int] -> AssetHolding` for this type.
     */
    assets?: AssetHolding[];
    /**
     * (spend) the address against which signing should be checked. If empty, the
     * address of the current account is used. This field can be updated in any
     * transaction by setting the RekeyTo field.
     */
    authAddr?: string;
    /**
     * Round during which this account was most recently closed.
     */
    closedAtRound?: number | bigint;
    /**
     * (appp) parameters of applications created by this account including app global
     * data.
     * Note: the raw account uses `map[int] -> AppParams` for this type.
     */
    createdApps?: Application[];
    /**
     * (apar) parameters of assets created by this account.
     * Note: the raw account uses `map[int] -> Asset` for this type.
     */
    createdAssets?: Asset[];
    /**
     * Round during which this account first appeared in a transaction.
     */
    createdAtRound?: number | bigint;
    /**
     * Whether or not this account is currently closed.
     */
    deleted?: boolean;
    /**
     * AccountParticipation describes the parameters used by this account in consensus
     * protocol.
     */
    participation?: AccountParticipation;
    /**
     * (ebase) used as part of the rewards computation. Only applicable to accounts
     * which are participating.
     */
    rewardBase?: number | bigint;
    /**
     * Indicates what type of signature is used by this account, must be one of:
     * * sig
     * * msig
     * * lsig
     * * or null if unknown
     */
    sigType?: string;
    /**
     * Creates a new `Account` object.
     * @param address - the account public key
     * @param amount - (algo) total number of MicroAlgos in the account
     * @param amountWithoutPendingRewards - specifies the amount of MicroAlgos in the account, without the pending rewards.
     * @param pendingRewards - amount of MicroAlgos of pending rewards in this account.
     * @param rewards - (ern) total rewards of MicroAlgos the account has received, including pending
     * rewards.
     * @param round - The round for which this information is relevant.
     * @param status - (onl) delegation status of the account's MicroAlgos
     * * Offline - indicates that the associated account is delegated.
     * * Online - indicates that the associated account used as part of the delegation
     * pool.
     * * NotParticipating - indicates that the associated account is neither a
     * delegator nor a delegate.
     * @param totalAppsOptedIn - The count of all applications that have been opted in, equivalent to the count
     * of application local data (AppLocalState objects) stored in this account.
     * @param totalAssetsOptedIn - The count of all assets that have been opted in, equivalent to the count of
     * AssetHolding objects held by this account.
     * @param totalBoxBytes - For app-accounts only. The total number of bytes allocated for the keys and
     * values of boxes which belong to the associated application.
     * @param totalBoxes - For app-accounts only. The total number of boxes which belong to the associated
     * application.
     * @param totalCreatedApps - The count of all apps (AppParams objects) created by this account.
     * @param totalCreatedAssets - The count of all assets (AssetParams objects) created by this account.
     * @param appsLocalState - (appl) applications local data stored in this account.
     * Note the raw object uses `map[int] -> AppLocalState` for this type.
     * @param appsTotalExtraPages - (teap) the sum of all extra application program pages for this account.
     * @param appsTotalSchema - (tsch) stores the sum of all of the local schemas and global schemas in this
     * account.
     * Note: the raw account uses `StateSchema` for this type.
     * @param assets - (asset) assets held by this account.
     * Note the raw object uses `map[int] -> AssetHolding` for this type.
     * @param authAddr - (spend) the address against which signing should be checked. If empty, the
     * address of the current account is used. This field can be updated in any
     * transaction by setting the RekeyTo field.
     * @param closedAtRound - Round during which this account was most recently closed.
     * @param createdApps - (appp) parameters of applications created by this account including app global
     * data.
     * Note: the raw account uses `map[int] -> AppParams` for this type.
     * @param createdAssets - (apar) parameters of assets created by this account.
     * Note: the raw account uses `map[int] -> Asset` for this type.
     * @param createdAtRound - Round during which this account first appeared in a transaction.
     * @param deleted - Whether or not this account is currently closed.
     * @param participation - AccountParticipation describes the parameters used by this account in consensus
     * protocol.
     * @param rewardBase - (ebase) used as part of the rewards computation. Only applicable to accounts
     * which are participating.
     * @param sigType - Indicates what type of signature is used by this account, must be one of:
     * * sig
     * * msig
     * * lsig
     * * or null if unknown
     */
    constructor({ address, amount, amountWithoutPendingRewards, pendingRewards, rewards, round, status, totalAppsOptedIn, totalAssetsOptedIn, totalBoxBytes, totalBoxes, totalCreatedApps, totalCreatedAssets, appsLocalState, appsTotalExtraPages, appsTotalSchema, assets, authAddr, closedAtRound, createdApps, createdAssets, createdAtRound, deleted, participation, rewardBase, sigType, }: {
        address: string;
        amount: number | bigint;
        amountWithoutPendingRewards: number | bigint;
        pendingRewards: number | bigint;
        rewards: number | bigint;
        round: number | bigint;
        status: string;
        totalAppsOptedIn: number | bigint;
        totalAssetsOptedIn: number | bigint;
        totalBoxBytes: number | bigint;
        totalBoxes: number | bigint;
        totalCreatedApps: number | bigint;
        totalCreatedAssets: number | bigint;
        appsLocalState?: ApplicationLocalState[];
        appsTotalExtraPages?: number | bigint;
        appsTotalSchema?: ApplicationStateSchema;
        assets?: AssetHolding[];
        authAddr?: string;
        closedAtRound?: number | bigint;
        createdApps?: Application[];
        createdAssets?: Asset[];
        createdAtRound?: number | bigint;
        deleted?: boolean;
        participation?: AccountParticipation;
        rewardBase?: number | bigint;
        sigType?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): Account;
}
/**
 * AccountParticipation describes the parameters used by this account in consensus
 * protocol.
 */
export declare class AccountParticipation extends BaseModel {
    /**
     * (sel) Selection public key (if any) currently registered for this round.
     */
    selectionParticipationKey: Uint8Array;
    /**
     * (voteFst) First round for which this participation is valid.
     */
    voteFirstValid: number | bigint;
    /**
     * (voteKD) Number of subkeys in each batch of participation keys.
     */
    voteKeyDilution: number | bigint;
    /**
     * (voteLst) Last round for which this participation is valid.
     */
    voteLastValid: number | bigint;
    /**
     * (vote) root participation public key (if any) currently registered for this
     * round.
     */
    voteParticipationKey: Uint8Array;
    /**
     * (stprf) Root of the state proof key (if any)
     */
    stateProofKey?: Uint8Array;
    /**
     * Creates a new `AccountParticipation` object.
     * @param selectionParticipationKey - (sel) Selection public key (if any) currently registered for this round.
     * @param voteFirstValid - (voteFst) First round for which this participation is valid.
     * @param voteKeyDilution - (voteKD) Number of subkeys in each batch of participation keys.
     * @param voteLastValid - (voteLst) Last round for which this participation is valid.
     * @param voteParticipationKey - (vote) root participation public key (if any) currently registered for this
     * round.
     * @param stateProofKey - (stprf) Root of the state proof key (if any)
     */
    constructor({ selectionParticipationKey, voteFirstValid, voteKeyDilution, voteLastValid, voteParticipationKey, stateProofKey, }: {
        selectionParticipationKey: string | Uint8Array;
        voteFirstValid: number | bigint;
        voteKeyDilution: number | bigint;
        voteLastValid: number | bigint;
        voteParticipationKey: string | Uint8Array;
        stateProofKey?: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): AccountParticipation;
}
/**
 *
 */
export declare class AccountResponse extends BaseModel {
    /**
     * Account information at a given round.
     * Definition:
     * data/basics/userBalance.go : AccountData
     */
    account: Account;
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    /**
     * Creates a new `AccountResponse` object.
     * @param account - Account information at a given round.
     * Definition:
     * data/basics/userBalance.go : AccountData
     * @param currentRound - Round at which the results were computed.
     */
    constructor({ account, currentRound, }: {
        account: Account;
        currentRound: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): AccountResponse;
}
/**
 * Application state delta.
 */
export declare class AccountStateDelta extends BaseModel {
    address: string;
    /**
     * Application state delta.
     */
    delta: EvalDeltaKeyValue[];
    /**
     * Creates a new `AccountStateDelta` object.
     * @param address -
     * @param delta - Application state delta.
     */
    constructor({ address, delta, }: {
        address: string;
        delta: EvalDeltaKeyValue[];
    });
    static from_obj_for_encoding(data: Record<string, any>): AccountStateDelta;
}
/**
 *
 */
export declare class AccountsResponse extends BaseModel {
    accounts: Account[];
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    /**
     * Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    nextToken?: string;
    /**
     * Creates a new `AccountsResponse` object.
     * @param accounts -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ accounts, currentRound, nextToken, }: {
        accounts: Account[];
        currentRound: number | bigint;
        nextToken?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): AccountsResponse;
}
/**
 * Application index and its parameters
 */
export declare class Application extends BaseModel {
    /**
     * (appidx) application index.
     */
    id: number | bigint;
    /**
     * (appparams) application parameters.
     */
    params: ApplicationParams;
    /**
     * Round when this application was created.
     */
    createdAtRound?: number | bigint;
    /**
     * Whether or not this application is currently deleted.
     */
    deleted?: boolean;
    /**
     * Round when this application was deleted.
     */
    deletedAtRound?: number | bigint;
    /**
     * Creates a new `Application` object.
     * @param id - (appidx) application index.
     * @param params - (appparams) application parameters.
     * @param createdAtRound - Round when this application was created.
     * @param deleted - Whether or not this application is currently deleted.
     * @param deletedAtRound - Round when this application was deleted.
     */
    constructor({ id, params, createdAtRound, deleted, deletedAtRound, }: {
        id: number | bigint;
        params: ApplicationParams;
        createdAtRound?: number | bigint;
        deleted?: boolean;
        deletedAtRound?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): Application;
}
/**
 * Stores local state associated with an application.
 */
export declare class ApplicationLocalState extends BaseModel {
    /**
     * The application which this local state is for.
     */
    id: number | bigint;
    /**
     * (hsch) schema.
     */
    schema: ApplicationStateSchema;
    /**
     * Round when account closed out of the application.
     */
    closedOutAtRound?: number | bigint;
    /**
     * Whether or not the application local state is currently deleted from its
     * account.
     */
    deleted?: boolean;
    /**
     * (tkv) storage.
     */
    keyValue?: TealKeyValue[];
    /**
     * Round when the account opted into the application.
     */
    optedInAtRound?: number | bigint;
    /**
     * Creates a new `ApplicationLocalState` object.
     * @param id - The application which this local state is for.
     * @param schema - (hsch) schema.
     * @param closedOutAtRound - Round when account closed out of the application.
     * @param deleted - Whether or not the application local state is currently deleted from its
     * account.
     * @param keyValue - (tkv) storage.
     * @param optedInAtRound - Round when the account opted into the application.
     */
    constructor({ id, schema, closedOutAtRound, deleted, keyValue, optedInAtRound, }: {
        id: number | bigint;
        schema: ApplicationStateSchema;
        closedOutAtRound?: number | bigint;
        deleted?: boolean;
        keyValue?: TealKeyValue[];
        optedInAtRound?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): ApplicationLocalState;
}
/**
 *
 */
export declare class ApplicationLocalStatesResponse extends BaseModel {
    appsLocalStates: ApplicationLocalState[];
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    /**
     * Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    nextToken?: string;
    /**
     * Creates a new `ApplicationLocalStatesResponse` object.
     * @param appsLocalStates -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ appsLocalStates, currentRound, nextToken, }: {
        appsLocalStates: ApplicationLocalState[];
        currentRound: number | bigint;
        nextToken?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): ApplicationLocalStatesResponse;
}
/**
 * Stores the global information associated with an application.
 */
export declare class ApplicationLogData extends BaseModel {
    /**
     * (lg) Logs for the application being executed by the transaction.
     */
    logs: Uint8Array[];
    /**
     * Transaction ID
     */
    txid: string;
    /**
     * Creates a new `ApplicationLogData` object.
     * @param logs - (lg) Logs for the application being executed by the transaction.
     * @param txid - Transaction ID
     */
    constructor({ logs, txid }: {
        logs: Uint8Array[];
        txid: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): ApplicationLogData;
}
/**
 *
 */
export declare class ApplicationLogsResponse extends BaseModel {
    /**
     * (appidx) application index.
     */
    applicationId: number | bigint;
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    logData?: ApplicationLogData[];
    /**
     * Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    nextToken?: string;
    /**
     * Creates a new `ApplicationLogsResponse` object.
     * @param applicationId - (appidx) application index.
     * @param currentRound - Round at which the results were computed.
     * @param logData -
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ applicationId, currentRound, logData, nextToken, }: {
        applicationId: number | bigint;
        currentRound: number | bigint;
        logData?: ApplicationLogData[];
        nextToken?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): ApplicationLogsResponse;
}
/**
 * Stores the global information associated with an application.
 */
export declare class ApplicationParams extends BaseModel {
    /**
     * (approv) approval program.
     */
    approvalProgram: Uint8Array;
    /**
     * (clearp) approval program.
     */
    clearStateProgram: Uint8Array;
    /**
     * The address that created this application. This is the address where the
     * parameters and global state for this application can be found.
     */
    creator?: string;
    /**
     * (epp) the amount of extra program pages available to this app.
     */
    extraProgramPages?: number | bigint;
    /**
     * [\gs) global schema
     */
    globalState?: TealKeyValue[];
    /**
     * [\gsch) global schema
     */
    globalStateSchema?: ApplicationStateSchema;
    /**
     * [\lsch) local schema
     */
    localStateSchema?: ApplicationStateSchema;
    /**
     * Creates a new `ApplicationParams` object.
     * @param approvalProgram - (approv) approval program.
     * @param clearStateProgram - (clearp) approval program.
     * @param creator - The address that created this application. This is the address where the
     * parameters and global state for this application can be found.
     * @param extraProgramPages - (epp) the amount of extra program pages available to this app.
     * @param globalState - [\gs) global schema
     * @param globalStateSchema - [\gsch) global schema
     * @param localStateSchema - [\lsch) local schema
     */
    constructor({ approvalProgram, clearStateProgram, creator, extraProgramPages, globalState, globalStateSchema, localStateSchema, }: {
        approvalProgram: string | Uint8Array;
        clearStateProgram: string | Uint8Array;
        creator?: string;
        extraProgramPages?: number | bigint;
        globalState?: TealKeyValue[];
        globalStateSchema?: ApplicationStateSchema;
        localStateSchema?: ApplicationStateSchema;
    });
    static from_obj_for_encoding(data: Record<string, any>): ApplicationParams;
}
/**
 *
 */
export declare class ApplicationResponse extends BaseModel {
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    /**
     * Application index and its parameters
     */
    application?: Application;
    /**
     * Creates a new `ApplicationResponse` object.
     * @param currentRound - Round at which the results were computed.
     * @param application - Application index and its parameters
     */
    constructor({ currentRound, application, }: {
        currentRound: number | bigint;
        application?: Application;
    });
    static from_obj_for_encoding(data: Record<string, any>): ApplicationResponse;
}
/**
 * Specifies maximums on the number of each type that may be stored.
 */
export declare class ApplicationStateSchema extends BaseModel {
    /**
     * (nbs) num of byte slices.
     */
    numByteSlice: number | bigint;
    /**
     * (nui) num of uints.
     */
    numUint: number | bigint;
    /**
     * Creates a new `ApplicationStateSchema` object.
     * @param numByteSlice - (nbs) num of byte slices.
     * @param numUint - (nui) num of uints.
     */
    constructor({ numByteSlice, numUint, }: {
        numByteSlice: number | bigint;
        numUint: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): ApplicationStateSchema;
}
/**
 *
 */
export declare class ApplicationsResponse extends BaseModel {
    applications: Application[];
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    /**
     * Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    nextToken?: string;
    /**
     * Creates a new `ApplicationsResponse` object.
     * @param applications -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ applications, currentRound, nextToken, }: {
        applications: Application[];
        currentRound: number | bigint;
        nextToken?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): ApplicationsResponse;
}
/**
 * Specifies both the unique identifier and the parameters for an asset
 */
export declare class Asset extends BaseModel {
    /**
     * unique asset identifier
     */
    index: number | bigint;
    /**
     * AssetParams specifies the parameters for an asset.
     * (apar) when part of an AssetConfig transaction.
     * Definition:
     * data/transactions/asset.go : AssetParams
     */
    params: AssetParams;
    /**
     * Round during which this asset was created.
     */
    createdAtRound?: number | bigint;
    /**
     * Whether or not this asset is currently deleted.
     */
    deleted?: boolean;
    /**
     * Round during which this asset was destroyed.
     */
    destroyedAtRound?: number | bigint;
    /**
     * Creates a new `Asset` object.
     * @param index - unique asset identifier
     * @param params - AssetParams specifies the parameters for an asset.
     * (apar) when part of an AssetConfig transaction.
     * Definition:
     * data/transactions/asset.go : AssetParams
     * @param createdAtRound - Round during which this asset was created.
     * @param deleted - Whether or not this asset is currently deleted.
     * @param destroyedAtRound - Round during which this asset was destroyed.
     */
    constructor({ index, params, createdAtRound, deleted, destroyedAtRound, }: {
        index: number | bigint;
        params: AssetParams;
        createdAtRound?: number | bigint;
        deleted?: boolean;
        destroyedAtRound?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): Asset;
}
/**
 *
 */
export declare class AssetBalancesResponse extends BaseModel {
    balances: MiniAssetHolding[];
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    /**
     * Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    nextToken?: string;
    /**
     * Creates a new `AssetBalancesResponse` object.
     * @param balances -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ balances, currentRound, nextToken, }: {
        balances: MiniAssetHolding[];
        currentRound: number | bigint;
        nextToken?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): AssetBalancesResponse;
}
/**
 * Describes an asset held by an account.
 * Definition:
 * data/basics/userBalance.go : AssetHolding
 */
export declare class AssetHolding extends BaseModel {
    /**
     * (a) number of units held.
     */
    amount: number | bigint;
    /**
     * Asset ID of the holding.
     */
    assetId: number | bigint;
    /**
     * (f) whether or not the holding is frozen.
     */
    isFrozen: boolean;
    /**
     * Whether or not the asset holding is currently deleted from its account.
     */
    deleted?: boolean;
    /**
     * Round during which the account opted into this asset holding.
     */
    optedInAtRound?: number | bigint;
    /**
     * Round during which the account opted out of this asset holding.
     */
    optedOutAtRound?: number | bigint;
    /**
     * Creates a new `AssetHolding` object.
     * @param amount - (a) number of units held.
     * @param assetId - Asset ID of the holding.
     * @param isFrozen - (f) whether or not the holding is frozen.
     * @param deleted - Whether or not the asset holding is currently deleted from its account.
     * @param optedInAtRound - Round during which the account opted into this asset holding.
     * @param optedOutAtRound - Round during which the account opted out of this asset holding.
     */
    constructor({ amount, assetId, isFrozen, deleted, optedInAtRound, optedOutAtRound, }: {
        amount: number | bigint;
        assetId: number | bigint;
        isFrozen: boolean;
        deleted?: boolean;
        optedInAtRound?: number | bigint;
        optedOutAtRound?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): AssetHolding;
}
/**
 *
 */
export declare class AssetHoldingsResponse extends BaseModel {
    assets: AssetHolding[];
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    /**
     * Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    nextToken?: string;
    /**
     * Creates a new `AssetHoldingsResponse` object.
     * @param assets -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ assets, currentRound, nextToken, }: {
        assets: AssetHolding[];
        currentRound: number | bigint;
        nextToken?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): AssetHoldingsResponse;
}
/**
 * AssetParams specifies the parameters for an asset.
 * (apar) when part of an AssetConfig transaction.
 * Definition:
 * data/transactions/asset.go : AssetParams
 */
export declare class AssetParams extends BaseModel {
    /**
     * The address that created this asset. This is the address where the parameters
     * for this asset can be found, and also the address where unwanted asset units can
     * be sent in the worst case.
     */
    creator: string;
    /**
     * (dc) The number of digits to use after the decimal point when displaying this
     * asset. If 0, the asset is not divisible. If 1, the base unit of the asset is in
     * tenths. If 2, the base unit of the asset is in hundredths, and so on. This value
     * must be between 0 and 19 (inclusive).
     */
    decimals: number | bigint;
    /**
     * (t) The total number of units of this asset.
     */
    total: number | bigint;
    /**
     * (c) Address of account used to clawback holdings of this asset. If empty,
     * clawback is not permitted.
     */
    clawback?: string;
    /**
     * (df) Whether holdings of this asset are frozen by default.
     */
    defaultFrozen?: boolean;
    /**
     * (f) Address of account used to freeze holdings of this asset. If empty, freezing
     * is not permitted.
     */
    freeze?: string;
    /**
     * (m) Address of account used to manage the keys of this asset and to destroy it.
     */
    manager?: string;
    /**
     * (am) A commitment to some unspecified asset metadata. The format of this
     * metadata is up to the application.
     */
    metadataHash?: Uint8Array;
    /**
     * (an) Name of this asset, as supplied by the creator. Included only when the
     * asset name is composed of printable utf-8 characters.
     */
    name?: string;
    /**
     * Base64 encoded name of this asset, as supplied by the creator.
     */
    nameB64?: Uint8Array;
    /**
     * (r) Address of account holding reserve (non-minted) units of this asset.
     */
    reserve?: string;
    /**
     * (un) Name of a unit of this asset, as supplied by the creator. Included only
     * when the name of a unit of this asset is composed of printable utf-8 characters.
     */
    unitName?: string;
    /**
     * Base64 encoded name of a unit of this asset, as supplied by the creator.
     */
    unitNameB64?: Uint8Array;
    /**
     * (au) URL where more information about the asset can be retrieved. Included only
     * when the URL is composed of printable utf-8 characters.
     */
    url?: string;
    /**
     * Base64 encoded URL where more information about the asset can be retrieved.
     */
    urlB64?: Uint8Array;
    /**
     * Creates a new `AssetParams` object.
     * @param creator - The address that created this asset. This is the address where the parameters
     * for this asset can be found, and also the address where unwanted asset units can
     * be sent in the worst case.
     * @param decimals - (dc) The number of digits to use after the decimal point when displaying this
     * asset. If 0, the asset is not divisible. If 1, the base unit of the asset is in
     * tenths. If 2, the base unit of the asset is in hundredths, and so on. This value
     * must be between 0 and 19 (inclusive).
     * @param total - (t) The total number of units of this asset.
     * @param clawback - (c) Address of account used to clawback holdings of this asset. If empty,
     * clawback is not permitted.
     * @param defaultFrozen - (df) Whether holdings of this asset are frozen by default.
     * @param freeze - (f) Address of account used to freeze holdings of this asset. If empty, freezing
     * is not permitted.
     * @param manager - (m) Address of account used to manage the keys of this asset and to destroy it.
     * @param metadataHash - (am) A commitment to some unspecified asset metadata. The format of this
     * metadata is up to the application.
     * @param name - (an) Name of this asset, as supplied by the creator. Included only when the
     * asset name is composed of printable utf-8 characters.
     * @param nameB64 - Base64 encoded name of this asset, as supplied by the creator.
     * @param reserve - (r) Address of account holding reserve (non-minted) units of this asset.
     * @param unitName - (un) Name of a unit of this asset, as supplied by the creator. Included only
     * when the name of a unit of this asset is composed of printable utf-8 characters.
     * @param unitNameB64 - Base64 encoded name of a unit of this asset, as supplied by the creator.
     * @param url - (au) URL where more information about the asset can be retrieved. Included only
     * when the URL is composed of printable utf-8 characters.
     * @param urlB64 - Base64 encoded URL where more information about the asset can be retrieved.
     */
    constructor({ creator, decimals, total, clawback, defaultFrozen, freeze, manager, metadataHash, name, nameB64, reserve, unitName, unitNameB64, url, urlB64, }: {
        creator: string;
        decimals: number | bigint;
        total: number | bigint;
        clawback?: string;
        defaultFrozen?: boolean;
        freeze?: string;
        manager?: string;
        metadataHash?: string | Uint8Array;
        name?: string;
        nameB64?: string | Uint8Array;
        reserve?: string;
        unitName?: string;
        unitNameB64?: string | Uint8Array;
        url?: string;
        urlB64?: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): AssetParams;
}
/**
 *
 */
export declare class AssetResponse extends BaseModel {
    /**
     * Specifies both the unique identifier and the parameters for an asset
     */
    asset: Asset;
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    /**
     * Creates a new `AssetResponse` object.
     * @param asset - Specifies both the unique identifier and the parameters for an asset
     * @param currentRound - Round at which the results were computed.
     */
    constructor({ asset, currentRound, }: {
        asset: Asset;
        currentRound: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): AssetResponse;
}
/**
 *
 */
export declare class AssetsResponse extends BaseModel {
    assets: Asset[];
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    /**
     * Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    nextToken?: string;
    /**
     * Creates a new `AssetsResponse` object.
     * @param assets -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ assets, currentRound, nextToken, }: {
        assets: Asset[];
        currentRound: number | bigint;
        nextToken?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): AssetsResponse;
}
/**
 * Block information.
 * Definition:
 * data/bookkeeping/block.go : Block
 */
export declare class Block extends BaseModel {
    /**
     * (gh) hash to which this block belongs.
     */
    genesisHash: Uint8Array;
    /**
     * (gen) ID to which this block belongs.
     */
    genesisId: string;
    /**
     * (prev) Previous block hash.
     */
    previousBlockHash: Uint8Array;
    /**
     * (rnd) Current round on which this block was appended to the chain.
     */
    round: number | bigint;
    /**
     * (seed) Sortition seed.
     */
    seed: Uint8Array;
    /**
     * (ts) Block creation timestamp in seconds since eposh
     */
    timestamp: number | bigint;
    /**
     * (txn) TransactionsRoot authenticates the set of transactions appearing in the
     * block. More specifically, it's the root of a merkle tree whose leaves are the
     * block's Txids, in lexicographic order. For the empty block, it's 0. Note that
     * the TxnRoot does not authenticate the signatures on the transactions, only the
     * transactions themselves. Two blocks with the same transactions but in a
     * different order and with different signatures will have the same TxnRoot.
     */
    transactionsRoot: Uint8Array;
    /**
     * (txn256) TransactionsRootSHA256 is an auxiliary TransactionRoot, built using a
     * vector commitment instead of a merkle tree, and SHA256 hash function instead of
     * the default SHA512_256. This commitment can be used on environments where only
     * the SHA256 function exists.
     */
    transactionsRootSha256: Uint8Array;
    /**
     * Participation account data that needs to be checked/acted on by the network.
     */
    participationUpdates?: ParticipationUpdates;
    /**
     * Fields relating to rewards,
     */
    rewards?: BlockRewards;
    /**
     * Tracks the status of state proofs.
     */
    stateProofTracking?: StateProofTracking[];
    /**
     * (txns) list of transactions corresponding to a given round.
     */
    transactions?: Transaction[];
    /**
     * (tc) TxnCounter counts the number of transactions committed in the ledger, from
     * the time at which support for this feature was introduced.
     * Specifically, TxnCounter is the number of the next transaction that will be
     * committed after this block. It is 0 when no transactions have ever been
     * committed (since TxnCounter started being supported).
     */
    txnCounter?: number | bigint;
    /**
     * Fields relating to a protocol upgrade.
     */
    upgradeState?: BlockUpgradeState;
    /**
     * Fields relating to voting for a protocol upgrade.
     */
    upgradeVote?: BlockUpgradeVote;
    /**
     * Creates a new `Block` object.
     * @param genesisHash - (gh) hash to which this block belongs.
     * @param genesisId - (gen) ID to which this block belongs.
     * @param previousBlockHash - (prev) Previous block hash.
     * @param round - (rnd) Current round on which this block was appended to the chain.
     * @param seed - (seed) Sortition seed.
     * @param timestamp - (ts) Block creation timestamp in seconds since eposh
     * @param transactionsRoot - (txn) TransactionsRoot authenticates the set of transactions appearing in the
     * block. More specifically, it's the root of a merkle tree whose leaves are the
     * block's Txids, in lexicographic order. For the empty block, it's 0. Note that
     * the TxnRoot does not authenticate the signatures on the transactions, only the
     * transactions themselves. Two blocks with the same transactions but in a
     * different order and with different signatures will have the same TxnRoot.
     * @param transactionsRootSha256 - (txn256) TransactionsRootSHA256 is an auxiliary TransactionRoot, built using a
     * vector commitment instead of a merkle tree, and SHA256 hash function instead of
     * the default SHA512_256. This commitment can be used on environments where only
     * the SHA256 function exists.
     * @param participationUpdates - Participation account data that needs to be checked/acted on by the network.
     * @param rewards - Fields relating to rewards,
     * @param stateProofTracking - Tracks the status of state proofs.
     * @param transactions - (txns) list of transactions corresponding to a given round.
     * @param txnCounter - (tc) TxnCounter counts the number of transactions committed in the ledger, from
     * the time at which support for this feature was introduced.
     * Specifically, TxnCounter is the number of the next transaction that will be
     * committed after this block. It is 0 when no transactions have ever been
     * committed (since TxnCounter started being supported).
     * @param upgradeState - Fields relating to a protocol upgrade.
     * @param upgradeVote - Fields relating to voting for a protocol upgrade.
     */
    constructor({ genesisHash, genesisId, previousBlockHash, round, seed, timestamp, transactionsRoot, transactionsRootSha256, participationUpdates, rewards, stateProofTracking, transactions, txnCounter, upgradeState, upgradeVote, }: {
        genesisHash: string | Uint8Array;
        genesisId: string;
        previousBlockHash: string | Uint8Array;
        round: number | bigint;
        seed: string | Uint8Array;
        timestamp: number | bigint;
        transactionsRoot: string | Uint8Array;
        transactionsRootSha256: string | Uint8Array;
        participationUpdates?: ParticipationUpdates;
        rewards?: BlockRewards;
        stateProofTracking?: StateProofTracking[];
        transactions?: Transaction[];
        txnCounter?: number | bigint;
        upgradeState?: BlockUpgradeState;
        upgradeVote?: BlockUpgradeVote;
    });
    static from_obj_for_encoding(data: Record<string, any>): Block;
}
/**
 * Fields relating to rewards,
 */
export declare class BlockRewards extends BaseModel {
    /**
     * (fees) accepts transaction fees, it can only spend to the incentive pool.
     */
    feeSink: string;
    /**
     * (rwcalr) number of leftover MicroAlgos after the distribution of rewards-rate
     * MicroAlgos for every reward unit in the next round.
     */
    rewardsCalculationRound: number | bigint;
    /**
     * (earn) How many rewards, in MicroAlgos, have been distributed to each RewardUnit
     * of MicroAlgos since genesis.
     */
    rewardsLevel: number | bigint;
    /**
     * (rwd) accepts periodic injections from the fee-sink and continually
     * redistributes them as rewards.
     */
    rewardsPool: string;
    /**
     * (rate) Number of new MicroAlgos added to the participation stake from rewards at
     * the next round.
     */
    rewardsRate: number | bigint;
    /**
     * (frac) Number of leftover MicroAlgos after the distribution of
     * RewardsRate/rewardUnits MicroAlgos for every reward unit in the next round.
     */
    rewardsResidue: number | bigint;
    /**
     * Creates a new `BlockRewards` object.
     * @param feeSink - (fees) accepts transaction fees, it can only spend to the incentive pool.
     * @param rewardsCalculationRound - (rwcalr) number of leftover MicroAlgos after the distribution of rewards-rate
     * MicroAlgos for every reward unit in the next round.
     * @param rewardsLevel - (earn) How many rewards, in MicroAlgos, have been distributed to each RewardUnit
     * of MicroAlgos since genesis.
     * @param rewardsPool - (rwd) accepts periodic injections from the fee-sink and continually
     * redistributes them as rewards.
     * @param rewardsRate - (rate) Number of new MicroAlgos added to the participation stake from rewards at
     * the next round.
     * @param rewardsResidue - (frac) Number of leftover MicroAlgos after the distribution of
     * RewardsRate/rewardUnits MicroAlgos for every reward unit in the next round.
     */
    constructor({ feeSink, rewardsCalculationRound, rewardsLevel, rewardsPool, rewardsRate, rewardsResidue, }: {
        feeSink: string;
        rewardsCalculationRound: number | bigint;
        rewardsLevel: number | bigint;
        rewardsPool: string;
        rewardsRate: number | bigint;
        rewardsResidue: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): BlockRewards;
}
/**
 * Fields relating to a protocol upgrade.
 */
export declare class BlockUpgradeState extends BaseModel {
    /**
     * (proto) The current protocol version.
     */
    currentProtocol: string;
    /**
     * (nextproto) The next proposed protocol version.
     */
    nextProtocol?: string;
    /**
     * (nextyes) Number of blocks which approved the protocol upgrade.
     */
    nextProtocolApprovals?: number | bigint;
    /**
     * (nextswitch) Round on which the protocol upgrade will take effect.
     */
    nextProtocolSwitchOn?: number | bigint;
    /**
     * (nextbefore) Deadline round for this protocol upgrade (No votes will be consider
     * after this round).
     */
    nextProtocolVoteBefore?: number | bigint;
    /**
     * Creates a new `BlockUpgradeState` object.
     * @param currentProtocol - (proto) The current protocol version.
     * @param nextProtocol - (nextproto) The next proposed protocol version.
     * @param nextProtocolApprovals - (nextyes) Number of blocks which approved the protocol upgrade.
     * @param nextProtocolSwitchOn - (nextswitch) Round on which the protocol upgrade will take effect.
     * @param nextProtocolVoteBefore - (nextbefore) Deadline round for this protocol upgrade (No votes will be consider
     * after this round).
     */
    constructor({ currentProtocol, nextProtocol, nextProtocolApprovals, nextProtocolSwitchOn, nextProtocolVoteBefore, }: {
        currentProtocol: string;
        nextProtocol?: string;
        nextProtocolApprovals?: number | bigint;
        nextProtocolSwitchOn?: number | bigint;
        nextProtocolVoteBefore?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): BlockUpgradeState;
}
/**
 * Fields relating to voting for a protocol upgrade.
 */
export declare class BlockUpgradeVote extends BaseModel {
    /**
     * (upgradeyes) Indicates a yes vote for the current proposal.
     */
    upgradeApprove?: boolean;
    /**
     * (upgradedelay) Indicates the time between acceptance and execution.
     */
    upgradeDelay?: number | bigint;
    /**
     * (upgradeprop) Indicates a proposed upgrade.
     */
    upgradePropose?: string;
    /**
     * Creates a new `BlockUpgradeVote` object.
     * @param upgradeApprove - (upgradeyes) Indicates a yes vote for the current proposal.
     * @param upgradeDelay - (upgradedelay) Indicates the time between acceptance and execution.
     * @param upgradePropose - (upgradeprop) Indicates a proposed upgrade.
     */
    constructor({ upgradeApprove, upgradeDelay, upgradePropose, }: {
        upgradeApprove?: boolean;
        upgradeDelay?: number | bigint;
        upgradePropose?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): BlockUpgradeVote;
}
/**
 * Box name and its content.
 */
export declare class Box extends BaseModel {
    /**
     * (name) box name, base64 encoded
     */
    name: Uint8Array;
    /**
     * (value) box value, base64 encoded.
     */
    value: Uint8Array;
    /**
     * Creates a new `Box` object.
     * @param name - (name) box name, base64 encoded
     * @param value - (value) box value, base64 encoded.
     */
    constructor({ name, value, }: {
        name: string | Uint8Array;
        value: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): Box;
}
/**
 * Box descriptor describes an app box without a value.
 */
export declare class BoxDescriptor extends BaseModel {
    /**
     * Base64 encoded box name
     */
    name: Uint8Array;
    /**
     * Creates a new `BoxDescriptor` object.
     * @param name - Base64 encoded box name
     */
    constructor({ name }: {
        name: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): BoxDescriptor;
}
/**
 * Box names of an application
 */
export declare class BoxesResponse extends BaseModel {
    /**
     * (appidx) application index.
     */
    applicationId: number | bigint;
    boxes: BoxDescriptor[];
    /**
     * Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    nextToken?: string;
    /**
     * Creates a new `BoxesResponse` object.
     * @param applicationId - (appidx) application index.
     * @param boxes -
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ applicationId, boxes, nextToken, }: {
        applicationId: number | bigint;
        boxes: BoxDescriptor[];
        nextToken?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): BoxesResponse;
}
/**
 * Response for errors
 */
export declare class ErrorResponse extends BaseModel {
    message: string;
    data?: Record<string, any>;
    /**
     * Creates a new `ErrorResponse` object.
     * @param message -
     * @param data -
     */
    constructor({ message, data, }: {
        message: string;
        data?: Record<string, any>;
    });
    static from_obj_for_encoding(data: Record<string, any>): ErrorResponse;
}
/**
 * Represents a TEAL value delta.
 */
export declare class EvalDelta extends BaseModel {
    /**
     * (at) delta action.
     */
    action: number | bigint;
    /**
     * (bs) bytes value.
     */
    bytes?: string;
    /**
     * (ui) uint value.
     */
    uint?: number | bigint;
    /**
     * Creates a new `EvalDelta` object.
     * @param action - (at) delta action.
     * @param bytes - (bs) bytes value.
     * @param uint - (ui) uint value.
     */
    constructor({ action, bytes, uint, }: {
        action: number | bigint;
        bytes?: string;
        uint?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): EvalDelta;
}
/**
 * Key-value pairs for StateDelta.
 */
export declare class EvalDeltaKeyValue extends BaseModel {
    key: string;
    /**
     * Represents a TEAL value delta.
     */
    value: EvalDelta;
    /**
     * Creates a new `EvalDeltaKeyValue` object.
     * @param key -
     * @param value - Represents a TEAL value delta.
     */
    constructor({ key, value }: {
        key: string;
        value: EvalDelta;
    });
    static from_obj_for_encoding(data: Record<string, any>): EvalDeltaKeyValue;
}
export declare class HashFactory extends BaseModel {
    /**
     * (t)
     */
    hashType?: number | bigint;
    /**
     * Creates a new `HashFactory` object.
     * @param hashType - (t)
     */
    constructor({ hashType }: {
        hashType?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): HashFactory;
}
/**
 * A health check response.
 */
export declare class HealthCheck extends BaseModel {
    dbAvailable: boolean;
    isMigrating: boolean;
    message: string;
    round: number | bigint;
    /**
     * Current version.
     */
    version: string;
    data?: Record<string, any>;
    errors?: string[];
    /**
     * Creates a new `HealthCheck` object.
     * @param dbAvailable -
     * @param isMigrating -
     * @param message -
     * @param round -
     * @param version - Current version.
     * @param data -
     * @param errors -
     */
    constructor({ dbAvailable, isMigrating, message, round, version, data, errors, }: {
        dbAvailable: boolean;
        isMigrating: boolean;
        message: string;
        round: number | bigint;
        version: string;
        data?: Record<string, any>;
        errors?: string[];
    });
    static from_obj_for_encoding(data: Record<string, any>): HealthCheck;
}
export declare class IndexerStateProofMessage extends BaseModel {
    /**
     * (b)
     */
    blockHeadersCommitment?: Uint8Array;
    /**
     * (f)
     */
    firstAttestedRound?: number | bigint;
    /**
     * (l)
     */
    latestAttestedRound?: number | bigint;
    /**
     * (P)
     */
    lnProvenWeight?: number | bigint;
    /**
     * (v)
     */
    votersCommitment?: Uint8Array;
    /**
     * Creates a new `IndexerStateProofMessage` object.
     * @param blockHeadersCommitment - (b)
     * @param firstAttestedRound - (f)
     * @param latestAttestedRound - (l)
     * @param lnProvenWeight - (P)
     * @param votersCommitment - (v)
     */
    constructor({ blockHeadersCommitment, firstAttestedRound, latestAttestedRound, lnProvenWeight, votersCommitment, }: {
        blockHeadersCommitment?: string | Uint8Array;
        firstAttestedRound?: number | bigint;
        latestAttestedRound?: number | bigint;
        lnProvenWeight?: number | bigint;
        votersCommitment?: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): IndexerStateProofMessage;
}
export declare class MerkleArrayProof extends BaseModel {
    hashFactory?: HashFactory;
    /**
     * (pth)
     */
    path?: Uint8Array[];
    /**
     * (td)
     */
    treeDepth?: number | bigint;
    /**
     * Creates a new `MerkleArrayProof` object.
     * @param hashFactory -
     * @param path - (pth)
     * @param treeDepth - (td)
     */
    constructor({ hashFactory, path, treeDepth, }: {
        hashFactory?: HashFactory;
        path?: Uint8Array[];
        treeDepth?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): MerkleArrayProof;
}
/**
 * A simplified version of AssetHolding
 */
export declare class MiniAssetHolding extends BaseModel {
    address: string;
    amount: number | bigint;
    isFrozen: boolean;
    /**
     * Whether or not this asset holding is currently deleted from its account.
     */
    deleted?: boolean;
    /**
     * Round during which the account opted into the asset.
     */
    optedInAtRound?: number | bigint;
    /**
     * Round during which the account opted out of the asset.
     */
    optedOutAtRound?: number | bigint;
    /**
     * Creates a new `MiniAssetHolding` object.
     * @param address -
     * @param amount -
     * @param isFrozen -
     * @param deleted - Whether or not this asset holding is currently deleted from its account.
     * @param optedInAtRound - Round during which the account opted into the asset.
     * @param optedOutAtRound - Round during which the account opted out of the asset.
     */
    constructor({ address, amount, isFrozen, deleted, optedInAtRound, optedOutAtRound, }: {
        address: string;
        amount: number | bigint;
        isFrozen: boolean;
        deleted?: boolean;
        optedInAtRound?: number | bigint;
        optedOutAtRound?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): MiniAssetHolding;
}
/**
 * Participation account data that needs to be checked/acted on by the network.
 */
export declare class ParticipationUpdates extends BaseModel {
    /**
     * (partupdrmv) a list of online accounts that needs to be converted to offline
     * since their participation key expired.
     */
    expiredParticipationAccounts?: string[];
    /**
     * Creates a new `ParticipationUpdates` object.
     * @param expiredParticipationAccounts - (partupdrmv) a list of online accounts that needs to be converted to offline
     * since their participation key expired.
     */
    constructor({ expiredParticipationAccounts, }: {
        expiredParticipationAccounts?: string[];
    });
    static from_obj_for_encoding(data: Record<string, any>): ParticipationUpdates;
}
/**
 * (sp) represents a state proof.
 * Definition:
 * crypto/stateproof/structs.go : StateProof
 */
export declare class StateProofFields extends BaseModel {
    /**
     * (P)
     */
    partProofs?: MerkleArrayProof;
    /**
     * (pr) Sequence of reveal positions.
     */
    positionsToReveal?: (number | bigint)[];
    /**
     * (r) Note that this is actually stored as a map[uint64] - Reveal in the actual
     * msgp
     */
    reveals?: StateProofReveal[];
    /**
     * (v) Salt version of the merkle signature.
     */
    saltVersion?: number | bigint;
    /**
     * (c)
     */
    sigCommit?: Uint8Array;
    /**
     * (S)
     */
    sigProofs?: MerkleArrayProof;
    /**
     * (w)
     */
    signedWeight?: number | bigint;
    /**
     * Creates a new `StateProofFields` object.
     * @param partProofs - (P)
     * @param positionsToReveal - (pr) Sequence of reveal positions.
     * @param reveals - (r) Note that this is actually stored as a map[uint64] - Reveal in the actual
     * msgp
     * @param saltVersion - (v) Salt version of the merkle signature.
     * @param sigCommit - (c)
     * @param sigProofs - (S)
     * @param signedWeight - (w)
     */
    constructor({ partProofs, positionsToReveal, reveals, saltVersion, sigCommit, sigProofs, signedWeight, }: {
        partProofs?: MerkleArrayProof;
        positionsToReveal?: (number | bigint)[];
        reveals?: StateProofReveal[];
        saltVersion?: number | bigint;
        sigCommit?: string | Uint8Array;
        sigProofs?: MerkleArrayProof;
        signedWeight?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): StateProofFields;
}
export declare class StateProofParticipant extends BaseModel {
    /**
     * (p)
     */
    verifier?: StateProofVerifier;
    /**
     * (w)
     */
    weight?: number | bigint;
    /**
     * Creates a new `StateProofParticipant` object.
     * @param verifier - (p)
     * @param weight - (w)
     */
    constructor({ verifier, weight, }: {
        verifier?: StateProofVerifier;
        weight?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): StateProofParticipant;
}
export declare class StateProofReveal extends BaseModel {
    /**
     * (p)
     */
    participant?: StateProofParticipant;
    /**
     * The position in the signature and participants arrays corresponding to this
     * entry.
     */
    position?: number | bigint;
    /**
     * (s)
     */
    sigSlot?: StateProofSigSlot;
    /**
     * Creates a new `StateProofReveal` object.
     * @param participant - (p)
     * @param position - The position in the signature and participants arrays corresponding to this
     * entry.
     * @param sigSlot - (s)
     */
    constructor({ participant, position, sigSlot, }: {
        participant?: StateProofParticipant;
        position?: number | bigint;
        sigSlot?: StateProofSigSlot;
    });
    static from_obj_for_encoding(data: Record<string, any>): StateProofReveal;
}
export declare class StateProofSigSlot extends BaseModel {
    /**
     * (l) The total weight of signatures in the lower-numbered slots.
     */
    lowerSigWeight?: number | bigint;
    signature?: StateProofSignature;
    /**
     * Creates a new `StateProofSigSlot` object.
     * @param lowerSigWeight - (l) The total weight of signatures in the lower-numbered slots.
     * @param signature -
     */
    constructor({ lowerSigWeight, signature, }: {
        lowerSigWeight?: number | bigint;
        signature?: StateProofSignature;
    });
    static from_obj_for_encoding(data: Record<string, any>): StateProofSigSlot;
}
export declare class StateProofSignature extends BaseModel {
    falconSignature?: Uint8Array;
    merkleArrayIndex?: number | bigint;
    proof?: MerkleArrayProof;
    /**
     * (vkey)
     */
    verifyingKey?: Uint8Array;
    /**
     * Creates a new `StateProofSignature` object.
     * @param falconSignature -
     * @param merkleArrayIndex -
     * @param proof -
     * @param verifyingKey - (vkey)
     */
    constructor({ falconSignature, merkleArrayIndex, proof, verifyingKey, }: {
        falconSignature?: string | Uint8Array;
        merkleArrayIndex?: number | bigint;
        proof?: MerkleArrayProof;
        verifyingKey?: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): StateProofSignature;
}
export declare class StateProofTracking extends BaseModel {
    /**
     * (n) Next round for which we will accept a state proof transaction.
     */
    nextRound?: number | bigint;
    /**
     * (t) The total number of microalgos held by the online accounts during the
     * StateProof round.
     */
    onlineTotalWeight?: number | bigint;
    /**
     * State Proof Type. Note the raw object uses map with this as key.
     */
    type?: number | bigint;
    /**
     * (v) Root of a vector commitment containing online accounts that will help sign
     * the proof.
     */
    votersCommitment?: Uint8Array;
    /**
     * Creates a new `StateProofTracking` object.
     * @param nextRound - (n) Next round for which we will accept a state proof transaction.
     * @param onlineTotalWeight - (t) The total number of microalgos held by the online accounts during the
     * StateProof round.
     * @param type - State Proof Type. Note the raw object uses map with this as key.
     * @param votersCommitment - (v) Root of a vector commitment containing online accounts that will help sign
     * the proof.
     */
    constructor({ nextRound, onlineTotalWeight, type, votersCommitment, }: {
        nextRound?: number | bigint;
        onlineTotalWeight?: number | bigint;
        type?: number | bigint;
        votersCommitment?: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): StateProofTracking;
}
export declare class StateProofVerifier extends BaseModel {
    /**
     * (cmt) Represents the root of the vector commitment tree.
     */
    commitment?: Uint8Array;
    /**
     * (lf) Key lifetime.
     */
    keyLifetime?: number | bigint;
    /**
     * Creates a new `StateProofVerifier` object.
     * @param commitment - (cmt) Represents the root of the vector commitment tree.
     * @param keyLifetime - (lf) Key lifetime.
     */
    constructor({ commitment, keyLifetime, }: {
        commitment?: string | Uint8Array;
        keyLifetime?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): StateProofVerifier;
}
/**
 * Represents a (apls) local-state or (apgs) global-state schema. These schemas
 * determine how much storage may be used in a local-state or global-state for an
 * application. The more space used, the larger minimum balance must be maintained
 * in the account holding the data.
 */
export declare class StateSchema extends BaseModel {
    /**
     * Maximum number of TEAL byte slices that may be stored in the key/value store.
     */
    numByteSlice: number | bigint;
    /**
     * Maximum number of TEAL uints that may be stored in the key/value store.
     */
    numUint: number | bigint;
    /**
     * Creates a new `StateSchema` object.
     * @param numByteSlice - Maximum number of TEAL byte slices that may be stored in the key/value store.
     * @param numUint - Maximum number of TEAL uints that may be stored in the key/value store.
     */
    constructor({ numByteSlice, numUint, }: {
        numByteSlice: number | bigint;
        numUint: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): StateSchema;
}
/**
 * Represents a key-value pair in an application store.
 */
export declare class TealKeyValue extends BaseModel {
    key: string;
    /**
     * Represents a TEAL value.
     */
    value: TealValue;
    /**
     * Creates a new `TealKeyValue` object.
     * @param key -
     * @param value - Represents a TEAL value.
     */
    constructor({ key, value }: {
        key: string;
        value: TealValue;
    });
    static from_obj_for_encoding(data: Record<string, any>): TealKeyValue;
}
/**
 * Represents a TEAL value.
 */
export declare class TealValue extends BaseModel {
    /**
     * (tb) bytes value.
     */
    bytes: string;
    /**
     * (tt) value type. Value `1` refers to **bytes**, value `2` refers to **uint**
     */
    type: number | bigint;
    /**
     * (ui) uint value.
     */
    uint: number | bigint;
    /**
     * Creates a new `TealValue` object.
     * @param bytes - (tb) bytes value.
     * @param type - (tt) value type. Value `1` refers to **bytes**, value `2` refers to **uint**
     * @param uint - (ui) uint value.
     */
    constructor({ bytes, type, uint, }: {
        bytes: string;
        type: number | bigint;
        uint: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): TealValue;
}
/**
 * Contains all fields common to all transactions and serves as an envelope to all
 * transactions type. Represents both regular and inner transactions.
 * Definition:
 * data/transactions/signedtxn.go : SignedTxn
 * data/transactions/transaction.go : Transaction
 */
export declare class Transaction extends BaseModel {
    /**
     * (fee) Transaction fee.
     */
    fee: number | bigint;
    /**
     * (fv) First valid round for this transaction.
     */
    firstValid: number | bigint;
    /**
     * (lv) Last valid round for this transaction.
     */
    lastValid: number | bigint;
    /**
     * (snd) Sender's address.
     */
    sender: string;
    /**
     * Fields for application transactions.
     * Definition:
     * data/transactions/application.go : ApplicationCallTxnFields
     */
    applicationTransaction?: TransactionApplication;
    /**
     * Fields for asset allocation, re-configuration, and destruction.
     * A zero value for asset-id indicates asset creation.
     * A zero value for the params indicates asset destruction.
     * Definition:
     * data/transactions/asset.go : AssetConfigTxnFields
     */
    assetConfigTransaction?: TransactionAssetConfig;
    /**
     * Fields for an asset freeze transaction.
     * Definition:
     * data/transactions/asset.go : AssetFreezeTxnFields
     */
    assetFreezeTransaction?: TransactionAssetFreeze;
    /**
     * Fields for an asset transfer transaction.
     * Definition:
     * data/transactions/asset.go : AssetTransferTxnFields
     */
    assetTransferTransaction?: TransactionAssetTransfer;
    /**
     * (sgnr) this is included with signed transactions when the signing address does
     * not equal the sender. The backend can use this to ensure that auth addr is equal
     * to the accounts auth addr.
     */
    authAddr?: string;
    /**
     * (rc) rewards applied to close-remainder-to account.
     */
    closeRewards?: number | bigint;
    /**
     * (ca) closing amount for transaction.
     */
    closingAmount?: number | bigint;
    /**
     * Round when the transaction was confirmed.
     */
    confirmedRound?: number | bigint;
    /**
     * Specifies an application index (ID) if an application was created with this
     * transaction.
     */
    createdApplicationIndex?: number | bigint;
    /**
     * Specifies an asset index (ID) if an asset was created with this transaction.
     */
    createdAssetIndex?: number | bigint;
    /**
     * (gh) Hash of genesis block.
     */
    genesisHash?: Uint8Array;
    /**
     * (gen) genesis block ID.
     */
    genesisId?: string;
    /**
     * (gd) Global state key/value changes for the application being executed by this
     * transaction.
     */
    globalStateDelta?: EvalDeltaKeyValue[];
    /**
     * (grp) Base64 encoded byte array of a sha512/256 digest. When present indicates
     * that this transaction is part of a transaction group and the value is the
     * sha512/256 hash of the transactions in that group.
     */
    group?: Uint8Array;
    /**
     * Transaction ID
     */
    id?: string;
    /**
     * Inner transactions produced by application execution.
     */
    innerTxns?: Transaction[];
    /**
     * Offset into the round where this transaction was confirmed.
     */
    intraRoundOffset?: number | bigint;
    /**
     * Fields for a keyreg transaction.
     * Definition:
     * data/transactions/keyreg.go : KeyregTxnFields
     */
    keyregTransaction?: TransactionKeyreg;
    /**
     * (lx) Base64 encoded 32-byte array. Lease enforces mutual exclusion of
     * transactions. If this field is nonzero, then once the transaction is confirmed,
     * it acquires the lease identified by the (Sender, Lease) pair of the transaction
     * until the LastValid round passes. While this transaction possesses the lease, no
     * other transaction specifying this lease can be confirmed.
     */
    lease?: Uint8Array;
    /**
     * (ld) Local state key/value changes for the application being executed by this
     * transaction.
     */
    localStateDelta?: AccountStateDelta[];
    /**
     * (lg) Logs for the application being executed by this transaction.
     */
    logs?: Uint8Array[];
    /**
     * (note) Free form data.
     */
    note?: Uint8Array;
    /**
     * Fields for a payment transaction.
     * Definition:
     * data/transactions/payment.go : PaymentTxnFields
     */
    paymentTransaction?: TransactionPayment;
    /**
     * (rr) rewards applied to receiver account.
     */
    receiverRewards?: number | bigint;
    /**
     * (rekey) when included in a valid transaction, the accounts auth addr will be
     * updated with this value and future signatures must be signed with the key
     * represented by this address.
     */
    rekeyTo?: string;
    /**
     * Time when the block this transaction is in was confirmed.
     */
    roundTime?: number | bigint;
    /**
     * (rs) rewards applied to sender account.
     */
    senderRewards?: number | bigint;
    /**
     * Validation signature associated with some data. Only one of the signatures
     * should be provided.
     */
    signature?: TransactionSignature;
    /**
     * Fields for a state proof transaction.
     * Definition:
     * data/transactions/stateproof.go : StateProofTxnFields
     */
    stateProofTransaction?: TransactionStateProof;
    /**
     * (type) Indicates what type of transaction this is. Different types have
     * different fields.
     * Valid types, and where their fields are stored:
     * * (pay) payment-transaction
     * * (keyreg) keyreg-transaction
     * * (acfg) asset-config-transaction
     * * (axfer) asset-transfer-transaction
     * * (afrz) asset-freeze-transaction
     * * (appl) application-transaction
     * * (stpf) state-proof-transaction
     */
    txType?: string;
    /**
     * Creates a new `Transaction` object.
     * @param fee - (fee) Transaction fee.
     * @param firstValid - (fv) First valid round for this transaction.
     * @param lastValid - (lv) Last valid round for this transaction.
     * @param sender - (snd) Sender's address.
     * @param applicationTransaction - Fields for application transactions.
     * Definition:
     * data/transactions/application.go : ApplicationCallTxnFields
     * @param assetConfigTransaction - Fields for asset allocation, re-configuration, and destruction.
     * A zero value for asset-id indicates asset creation.
     * A zero value for the params indicates asset destruction.
     * Definition:
     * data/transactions/asset.go : AssetConfigTxnFields
     * @param assetFreezeTransaction - Fields for an asset freeze transaction.
     * Definition:
     * data/transactions/asset.go : AssetFreezeTxnFields
     * @param assetTransferTransaction - Fields for an asset transfer transaction.
     * Definition:
     * data/transactions/asset.go : AssetTransferTxnFields
     * @param authAddr - (sgnr) this is included with signed transactions when the signing address does
     * not equal the sender. The backend can use this to ensure that auth addr is equal
     * to the accounts auth addr.
     * @param closeRewards - (rc) rewards applied to close-remainder-to account.
     * @param closingAmount - (ca) closing amount for transaction.
     * @param confirmedRound - Round when the transaction was confirmed.
     * @param createdApplicationIndex - Specifies an application index (ID) if an application was created with this
     * transaction.
     * @param createdAssetIndex - Specifies an asset index (ID) if an asset was created with this transaction.
     * @param genesisHash - (gh) Hash of genesis block.
     * @param genesisId - (gen) genesis block ID.
     * @param globalStateDelta - (gd) Global state key/value changes for the application being executed by this
     * transaction.
     * @param group - (grp) Base64 encoded byte array of a sha512/256 digest. When present indicates
     * that this transaction is part of a transaction group and the value is the
     * sha512/256 hash of the transactions in that group.
     * @param id - Transaction ID
     * @param innerTxns - Inner transactions produced by application execution.
     * @param intraRoundOffset - Offset into the round where this transaction was confirmed.
     * @param keyregTransaction - Fields for a keyreg transaction.
     * Definition:
     * data/transactions/keyreg.go : KeyregTxnFields
     * @param lease - (lx) Base64 encoded 32-byte array. Lease enforces mutual exclusion of
     * transactions. If this field is nonzero, then once the transaction is confirmed,
     * it acquires the lease identified by the (Sender, Lease) pair of the transaction
     * until the LastValid round passes. While this transaction possesses the lease, no
     * other transaction specifying this lease can be confirmed.
     * @param localStateDelta - (ld) Local state key/value changes for the application being executed by this
     * transaction.
     * @param logs - (lg) Logs for the application being executed by this transaction.
     * @param note - (note) Free form data.
     * @param paymentTransaction - Fields for a payment transaction.
     * Definition:
     * data/transactions/payment.go : PaymentTxnFields
     * @param receiverRewards - (rr) rewards applied to receiver account.
     * @param rekeyTo - (rekey) when included in a valid transaction, the accounts auth addr will be
     * updated with this value and future signatures must be signed with the key
     * represented by this address.
     * @param roundTime - Time when the block this transaction is in was confirmed.
     * @param senderRewards - (rs) rewards applied to sender account.
     * @param signature - Validation signature associated with some data. Only one of the signatures
     * should be provided.
     * @param stateProofTransaction - Fields for a state proof transaction.
     * Definition:
     * data/transactions/stateproof.go : StateProofTxnFields
     * @param txType - (type) Indicates what type of transaction this is. Different types have
     * different fields.
     * Valid types, and where their fields are stored:
     * * (pay) payment-transaction
     * * (keyreg) keyreg-transaction
     * * (acfg) asset-config-transaction
     * * (axfer) asset-transfer-transaction
     * * (afrz) asset-freeze-transaction
     * * (appl) application-transaction
     * * (stpf) state-proof-transaction
     */
    constructor({ fee, firstValid, lastValid, sender, applicationTransaction, assetConfigTransaction, assetFreezeTransaction, assetTransferTransaction, authAddr, closeRewards, closingAmount, confirmedRound, createdApplicationIndex, createdAssetIndex, genesisHash, genesisId, globalStateDelta, group, id, innerTxns, intraRoundOffset, keyregTransaction, lease, localStateDelta, logs, note, paymentTransaction, receiverRewards, rekeyTo, roundTime, senderRewards, signature, stateProofTransaction, txType, }: {
        fee: number | bigint;
        firstValid: number | bigint;
        lastValid: number | bigint;
        sender: string;
        applicationTransaction?: TransactionApplication;
        assetConfigTransaction?: TransactionAssetConfig;
        assetFreezeTransaction?: TransactionAssetFreeze;
        assetTransferTransaction?: TransactionAssetTransfer;
        authAddr?: string;
        closeRewards?: number | bigint;
        closingAmount?: number | bigint;
        confirmedRound?: number | bigint;
        createdApplicationIndex?: number | bigint;
        createdAssetIndex?: number | bigint;
        genesisHash?: string | Uint8Array;
        genesisId?: string;
        globalStateDelta?: EvalDeltaKeyValue[];
        group?: string | Uint8Array;
        id?: string;
        innerTxns?: Transaction[];
        intraRoundOffset?: number | bigint;
        keyregTransaction?: TransactionKeyreg;
        lease?: string | Uint8Array;
        localStateDelta?: AccountStateDelta[];
        logs?: Uint8Array[];
        note?: string | Uint8Array;
        paymentTransaction?: TransactionPayment;
        receiverRewards?: number | bigint;
        rekeyTo?: string;
        roundTime?: number | bigint;
        senderRewards?: number | bigint;
        signature?: TransactionSignature;
        stateProofTransaction?: TransactionStateProof;
        txType?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): Transaction;
}
/**
 * Fields for application transactions.
 * Definition:
 * data/transactions/application.go : ApplicationCallTxnFields
 */
export declare class TransactionApplication extends BaseModel {
    /**
     * (apid) ID of the application being configured or empty if creating.
     */
    applicationId: number | bigint;
    /**
     * (apat) List of accounts in addition to the sender that may be accessed from the
     * application's approval-program and clear-state-program.
     */
    accounts?: string[];
    /**
     * (apaa) transaction specific arguments accessed from the application's
     * approval-program and clear-state-program.
     */
    applicationArgs?: Uint8Array[];
    /**
     * (apap) Logic executed for every application transaction, except when
     * on-completion is set to "clear". It can read and write global state for the
     * application, as well as account-specific local state. Approval programs may
     * reject the transaction.
     */
    approvalProgram?: Uint8Array;
    /**
     * (apsu) Logic executed for application transactions with on-completion set to
     * "clear". It can read and write global state for the application, as well as
     * account-specific local state. Clear state programs cannot reject the
     * transaction.
     */
    clearStateProgram?: Uint8Array;
    /**
     * (epp) specifies the additional app program len requested in pages.
     */
    extraProgramPages?: number | bigint;
    /**
     * (apfa) Lists the applications in addition to the application-id whose global
     * states may be accessed by this application's approval-program and
     * clear-state-program. The access is read-only.
     */
    foreignApps?: (number | bigint)[];
    /**
     * (apas) lists the assets whose parameters may be accessed by this application's
     * ApprovalProgram and ClearStateProgram. The access is read-only.
     */
    foreignAssets?: (number | bigint)[];
    /**
     * Represents a (apls) local-state or (apgs) global-state schema. These schemas
     * determine how much storage may be used in a local-state or global-state for an
     * application. The more space used, the larger minimum balance must be maintained
     * in the account holding the data.
     */
    globalStateSchema?: StateSchema;
    /**
     * Represents a (apls) local-state or (apgs) global-state schema. These schemas
     * determine how much storage may be used in a local-state or global-state for an
     * application. The more space used, the larger minimum balance must be maintained
     * in the account holding the data.
     */
    localStateSchema?: StateSchema;
    /**
     * (apan) defines the what additional actions occur with the transaction.
     * Valid types:
     * * noop
     * * optin
     * * closeout
     * * clear
     * * update
     * * update
     * * delete
     */
    onCompletion?: string;
    /**
     * Creates a new `TransactionApplication` object.
     * @param applicationId - (apid) ID of the application being configured or empty if creating.
     * @param accounts - (apat) List of accounts in addition to the sender that may be accessed from the
     * application's approval-program and clear-state-program.
     * @param applicationArgs - (apaa) transaction specific arguments accessed from the application's
     * approval-program and clear-state-program.
     * @param approvalProgram - (apap) Logic executed for every application transaction, except when
     * on-completion is set to "clear". It can read and write global state for the
     * application, as well as account-specific local state. Approval programs may
     * reject the transaction.
     * @param clearStateProgram - (apsu) Logic executed for application transactions with on-completion set to
     * "clear". It can read and write global state for the application, as well as
     * account-specific local state. Clear state programs cannot reject the
     * transaction.
     * @param extraProgramPages - (epp) specifies the additional app program len requested in pages.
     * @param foreignApps - (apfa) Lists the applications in addition to the application-id whose global
     * states may be accessed by this application's approval-program and
     * clear-state-program. The access is read-only.
     * @param foreignAssets - (apas) lists the assets whose parameters may be accessed by this application's
     * ApprovalProgram and ClearStateProgram. The access is read-only.
     * @param globalStateSchema - Represents a (apls) local-state or (apgs) global-state schema. These schemas
     * determine how much storage may be used in a local-state or global-state for an
     * application. The more space used, the larger minimum balance must be maintained
     * in the account holding the data.
     * @param localStateSchema - Represents a (apls) local-state or (apgs) global-state schema. These schemas
     * determine how much storage may be used in a local-state or global-state for an
     * application. The more space used, the larger minimum balance must be maintained
     * in the account holding the data.
     * @param onCompletion - (apan) defines the what additional actions occur with the transaction.
     * Valid types:
     * * noop
     * * optin
     * * closeout
     * * clear
     * * update
     * * update
     * * delete
     */
    constructor({ applicationId, accounts, applicationArgs, approvalProgram, clearStateProgram, extraProgramPages, foreignApps, foreignAssets, globalStateSchema, localStateSchema, onCompletion, }: {
        applicationId: number | bigint;
        accounts?: string[];
        applicationArgs?: Uint8Array[];
        approvalProgram?: string | Uint8Array;
        clearStateProgram?: string | Uint8Array;
        extraProgramPages?: number | bigint;
        foreignApps?: (number | bigint)[];
        foreignAssets?: (number | bigint)[];
        globalStateSchema?: StateSchema;
        localStateSchema?: StateSchema;
        onCompletion?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionApplication;
}
/**
 * Fields for asset allocation, re-configuration, and destruction.
 * A zero value for asset-id indicates asset creation.
 * A zero value for the params indicates asset destruction.
 * Definition:
 * data/transactions/asset.go : AssetConfigTxnFields
 */
export declare class TransactionAssetConfig extends BaseModel {
    /**
     * (xaid) ID of the asset being configured or empty if creating.
     */
    assetId?: number | bigint;
    /**
     * AssetParams specifies the parameters for an asset.
     * (apar) when part of an AssetConfig transaction.
     * Definition:
     * data/transactions/asset.go : AssetParams
     */
    params?: AssetParams;
    /**
     * Creates a new `TransactionAssetConfig` object.
     * @param assetId - (xaid) ID of the asset being configured or empty if creating.
     * @param params - AssetParams specifies the parameters for an asset.
     * (apar) when part of an AssetConfig transaction.
     * Definition:
     * data/transactions/asset.go : AssetParams
     */
    constructor({ assetId, params, }: {
        assetId?: number | bigint;
        params?: AssetParams;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionAssetConfig;
}
/**
 * Fields for an asset freeze transaction.
 * Definition:
 * data/transactions/asset.go : AssetFreezeTxnFields
 */
export declare class TransactionAssetFreeze extends BaseModel {
    /**
     * (fadd) Address of the account whose asset is being frozen or thawed.
     */
    address: string;
    /**
     * (faid) ID of the asset being frozen or thawed.
     */
    assetId: number | bigint;
    /**
     * (afrz) The new freeze status.
     */
    newFreezeStatus: boolean;
    /**
     * Creates a new `TransactionAssetFreeze` object.
     * @param address - (fadd) Address of the account whose asset is being frozen or thawed.
     * @param assetId - (faid) ID of the asset being frozen or thawed.
     * @param newFreezeStatus - (afrz) The new freeze status.
     */
    constructor({ address, assetId, newFreezeStatus, }: {
        address: string;
        assetId: number | bigint;
        newFreezeStatus: boolean;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionAssetFreeze;
}
/**
 * Fields for an asset transfer transaction.
 * Definition:
 * data/transactions/asset.go : AssetTransferTxnFields
 */
export declare class TransactionAssetTransfer extends BaseModel {
    /**
     * (aamt) Amount of asset to transfer. A zero amount transferred to self allocates
     * that asset in the account's Assets map.
     */
    amount: number | bigint;
    /**
     * (xaid) ID of the asset being transferred.
     */
    assetId: number | bigint;
    /**
     * (arcv) Recipient address of the transfer.
     */
    receiver: string;
    /**
     * Number of assets transfered to the close-to account as part of the transaction.
     */
    closeAmount?: number | bigint;
    /**
     * (aclose) Indicates that the asset should be removed from the account's Assets
     * map, and specifies where the remaining asset holdings should be transferred.
     * It's always valid to transfer remaining asset holdings to the creator account.
     */
    closeTo?: string;
    /**
     * (asnd) The effective sender during a clawback transactions. If this is not a
     * zero value, the real transaction sender must be the Clawback address from the
     * AssetParams.
     */
    sender?: string;
    /**
     * Creates a new `TransactionAssetTransfer` object.
     * @param amount - (aamt) Amount of asset to transfer. A zero amount transferred to self allocates
     * that asset in the account's Assets map.
     * @param assetId - (xaid) ID of the asset being transferred.
     * @param receiver - (arcv) Recipient address of the transfer.
     * @param closeAmount - Number of assets transfered to the close-to account as part of the transaction.
     * @param closeTo - (aclose) Indicates that the asset should be removed from the account's Assets
     * map, and specifies where the remaining asset holdings should be transferred.
     * It's always valid to transfer remaining asset holdings to the creator account.
     * @param sender - (asnd) The effective sender during a clawback transactions. If this is not a
     * zero value, the real transaction sender must be the Clawback address from the
     * AssetParams.
     */
    constructor({ amount, assetId, receiver, closeAmount, closeTo, sender, }: {
        amount: number | bigint;
        assetId: number | bigint;
        receiver: string;
        closeAmount?: number | bigint;
        closeTo?: string;
        sender?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionAssetTransfer;
}
/**
 * Fields for a keyreg transaction.
 * Definition:
 * data/transactions/keyreg.go : KeyregTxnFields
 */
export declare class TransactionKeyreg extends BaseModel {
    /**
     * (nonpart) Mark the account as participating or non-participating.
     */
    nonParticipation?: boolean;
    /**
     * (selkey) Public key used with the Verified Random Function (VRF) result during
     * committee selection.
     */
    selectionParticipationKey?: Uint8Array;
    /**
     * (sprfkey) State proof key used in key registration transactions.
     */
    stateProofKey?: Uint8Array;
    /**
     * (votefst) First round this participation key is valid.
     */
    voteFirstValid?: number | bigint;
    /**
     * (votekd) Number of subkeys in each batch of participation keys.
     */
    voteKeyDilution?: number | bigint;
    /**
     * (votelst) Last round this participation key is valid.
     */
    voteLastValid?: number | bigint;
    /**
     * (votekey) Participation public key used in key registration transactions.
     */
    voteParticipationKey?: Uint8Array;
    /**
     * Creates a new `TransactionKeyreg` object.
     * @param nonParticipation - (nonpart) Mark the account as participating or non-participating.
     * @param selectionParticipationKey - (selkey) Public key used with the Verified Random Function (VRF) result during
     * committee selection.
     * @param stateProofKey - (sprfkey) State proof key used in key registration transactions.
     * @param voteFirstValid - (votefst) First round this participation key is valid.
     * @param voteKeyDilution - (votekd) Number of subkeys in each batch of participation keys.
     * @param voteLastValid - (votelst) Last round this participation key is valid.
     * @param voteParticipationKey - (votekey) Participation public key used in key registration transactions.
     */
    constructor({ nonParticipation, selectionParticipationKey, stateProofKey, voteFirstValid, voteKeyDilution, voteLastValid, voteParticipationKey, }: {
        nonParticipation?: boolean;
        selectionParticipationKey?: string | Uint8Array;
        stateProofKey?: string | Uint8Array;
        voteFirstValid?: number | bigint;
        voteKeyDilution?: number | bigint;
        voteLastValid?: number | bigint;
        voteParticipationKey?: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionKeyreg;
}
/**
 * Fields for a payment transaction.
 * Definition:
 * data/transactions/payment.go : PaymentTxnFields
 */
export declare class TransactionPayment extends BaseModel {
    /**
     * (amt) number of MicroAlgos intended to be transferred.
     */
    amount: number | bigint;
    /**
     * (rcv) receiver's address.
     */
    receiver: string;
    /**
     * Number of MicroAlgos that were sent to the close-remainder-to address when
     * closing the sender account.
     */
    closeAmount?: number | bigint;
    /**
     * (close) when set, indicates that the sending account should be closed and all
     * remaining funds be transferred to this address.
     */
    closeRemainderTo?: string;
    /**
     * Creates a new `TransactionPayment` object.
     * @param amount - (amt) number of MicroAlgos intended to be transferred.
     * @param receiver - (rcv) receiver's address.
     * @param closeAmount - Number of MicroAlgos that were sent to the close-remainder-to address when
     * closing the sender account.
     * @param closeRemainderTo - (close) when set, indicates that the sending account should be closed and all
     * remaining funds be transferred to this address.
     */
    constructor({ amount, receiver, closeAmount, closeRemainderTo, }: {
        amount: number | bigint;
        receiver: string;
        closeAmount?: number | bigint;
        closeRemainderTo?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionPayment;
}
/**
 *
 */
export declare class TransactionResponse extends BaseModel {
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    /**
     * Contains all fields common to all transactions and serves as an envelope to all
     * transactions type. Represents both regular and inner transactions.
     * Definition:
     * data/transactions/signedtxn.go : SignedTxn
     * data/transactions/transaction.go : Transaction
     */
    transaction: Transaction;
    /**
     * Creates a new `TransactionResponse` object.
     * @param currentRound - Round at which the results were computed.
     * @param transaction - Contains all fields common to all transactions and serves as an envelope to all
     * transactions type. Represents both regular and inner transactions.
     * Definition:
     * data/transactions/signedtxn.go : SignedTxn
     * data/transactions/transaction.go : Transaction
     */
    constructor({ currentRound, transaction, }: {
        currentRound: number | bigint;
        transaction: Transaction;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionResponse;
}
/**
 * Validation signature associated with some data. Only one of the signatures
 * should be provided.
 */
export declare class TransactionSignature extends BaseModel {
    /**
     * (lsig) Programatic transaction signature.
     * Definition:
     * data/transactions/logicsig.go
     */
    logicsig?: TransactionSignatureLogicsig;
    /**
     * (msig) structure holding multiple subsignatures.
     * Definition:
     * crypto/multisig.go : MultisigSig
     */
    multisig?: TransactionSignatureMultisig;
    /**
     * (sig) Standard ed25519 signature.
     */
    sig?: Uint8Array;
    /**
     * Creates a new `TransactionSignature` object.
     * @param logicsig - (lsig) Programatic transaction signature.
     * Definition:
     * data/transactions/logicsig.go
     * @param multisig - (msig) structure holding multiple subsignatures.
     * Definition:
     * crypto/multisig.go : MultisigSig
     * @param sig - (sig) Standard ed25519 signature.
     */
    constructor({ logicsig, multisig, sig, }: {
        logicsig?: TransactionSignatureLogicsig;
        multisig?: TransactionSignatureMultisig;
        sig?: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionSignature;
}
/**
 * (lsig) Programatic transaction signature.
 * Definition:
 * data/transactions/logicsig.go
 */
export declare class TransactionSignatureLogicsig extends BaseModel {
    /**
     * (l) Program signed by a signature or multi signature, or hashed to be the
     * address of ana ccount. Base64 encoded TEAL program.
     */
    logic: Uint8Array;
    /**
     * (arg) Logic arguments, base64 encoded.
     */
    args?: Uint8Array[];
    /**
     * (msig) structure holding multiple subsignatures.
     * Definition:
     * crypto/multisig.go : MultisigSig
     */
    multisigSignature?: TransactionSignatureMultisig;
    /**
     * (sig) ed25519 signature.
     */
    signature?: Uint8Array;
    /**
     * Creates a new `TransactionSignatureLogicsig` object.
     * @param logic - (l) Program signed by a signature or multi signature, or hashed to be the
     * address of ana ccount. Base64 encoded TEAL program.
     * @param args - (arg) Logic arguments, base64 encoded.
     * @param multisigSignature - (msig) structure holding multiple subsignatures.
     * Definition:
     * crypto/multisig.go : MultisigSig
     * @param signature - (sig) ed25519 signature.
     */
    constructor({ logic, args, multisigSignature, signature, }: {
        logic: string | Uint8Array;
        args?: Uint8Array[];
        multisigSignature?: TransactionSignatureMultisig;
        signature?: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionSignatureLogicsig;
}
/**
 * (msig) structure holding multiple subsignatures.
 * Definition:
 * crypto/multisig.go : MultisigSig
 */
export declare class TransactionSignatureMultisig extends BaseModel {
    /**
     * (subsig) holds pairs of public key and signatures.
     */
    subsignature?: TransactionSignatureMultisigSubsignature[];
    /**
     * (thr)
     */
    threshold?: number | bigint;
    /**
     * (v)
     */
    version?: number | bigint;
    /**
     * Creates a new `TransactionSignatureMultisig` object.
     * @param subsignature - (subsig) holds pairs of public key and signatures.
     * @param threshold - (thr)
     * @param version - (v)
     */
    constructor({ subsignature, threshold, version, }: {
        subsignature?: TransactionSignatureMultisigSubsignature[];
        threshold?: number | bigint;
        version?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionSignatureMultisig;
}
export declare class TransactionSignatureMultisigSubsignature extends BaseModel {
    /**
     * (pk)
     */
    publicKey?: Uint8Array;
    /**
     * (s)
     */
    signature?: Uint8Array;
    /**
     * Creates a new `TransactionSignatureMultisigSubsignature` object.
     * @param publicKey - (pk)
     * @param signature - (s)
     */
    constructor({ publicKey, signature, }: {
        publicKey?: string | Uint8Array;
        signature?: string | Uint8Array;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionSignatureMultisigSubsignature;
}
/**
 * Fields for a state proof transaction.
 * Definition:
 * data/transactions/stateproof.go : StateProofTxnFields
 */
export declare class TransactionStateProof extends BaseModel {
    /**
     * (spmsg)
     */
    message?: IndexerStateProofMessage;
    /**
     * (sp) represents a state proof.
     * Definition:
     * crypto/stateproof/structs.go : StateProof
     */
    stateProof?: StateProofFields;
    /**
     * (sptype) Type of the state proof. Integer representing an entry defined in
     * protocol/stateproof.go
     */
    stateProofType?: number | bigint;
    /**
     * Creates a new `TransactionStateProof` object.
     * @param message - (spmsg)
     * @param stateProof - (sp) represents a state proof.
     * Definition:
     * crypto/stateproof/structs.go : StateProof
     * @param stateProofType - (sptype) Type of the state proof. Integer representing an entry defined in
     * protocol/stateproof.go
     */
    constructor({ message, stateProof, stateProofType, }: {
        message?: IndexerStateProofMessage;
        stateProof?: StateProofFields;
        stateProofType?: number | bigint;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionStateProof;
}
/**
 *
 */
export declare class TransactionsResponse extends BaseModel {
    /**
     * Round at which the results were computed.
     */
    currentRound: number | bigint;
    transactions: Transaction[];
    /**
     * Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    nextToken?: string;
    /**
     * Creates a new `TransactionsResponse` object.
     * @param currentRound - Round at which the results were computed.
     * @param transactions -
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ currentRound, transactions, nextToken, }: {
        currentRound: number | bigint;
        transactions: Transaction[];
        nextToken?: string;
    });
    static from_obj_for_encoding(data: Record<string, any>): TransactionsResponse;
}
