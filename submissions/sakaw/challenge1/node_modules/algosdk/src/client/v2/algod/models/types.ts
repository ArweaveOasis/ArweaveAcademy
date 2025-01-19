/**
 * NOTICE: This file was generated. Editing this file manually is not recommended.
 */

/* eslint-disable no-use-before-define */
import BaseModel from '../../basemodel';
import { EncodedSignedTransaction } from '../../../../types/transactions/encoded';
import BlockHeader from '../../../../types/blockHeader';

/**
 * Account information at a given round.
 * Definition:
 * data/basics/userBalance.go : AccountData
 */
export class Account extends BaseModel {
  /**
   * the account public key
   */
  public address: string;

  /**
   * (algo) total number of MicroAlgos in the account
   */
  public amount: number | bigint;

  /**
   * specifies the amount of MicroAlgos in the account, without the pending rewards.
   */
  public amountWithoutPendingRewards: number | bigint;

  /**
   * MicroAlgo balance required by the account.
   * The requirement grows based on asset and application usage.
   */
  public minBalance: number | bigint;

  /**
   * amount of MicroAlgos of pending rewards in this account.
   */
  public pendingRewards: number | bigint;

  /**
   * (ern) total rewards of MicroAlgos the account has received, including pending
   * rewards.
   */
  public rewards: number | bigint;

  /**
   * The round for which this information is relevant.
   */
  public round: number | bigint;

  /**
   * (onl) delegation status of the account's MicroAlgos
   * * Offline - indicates that the associated account is delegated.
   * * Online - indicates that the associated account used as part of the delegation
   * pool.
   * * NotParticipating - indicates that the associated account is neither a
   * delegator nor a delegate.
   */
  public status: string;

  /**
   * The count of all applications that have been opted in, equivalent to the count
   * of application local data (AppLocalState objects) stored in this account.
   */
  public totalAppsOptedIn: number | bigint;

  /**
   * The count of all assets that have been opted in, equivalent to the count of
   * AssetHolding objects held by this account.
   */
  public totalAssetsOptedIn: number | bigint;

  /**
   * The count of all apps (AppParams objects) created by this account.
   */
  public totalCreatedApps: number | bigint;

  /**
   * The count of all assets (AssetParams objects) created by this account.
   */
  public totalCreatedAssets: number | bigint;

  /**
   * (appl) applications local data stored in this account.
   * Note the raw object uses `map[int] -> AppLocalState` for this type.
   */
  public appsLocalState?: ApplicationLocalState[];

  /**
   * (teap) the sum of all extra application program pages for this account.
   */
  public appsTotalExtraPages?: number | bigint;

  /**
   * (tsch) stores the sum of all of the local schemas and global schemas in this
   * account.
   * Note: the raw account uses `StateSchema` for this type.
   */
  public appsTotalSchema?: ApplicationStateSchema;

  /**
   * (asset) assets held by this account.
   * Note the raw object uses `map[int] -> AssetHolding` for this type.
   */
  public assets?: AssetHolding[];

  /**
   * (spend) the address against which signing should be checked. If empty, the
   * address of the current account is used. This field can be updated in any
   * transaction by setting the RekeyTo field.
   */
  public authAddr?: string;

  /**
   * (appp) parameters of applications created by this account including app global
   * data.
   * Note: the raw account uses `map[int] -> AppParams` for this type.
   */
  public createdApps?: Application[];

  /**
   * (apar) parameters of assets created by this account.
   * Note: the raw account uses `map[int] -> Asset` for this type.
   */
  public createdAssets?: Asset[];

  /**
   * AccountParticipation describes the parameters used by this account in consensus
   * protocol.
   */
  public participation?: AccountParticipation;

  /**
   * (ebase) used as part of the rewards computation. Only applicable to accounts
   * which are participating.
   */
  public rewardBase?: number | bigint;

  /**
   * Indicates what type of signature is used by this account, must be one of:
   * * sig
   * * msig
   * * lsig
   */
  public sigType?: string;

  /**
   * (tbxb) The total number of bytes used by this account's app's box keys and
   * values.
   */
  public totalBoxBytes?: number | bigint;

  /**
   * (tbx) The number of existing boxes created by this account's app.
   */
  public totalBoxes?: number | bigint;

  /**
   * Creates a new `Account` object.
   * @param address - the account public key
   * @param amount - (algo) total number of MicroAlgos in the account
   * @param amountWithoutPendingRewards - specifies the amount of MicroAlgos in the account, without the pending rewards.
   * @param minBalance - MicroAlgo balance required by the account.
   * The requirement grows based on asset and application usage.
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
   * @param createdApps - (appp) parameters of applications created by this account including app global
   * data.
   * Note: the raw account uses `map[int] -> AppParams` for this type.
   * @param createdAssets - (apar) parameters of assets created by this account.
   * Note: the raw account uses `map[int] -> Asset` for this type.
   * @param participation - AccountParticipation describes the parameters used by this account in consensus
   * protocol.
   * @param rewardBase - (ebase) used as part of the rewards computation. Only applicable to accounts
   * which are participating.
   * @param sigType - Indicates what type of signature is used by this account, must be one of:
   * * sig
   * * msig
   * * lsig
   * @param totalBoxBytes - (tbxb) The total number of bytes used by this account's app's box keys and
   * values.
   * @param totalBoxes - (tbx) The number of existing boxes created by this account's app.
   */
  constructor({
    address,
    amount,
    amountWithoutPendingRewards,
    minBalance,
    pendingRewards,
    rewards,
    round,
    status,
    totalAppsOptedIn,
    totalAssetsOptedIn,
    totalCreatedApps,
    totalCreatedAssets,
    appsLocalState,
    appsTotalExtraPages,
    appsTotalSchema,
    assets,
    authAddr,
    createdApps,
    createdAssets,
    participation,
    rewardBase,
    sigType,
    totalBoxBytes,
    totalBoxes,
  }: {
    address: string;
    amount: number | bigint;
    amountWithoutPendingRewards: number | bigint;
    minBalance: number | bigint;
    pendingRewards: number | bigint;
    rewards: number | bigint;
    round: number | bigint;
    status: string;
    totalAppsOptedIn: number | bigint;
    totalAssetsOptedIn: number | bigint;
    totalCreatedApps: number | bigint;
    totalCreatedAssets: number | bigint;
    appsLocalState?: ApplicationLocalState[];
    appsTotalExtraPages?: number | bigint;
    appsTotalSchema?: ApplicationStateSchema;
    assets?: AssetHolding[];
    authAddr?: string;
    createdApps?: Application[];
    createdAssets?: Asset[];
    participation?: AccountParticipation;
    rewardBase?: number | bigint;
    sigType?: string;
    totalBoxBytes?: number | bigint;
    totalBoxes?: number | bigint;
  }) {
    super();
    this.address = address;
    this.amount = amount;
    this.amountWithoutPendingRewards = amountWithoutPendingRewards;
    this.minBalance = minBalance;
    this.pendingRewards = pendingRewards;
    this.rewards = rewards;
    this.round = round;
    this.status = status;
    this.totalAppsOptedIn = totalAppsOptedIn;
    this.totalAssetsOptedIn = totalAssetsOptedIn;
    this.totalCreatedApps = totalCreatedApps;
    this.totalCreatedAssets = totalCreatedAssets;
    this.appsLocalState = appsLocalState;
    this.appsTotalExtraPages = appsTotalExtraPages;
    this.appsTotalSchema = appsTotalSchema;
    this.assets = assets;
    this.authAddr = authAddr;
    this.createdApps = createdApps;
    this.createdAssets = createdAssets;
    this.participation = participation;
    this.rewardBase = rewardBase;
    this.sigType = sigType;
    this.totalBoxBytes = totalBoxBytes;
    this.totalBoxes = totalBoxes;

    this.attribute_map = {
      address: 'address',
      amount: 'amount',
      amountWithoutPendingRewards: 'amount-without-pending-rewards',
      minBalance: 'min-balance',
      pendingRewards: 'pending-rewards',
      rewards: 'rewards',
      round: 'round',
      status: 'status',
      totalAppsOptedIn: 'total-apps-opted-in',
      totalAssetsOptedIn: 'total-assets-opted-in',
      totalCreatedApps: 'total-created-apps',
      totalCreatedAssets: 'total-created-assets',
      appsLocalState: 'apps-local-state',
      appsTotalExtraPages: 'apps-total-extra-pages',
      appsTotalSchema: 'apps-total-schema',
      assets: 'assets',
      authAddr: 'auth-addr',
      createdApps: 'created-apps',
      createdAssets: 'created-assets',
      participation: 'participation',
      rewardBase: 'reward-base',
      sigType: 'sig-type',
      totalBoxBytes: 'total-box-bytes',
      totalBoxes: 'total-boxes',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): Account {
    /* eslint-disable dot-notation */
    if (typeof data['address'] === 'undefined')
      throw new Error(`Response is missing required field 'address': ${data}`);
    if (typeof data['amount'] === 'undefined')
      throw new Error(`Response is missing required field 'amount': ${data}`);
    if (typeof data['amount-without-pending-rewards'] === 'undefined')
      throw new Error(
        `Response is missing required field 'amount-without-pending-rewards': ${data}`
      );
    if (typeof data['min-balance'] === 'undefined')
      throw new Error(
        `Response is missing required field 'min-balance': ${data}`
      );
    if (typeof data['pending-rewards'] === 'undefined')
      throw new Error(
        `Response is missing required field 'pending-rewards': ${data}`
      );
    if (typeof data['rewards'] === 'undefined')
      throw new Error(`Response is missing required field 'rewards': ${data}`);
    if (typeof data['round'] === 'undefined')
      throw new Error(`Response is missing required field 'round': ${data}`);
    if (typeof data['status'] === 'undefined')
      throw new Error(`Response is missing required field 'status': ${data}`);
    if (typeof data['total-apps-opted-in'] === 'undefined')
      throw new Error(
        `Response is missing required field 'total-apps-opted-in': ${data}`
      );
    if (typeof data['total-assets-opted-in'] === 'undefined')
      throw new Error(
        `Response is missing required field 'total-assets-opted-in': ${data}`
      );
    if (typeof data['total-created-apps'] === 'undefined')
      throw new Error(
        `Response is missing required field 'total-created-apps': ${data}`
      );
    if (typeof data['total-created-assets'] === 'undefined')
      throw new Error(
        `Response is missing required field 'total-created-assets': ${data}`
      );
    return new Account({
      address: data['address'],
      amount: data['amount'],
      amountWithoutPendingRewards: data['amount-without-pending-rewards'],
      minBalance: data['min-balance'],
      pendingRewards: data['pending-rewards'],
      rewards: data['rewards'],
      round: data['round'],
      status: data['status'],
      totalAppsOptedIn: data['total-apps-opted-in'],
      totalAssetsOptedIn: data['total-assets-opted-in'],
      totalCreatedApps: data['total-created-apps'],
      totalCreatedAssets: data['total-created-assets'],
      appsLocalState:
        typeof data['apps-local-state'] !== 'undefined'
          ? data['apps-local-state'].map(
              ApplicationLocalState.from_obj_for_encoding
            )
          : undefined,
      appsTotalExtraPages: data['apps-total-extra-pages'],
      appsTotalSchema:
        typeof data['apps-total-schema'] !== 'undefined'
          ? ApplicationStateSchema.from_obj_for_encoding(
              data['apps-total-schema']
            )
          : undefined,
      assets:
        typeof data['assets'] !== 'undefined'
          ? data['assets'].map(AssetHolding.from_obj_for_encoding)
          : undefined,
      authAddr: data['auth-addr'],
      createdApps:
        typeof data['created-apps'] !== 'undefined'
          ? data['created-apps'].map(Application.from_obj_for_encoding)
          : undefined,
      createdAssets:
        typeof data['created-assets'] !== 'undefined'
          ? data['created-assets'].map(Asset.from_obj_for_encoding)
          : undefined,
      participation:
        typeof data['participation'] !== 'undefined'
          ? AccountParticipation.from_obj_for_encoding(data['participation'])
          : undefined,
      rewardBase: data['reward-base'],
      sigType: data['sig-type'],
      totalBoxBytes: data['total-box-bytes'],
      totalBoxes: data['total-boxes'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * AccountApplicationResponse describes the account's application local state and
 * global state (AppLocalState and AppParams, if either exists) for a specific
 * application ID. Global state will only be returned if the provided address is
 * the application's creator.
 */
export class AccountApplicationResponse extends BaseModel {
  /**
   * The round for which this information is relevant.
   */
  public round: number | bigint;

  /**
   * (appl) the application local data stored in this account.
   * The raw account uses `AppLocalState` for this type.
   */
  public appLocalState?: ApplicationLocalState;

  /**
   * (appp) parameters of the application created by this account including app
   * global data.
   * The raw account uses `AppParams` for this type.
   */
  public createdApp?: ApplicationParams;

  /**
   * Creates a new `AccountApplicationResponse` object.
   * @param round - The round for which this information is relevant.
   * @param appLocalState - (appl) the application local data stored in this account.
   * The raw account uses `AppLocalState` for this type.
   * @param createdApp - (appp) parameters of the application created by this account including app
   * global data.
   * The raw account uses `AppParams` for this type.
   */
  constructor(
    round: number | bigint,
    appLocalState?: ApplicationLocalState,
    createdApp?: ApplicationParams
  ) {
    super();
    this.round = round;
    this.appLocalState = appLocalState;
    this.createdApp = createdApp;

    this.attribute_map = {
      round: 'round',
      appLocalState: 'app-local-state',
      createdApp: 'created-app',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): AccountApplicationResponse {
    /* eslint-disable dot-notation */
    if (typeof data['round'] === 'undefined')
      throw new Error(`Response is missing required field 'round': ${data}`);
    return new AccountApplicationResponse(
      data['round'],
      typeof data['app-local-state'] !== 'undefined'
        ? ApplicationLocalState.from_obj_for_encoding(data['app-local-state'])
        : undefined,
      typeof data['created-app'] !== 'undefined'
        ? ApplicationParams.from_obj_for_encoding(data['created-app'])
        : undefined
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * AccountAssetResponse describes the account's asset holding and asset parameters
 * (if either exist) for a specific asset ID. Asset parameters will only be
 * returned if the provided address is the asset's creator.
 */
export class AccountAssetResponse extends BaseModel {
  /**
   * The round for which this information is relevant.
   */
  public round: number | bigint;

  /**
   * (asset) Details about the asset held by this account.
   * The raw account uses `AssetHolding` for this type.
   */
  public assetHolding?: AssetHolding;

  /**
   * (apar) parameters of the asset created by this account.
   * The raw account uses `AssetParams` for this type.
   */
  public createdAsset?: AssetParams;

  /**
   * Creates a new `AccountAssetResponse` object.
   * @param round - The round for which this information is relevant.
   * @param assetHolding - (asset) Details about the asset held by this account.
   * The raw account uses `AssetHolding` for this type.
   * @param createdAsset - (apar) parameters of the asset created by this account.
   * The raw account uses `AssetParams` for this type.
   */
  constructor(
    round: number | bigint,
    assetHolding?: AssetHolding,
    createdAsset?: AssetParams
  ) {
    super();
    this.round = round;
    this.assetHolding = assetHolding;
    this.createdAsset = createdAsset;

    this.attribute_map = {
      round: 'round',
      assetHolding: 'asset-holding',
      createdAsset: 'created-asset',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): AccountAssetResponse {
    /* eslint-disable dot-notation */
    if (typeof data['round'] === 'undefined')
      throw new Error(`Response is missing required field 'round': ${data}`);
    return new AccountAssetResponse(
      data['round'],
      typeof data['asset-holding'] !== 'undefined'
        ? AssetHolding.from_obj_for_encoding(data['asset-holding'])
        : undefined,
      typeof data['created-asset'] !== 'undefined'
        ? AssetParams.from_obj_for_encoding(data['created-asset'])
        : undefined
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * AccountParticipation describes the parameters used by this account in consensus
 * protocol.
 */
export class AccountParticipation extends BaseModel {
  /**
   * (sel) Selection public key (if any) currently registered for this round.
   */
  public selectionParticipationKey: Uint8Array;

  /**
   * (voteFst) First round for which this participation is valid.
   */
  public voteFirstValid: number | bigint;

  /**
   * (voteKD) Number of subkeys in each batch of participation keys.
   */
  public voteKeyDilution: number | bigint;

  /**
   * (voteLst) Last round for which this participation is valid.
   */
  public voteLastValid: number | bigint;

  /**
   * (vote) root participation public key (if any) currently registered for this
   * round.
   */
  public voteParticipationKey: Uint8Array;

  /**
   * (stprf) Root of the state proof key (if any)
   */
  public stateProofKey?: Uint8Array;

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
  constructor({
    selectionParticipationKey,
    voteFirstValid,
    voteKeyDilution,
    voteLastValid,
    voteParticipationKey,
    stateProofKey,
  }: {
    selectionParticipationKey: string | Uint8Array;
    voteFirstValid: number | bigint;
    voteKeyDilution: number | bigint;
    voteLastValid: number | bigint;
    voteParticipationKey: string | Uint8Array;
    stateProofKey?: string | Uint8Array;
  }) {
    super();
    this.selectionParticipationKey =
      typeof selectionParticipationKey === 'string'
        ? new Uint8Array(Buffer.from(selectionParticipationKey, 'base64'))
        : selectionParticipationKey;
    this.voteFirstValid = voteFirstValid;
    this.voteKeyDilution = voteKeyDilution;
    this.voteLastValid = voteLastValid;
    this.voteParticipationKey =
      typeof voteParticipationKey === 'string'
        ? new Uint8Array(Buffer.from(voteParticipationKey, 'base64'))
        : voteParticipationKey;
    this.stateProofKey =
      typeof stateProofKey === 'string'
        ? new Uint8Array(Buffer.from(stateProofKey, 'base64'))
        : stateProofKey;

    this.attribute_map = {
      selectionParticipationKey: 'selection-participation-key',
      voteFirstValid: 'vote-first-valid',
      voteKeyDilution: 'vote-key-dilution',
      voteLastValid: 'vote-last-valid',
      voteParticipationKey: 'vote-participation-key',
      stateProofKey: 'state-proof-key',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): AccountParticipation {
    /* eslint-disable dot-notation */
    if (typeof data['selection-participation-key'] === 'undefined')
      throw new Error(
        `Response is missing required field 'selection-participation-key': ${data}`
      );
    if (typeof data['vote-first-valid'] === 'undefined')
      throw new Error(
        `Response is missing required field 'vote-first-valid': ${data}`
      );
    if (typeof data['vote-key-dilution'] === 'undefined')
      throw new Error(
        `Response is missing required field 'vote-key-dilution': ${data}`
      );
    if (typeof data['vote-last-valid'] === 'undefined')
      throw new Error(
        `Response is missing required field 'vote-last-valid': ${data}`
      );
    if (typeof data['vote-participation-key'] === 'undefined')
      throw new Error(
        `Response is missing required field 'vote-participation-key': ${data}`
      );
    return new AccountParticipation({
      selectionParticipationKey: data['selection-participation-key'],
      voteFirstValid: data['vote-first-valid'],
      voteKeyDilution: data['vote-key-dilution'],
      voteLastValid: data['vote-last-valid'],
      voteParticipationKey: data['vote-participation-key'],
      stateProofKey: data['state-proof-key'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * Application state delta.
 */
export class AccountStateDelta extends BaseModel {
  public address: string;

  /**
   * Application state delta.
   */
  public delta: EvalDeltaKeyValue[];

  /**
   * Creates a new `AccountStateDelta` object.
   * @param address -
   * @param delta - Application state delta.
   */
  constructor(address: string, delta: EvalDeltaKeyValue[]) {
    super();
    this.address = address;
    this.delta = delta;

    this.attribute_map = {
      address: 'address',
      delta: 'delta',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): AccountStateDelta {
    /* eslint-disable dot-notation */
    if (typeof data['address'] === 'undefined')
      throw new Error(`Response is missing required field 'address': ${data}`);
    if (!Array.isArray(data['delta']))
      throw new Error(
        `Response is missing required array field 'delta': ${data}`
      );
    return new AccountStateDelta(
      data['address'],
      data['delta'].map(EvalDeltaKeyValue.from_obj_for_encoding)
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * Application index and its parameters
 */
export class Application extends BaseModel {
  /**
   * (appidx) application index.
   */
  public id: number | bigint;

  /**
   * (appparams) application parameters.
   */
  public params: ApplicationParams;

  /**
   * Creates a new `Application` object.
   * @param id - (appidx) application index.
   * @param params - (appparams) application parameters.
   */
  constructor(id: number | bigint, params: ApplicationParams) {
    super();
    this.id = id;
    this.params = params;

    this.attribute_map = {
      id: 'id',
      params: 'params',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): Application {
    /* eslint-disable dot-notation */
    if (typeof data['id'] === 'undefined')
      throw new Error(`Response is missing required field 'id': ${data}`);
    if (typeof data['params'] === 'undefined')
      throw new Error(`Response is missing required field 'params': ${data}`);
    return new Application(
      data['id'],
      ApplicationParams.from_obj_for_encoding(data['params'])
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * Stores local state associated with an application.
 */
export class ApplicationLocalState extends BaseModel {
  /**
   * The application which this local state is for.
   */
  public id: number | bigint;

  /**
   * (hsch) schema.
   */
  public schema: ApplicationStateSchema;

  /**
   * (tkv) storage.
   */
  public keyValue?: TealKeyValue[];

  /**
   * Creates a new `ApplicationLocalState` object.
   * @param id - The application which this local state is for.
   * @param schema - (hsch) schema.
   * @param keyValue - (tkv) storage.
   */
  constructor(
    id: number | bigint,
    schema: ApplicationStateSchema,
    keyValue?: TealKeyValue[]
  ) {
    super();
    this.id = id;
    this.schema = schema;
    this.keyValue = keyValue;

    this.attribute_map = {
      id: 'id',
      schema: 'schema',
      keyValue: 'key-value',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): ApplicationLocalState {
    /* eslint-disable dot-notation */
    if (typeof data['id'] === 'undefined')
      throw new Error(`Response is missing required field 'id': ${data}`);
    if (typeof data['schema'] === 'undefined')
      throw new Error(`Response is missing required field 'schema': ${data}`);
    return new ApplicationLocalState(
      data['id'],
      ApplicationStateSchema.from_obj_for_encoding(data['schema']),
      typeof data['key-value'] !== 'undefined'
        ? data['key-value'].map(TealKeyValue.from_obj_for_encoding)
        : undefined
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * Stores the global information associated with an application.
 */
export class ApplicationParams extends BaseModel {
  /**
   * (approv) approval program.
   */
  public approvalProgram: Uint8Array;

  /**
   * (clearp) approval program.
   */
  public clearStateProgram: Uint8Array;

  /**
   * The address that created this application. This is the address where the
   * parameters and global state for this application can be found.
   */
  public creator: string;

  /**
   * (epp) the amount of extra program pages available to this app.
   */
  public extraProgramPages?: number | bigint;

  /**
   * [\gs) global schema
   */
  public globalState?: TealKeyValue[];

  /**
   * [\gsch) global schema
   */
  public globalStateSchema?: ApplicationStateSchema;

  /**
   * [\lsch) local schema
   */
  public localStateSchema?: ApplicationStateSchema;

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
  constructor({
    approvalProgram,
    clearStateProgram,
    creator,
    extraProgramPages,
    globalState,
    globalStateSchema,
    localStateSchema,
  }: {
    approvalProgram: string | Uint8Array;
    clearStateProgram: string | Uint8Array;
    creator: string;
    extraProgramPages?: number | bigint;
    globalState?: TealKeyValue[];
    globalStateSchema?: ApplicationStateSchema;
    localStateSchema?: ApplicationStateSchema;
  }) {
    super();
    this.approvalProgram =
      typeof approvalProgram === 'string'
        ? new Uint8Array(Buffer.from(approvalProgram, 'base64'))
        : approvalProgram;
    this.clearStateProgram =
      typeof clearStateProgram === 'string'
        ? new Uint8Array(Buffer.from(clearStateProgram, 'base64'))
        : clearStateProgram;
    this.creator = creator;
    this.extraProgramPages = extraProgramPages;
    this.globalState = globalState;
    this.globalStateSchema = globalStateSchema;
    this.localStateSchema = localStateSchema;

    this.attribute_map = {
      approvalProgram: 'approval-program',
      clearStateProgram: 'clear-state-program',
      creator: 'creator',
      extraProgramPages: 'extra-program-pages',
      globalState: 'global-state',
      globalStateSchema: 'global-state-schema',
      localStateSchema: 'local-state-schema',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): ApplicationParams {
    /* eslint-disable dot-notation */
    if (typeof data['approval-program'] === 'undefined')
      throw new Error(
        `Response is missing required field 'approval-program': ${data}`
      );
    if (typeof data['clear-state-program'] === 'undefined')
      throw new Error(
        `Response is missing required field 'clear-state-program': ${data}`
      );
    if (typeof data['creator'] === 'undefined')
      throw new Error(`Response is missing required field 'creator': ${data}`);
    return new ApplicationParams({
      approvalProgram: data['approval-program'],
      clearStateProgram: data['clear-state-program'],
      creator: data['creator'],
      extraProgramPages: data['extra-program-pages'],
      globalState:
        typeof data['global-state'] !== 'undefined'
          ? data['global-state'].map(TealKeyValue.from_obj_for_encoding)
          : undefined,
      globalStateSchema:
        typeof data['global-state-schema'] !== 'undefined'
          ? ApplicationStateSchema.from_obj_for_encoding(
              data['global-state-schema']
            )
          : undefined,
      localStateSchema:
        typeof data['local-state-schema'] !== 'undefined'
          ? ApplicationStateSchema.from_obj_for_encoding(
              data['local-state-schema']
            )
          : undefined,
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * Specifies maximums on the number of each type that may be stored.
 */
export class ApplicationStateSchema extends BaseModel {
  /**
   * (nui) num of uints.
   */
  public numUint: number | bigint;

  /**
   * (nbs) num of byte slices.
   */
  public numByteSlice: number | bigint;

  /**
   * Creates a new `ApplicationStateSchema` object.
   * @param numUint - (nui) num of uints.
   * @param numByteSlice - (nbs) num of byte slices.
   */
  constructor(numUint: number | bigint, numByteSlice: number | bigint) {
    super();
    this.numUint = numUint;
    this.numByteSlice = numByteSlice;

    this.attribute_map = {
      numUint: 'num-uint',
      numByteSlice: 'num-byte-slice',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): ApplicationStateSchema {
    /* eslint-disable dot-notation */
    if (typeof data['num-uint'] === 'undefined')
      throw new Error(`Response is missing required field 'num-uint': ${data}`);
    if (typeof data['num-byte-slice'] === 'undefined')
      throw new Error(
        `Response is missing required field 'num-byte-slice': ${data}`
      );
    return new ApplicationStateSchema(data['num-uint'], data['num-byte-slice']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Specifies both the unique identifier and the parameters for an asset
 */
export class Asset extends BaseModel {
  /**
   * unique asset identifier
   */
  public index: number | bigint;

  /**
   * AssetParams specifies the parameters for an asset.
   * (apar) when part of an AssetConfig transaction.
   * Definition:
   * data/transactions/asset.go : AssetParams
   */
  public params: AssetParams;

  /**
   * Creates a new `Asset` object.
   * @param index - unique asset identifier
   * @param params - AssetParams specifies the parameters for an asset.
   * (apar) when part of an AssetConfig transaction.
   * Definition:
   * data/transactions/asset.go : AssetParams
   */
  constructor(index: number | bigint, params: AssetParams) {
    super();
    this.index = index;
    this.params = params;

    this.attribute_map = {
      index: 'index',
      params: 'params',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): Asset {
    /* eslint-disable dot-notation */
    if (typeof data['index'] === 'undefined')
      throw new Error(`Response is missing required field 'index': ${data}`);
    if (typeof data['params'] === 'undefined')
      throw new Error(`Response is missing required field 'params': ${data}`);
    return new Asset(
      data['index'],
      AssetParams.from_obj_for_encoding(data['params'])
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * Describes an asset held by an account.
 * Definition:
 * data/basics/userBalance.go : AssetHolding
 */
export class AssetHolding extends BaseModel {
  /**
   * (a) number of units held.
   */
  public amount: number | bigint;

  /**
   * Asset ID of the holding.
   */
  public assetId: number | bigint;

  /**
   * (f) whether or not the holding is frozen.
   */
  public isFrozen: boolean;

  /**
   * Creates a new `AssetHolding` object.
   * @param amount - (a) number of units held.
   * @param assetId - Asset ID of the holding.
   * @param isFrozen - (f) whether or not the holding is frozen.
   */
  constructor(
    amount: number | bigint,
    assetId: number | bigint,
    isFrozen: boolean
  ) {
    super();
    this.amount = amount;
    this.assetId = assetId;
    this.isFrozen = isFrozen;

    this.attribute_map = {
      amount: 'amount',
      assetId: 'asset-id',
      isFrozen: 'is-frozen',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): AssetHolding {
    /* eslint-disable dot-notation */
    if (typeof data['amount'] === 'undefined')
      throw new Error(`Response is missing required field 'amount': ${data}`);
    if (typeof data['asset-id'] === 'undefined')
      throw new Error(`Response is missing required field 'asset-id': ${data}`);
    if (typeof data['is-frozen'] === 'undefined')
      throw new Error(
        `Response is missing required field 'is-frozen': ${data}`
      );
    return new AssetHolding(
      data['amount'],
      data['asset-id'],
      data['is-frozen']
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * AssetParams specifies the parameters for an asset.
 * (apar) when part of an AssetConfig transaction.
 * Definition:
 * data/transactions/asset.go : AssetParams
 */
export class AssetParams extends BaseModel {
  /**
   * The address that created this asset. This is the address where the parameters
   * for this asset can be found, and also the address where unwanted asset units can
   * be sent in the worst case.
   */
  public creator: string;

  /**
   * (dc) The number of digits to use after the decimal point when displaying this
   * asset. If 0, the asset is not divisible. If 1, the base unit of the asset is in
   * tenths. If 2, the base unit of the asset is in hundredths, and so on. This value
   * must be between 0 and 19 (inclusive).
   */
  public decimals: number | bigint;

  /**
   * (t) The total number of units of this asset.
   */
  public total: number | bigint;

  /**
   * (c) Address of account used to clawback holdings of this asset. If empty,
   * clawback is not permitted.
   */
  public clawback?: string;

  /**
   * (df) Whether holdings of this asset are frozen by default.
   */
  public defaultFrozen?: boolean;

  /**
   * (f) Address of account used to freeze holdings of this asset. If empty, freezing
   * is not permitted.
   */
  public freeze?: string;

  /**
   * (m) Address of account used to manage the keys of this asset and to destroy it.
   */
  public manager?: string;

  /**
   * (am) A commitment to some unspecified asset metadata. The format of this
   * metadata is up to the application.
   */
  public metadataHash?: Uint8Array;

  /**
   * (an) Name of this asset, as supplied by the creator. Included only when the
   * asset name is composed of printable utf-8 characters.
   */
  public name?: string;

  /**
   * Base64 encoded name of this asset, as supplied by the creator.
   */
  public nameB64?: Uint8Array;

  /**
   * (r) Address of account holding reserve (non-minted) units of this asset.
   */
  public reserve?: string;

  /**
   * (un) Name of a unit of this asset, as supplied by the creator. Included only
   * when the name of a unit of this asset is composed of printable utf-8 characters.
   */
  public unitName?: string;

  /**
   * Base64 encoded name of a unit of this asset, as supplied by the creator.
   */
  public unitNameB64?: Uint8Array;

  /**
   * (au) URL where more information about the asset can be retrieved. Included only
   * when the URL is composed of printable utf-8 characters.
   */
  public url?: string;

  /**
   * Base64 encoded URL where more information about the asset can be retrieved.
   */
  public urlB64?: Uint8Array;

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
  constructor({
    creator,
    decimals,
    total,
    clawback,
    defaultFrozen,
    freeze,
    manager,
    metadataHash,
    name,
    nameB64,
    reserve,
    unitName,
    unitNameB64,
    url,
    urlB64,
  }: {
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
  }) {
    super();
    this.creator = creator;
    this.decimals = decimals;
    this.total = total;
    this.clawback = clawback;
    this.defaultFrozen = defaultFrozen;
    this.freeze = freeze;
    this.manager = manager;
    this.metadataHash =
      typeof metadataHash === 'string'
        ? new Uint8Array(Buffer.from(metadataHash, 'base64'))
        : metadataHash;
    this.name = name;
    this.nameB64 =
      typeof nameB64 === 'string'
        ? new Uint8Array(Buffer.from(nameB64, 'base64'))
        : nameB64;
    this.reserve = reserve;
    this.unitName = unitName;
    this.unitNameB64 =
      typeof unitNameB64 === 'string'
        ? new Uint8Array(Buffer.from(unitNameB64, 'base64'))
        : unitNameB64;
    this.url = url;
    this.urlB64 =
      typeof urlB64 === 'string'
        ? new Uint8Array(Buffer.from(urlB64, 'base64'))
        : urlB64;

    this.attribute_map = {
      creator: 'creator',
      decimals: 'decimals',
      total: 'total',
      clawback: 'clawback',
      defaultFrozen: 'default-frozen',
      freeze: 'freeze',
      manager: 'manager',
      metadataHash: 'metadata-hash',
      name: 'name',
      nameB64: 'name-b64',
      reserve: 'reserve',
      unitName: 'unit-name',
      unitNameB64: 'unit-name-b64',
      url: 'url',
      urlB64: 'url-b64',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): AssetParams {
    /* eslint-disable dot-notation */
    if (typeof data['creator'] === 'undefined')
      throw new Error(`Response is missing required field 'creator': ${data}`);
    if (typeof data['decimals'] === 'undefined')
      throw new Error(`Response is missing required field 'decimals': ${data}`);
    if (typeof data['total'] === 'undefined')
      throw new Error(`Response is missing required field 'total': ${data}`);
    return new AssetParams({
      creator: data['creator'],
      decimals: data['decimals'],
      total: data['total'],
      clawback: data['clawback'],
      defaultFrozen: data['default-frozen'],
      freeze: data['freeze'],
      manager: data['manager'],
      metadataHash: data['metadata-hash'],
      name: data['name'],
      nameB64: data['name-b64'],
      reserve: data['reserve'],
      unitName: data['unit-name'],
      unitNameB64: data['unit-name-b64'],
      url: data['url'],
      urlB64: data['url-b64'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * Hash of a block header.
 */
export class BlockHashResponse extends BaseModel {
  /**
   * Block header hash.
   */
  public blockhash: string;

  /**
   * Creates a new `BlockHashResponse` object.
   * @param blockhash - Block header hash.
   */
  constructor(blockhash: string) {
    super();
    this.blockhash = blockhash;

    this.attribute_map = {
      blockhash: 'blockHash',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): BlockHashResponse {
    /* eslint-disable dot-notation */
    if (typeof data['blockHash'] === 'undefined')
      throw new Error(
        `Response is missing required field 'blockHash': ${data}`
      );
    return new BlockHashResponse(data['blockHash']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Encoded block object.
 */
export class BlockResponse extends BaseModel {
  /**
   * Block header data.
   */
  public block: BlockHeader;

  /**
   * Optional certificate object. This is only included when the format is set to
   * message pack.
   */
  public cert?: Record<string, any>;

  /**
   * Creates a new `BlockResponse` object.
   * @param block - Block header data.
   * @param cert - Optional certificate object. This is only included when the format is set to
   * message pack.
   */
  constructor(block: BlockHeader, cert?: Record<string, any>) {
    super();
    this.block = block;
    this.cert = cert;

    this.attribute_map = {
      block: 'block',
      cert: 'cert',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): BlockResponse {
    /* eslint-disable dot-notation */
    if (typeof data['block'] === 'undefined')
      throw new Error(`Response is missing required field 'block': ${data}`);
    return new BlockResponse(data['block'], data['cert']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Box name and its content.
 */
export class Box extends BaseModel {
  /**
   * (name) box name, base64 encoded
   */
  public name: Uint8Array;

  /**
   * (value) box value, base64 encoded.
   */
  public value: Uint8Array;

  /**
   * Creates a new `Box` object.
   * @param name - (name) box name, base64 encoded
   * @param value - (value) box value, base64 encoded.
   */
  constructor(name: string | Uint8Array, value: string | Uint8Array) {
    super();
    this.name =
      typeof name === 'string'
        ? new Uint8Array(Buffer.from(name, 'base64'))
        : name;
    this.value =
      typeof value === 'string'
        ? new Uint8Array(Buffer.from(value, 'base64'))
        : value;

    this.attribute_map = {
      name: 'name',
      value: 'value',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): Box {
    /* eslint-disable dot-notation */
    if (typeof data['name'] === 'undefined')
      throw new Error(`Response is missing required field 'name': ${data}`);
    if (typeof data['value'] === 'undefined')
      throw new Error(`Response is missing required field 'value': ${data}`);
    return new Box(data['name'], data['value']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Box descriptor describes a Box.
 */
export class BoxDescriptor extends BaseModel {
  /**
   * Base64 encoded box name
   */
  public name: Uint8Array;

  /**
   * Creates a new `BoxDescriptor` object.
   * @param name - Base64 encoded box name
   */
  constructor(name: string | Uint8Array) {
    super();
    this.name =
      typeof name === 'string'
        ? new Uint8Array(Buffer.from(name, 'base64'))
        : name;

    this.attribute_map = {
      name: 'name',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): BoxDescriptor {
    /* eslint-disable dot-notation */
    if (typeof data['name'] === 'undefined')
      throw new Error(`Response is missing required field 'name': ${data}`);
    return new BoxDescriptor(data['name']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Box names of an application
 */
export class BoxesResponse extends BaseModel {
  public boxes: BoxDescriptor[];

  /**
   * Creates a new `BoxesResponse` object.
   * @param boxes -
   */
  constructor(boxes: BoxDescriptor[]) {
    super();
    this.boxes = boxes;

    this.attribute_map = {
      boxes: 'boxes',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): BoxesResponse {
    /* eslint-disable dot-notation */
    if (!Array.isArray(data['boxes']))
      throw new Error(
        `Response is missing required array field 'boxes': ${data}`
      );
    return new BoxesResponse(
      data['boxes'].map(BoxDescriptor.from_obj_for_encoding)
    );
    /* eslint-enable dot-notation */
  }
}

export class BuildVersion extends BaseModel {
  public branch: string;

  public buildNumber: number | bigint;

  public channel: string;

  public commitHash: string;

  public major: number | bigint;

  public minor: number | bigint;

  /**
   * Creates a new `BuildVersion` object.
   * @param branch -
   * @param buildNumber -
   * @param channel -
   * @param commitHash -
   * @param major -
   * @param minor -
   */
  constructor({
    branch,
    buildNumber,
    channel,
    commitHash,
    major,
    minor,
  }: {
    branch: string;
    buildNumber: number | bigint;
    channel: string;
    commitHash: string;
    major: number | bigint;
    minor: number | bigint;
  }) {
    super();
    this.branch = branch;
    this.buildNumber = buildNumber;
    this.channel = channel;
    this.commitHash = commitHash;
    this.major = major;
    this.minor = minor;

    this.attribute_map = {
      branch: 'branch',
      buildNumber: 'build_number',
      channel: 'channel',
      commitHash: 'commit_hash',
      major: 'major',
      minor: 'minor',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): BuildVersion {
    /* eslint-disable dot-notation */
    if (typeof data['branch'] === 'undefined')
      throw new Error(`Response is missing required field 'branch': ${data}`);
    if (typeof data['build_number'] === 'undefined')
      throw new Error(
        `Response is missing required field 'build_number': ${data}`
      );
    if (typeof data['channel'] === 'undefined')
      throw new Error(`Response is missing required field 'channel': ${data}`);
    if (typeof data['commit_hash'] === 'undefined')
      throw new Error(
        `Response is missing required field 'commit_hash': ${data}`
      );
    if (typeof data['major'] === 'undefined')
      throw new Error(`Response is missing required field 'major': ${data}`);
    if (typeof data['minor'] === 'undefined')
      throw new Error(`Response is missing required field 'minor': ${data}`);
    return new BuildVersion({
      branch: data['branch'],
      buildNumber: data['build_number'],
      channel: data['channel'],
      commitHash: data['commit_hash'],
      major: data['major'],
      minor: data['minor'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 *
 */
export class CatchpointAbortResponse extends BaseModel {
  /**
   * Catchup abort response string
   */
  public catchupMessage: string;

  /**
   * Creates a new `CatchpointAbortResponse` object.
   * @param catchupMessage - Catchup abort response string
   */
  constructor(catchupMessage: string) {
    super();
    this.catchupMessage = catchupMessage;

    this.attribute_map = {
      catchupMessage: 'catchup-message',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): CatchpointAbortResponse {
    /* eslint-disable dot-notation */
    if (typeof data['catchup-message'] === 'undefined')
      throw new Error(
        `Response is missing required field 'catchup-message': ${data}`
      );
    return new CatchpointAbortResponse(data['catchup-message']);
    /* eslint-enable dot-notation */
  }
}

/**
 *
 */
export class CatchpointStartResponse extends BaseModel {
  /**
   * Catchup start response string
   */
  public catchupMessage: string;

  /**
   * Creates a new `CatchpointStartResponse` object.
   * @param catchupMessage - Catchup start response string
   */
  constructor(catchupMessage: string) {
    super();
    this.catchupMessage = catchupMessage;

    this.attribute_map = {
      catchupMessage: 'catchup-message',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): CatchpointStartResponse {
    /* eslint-disable dot-notation */
    if (typeof data['catchup-message'] === 'undefined')
      throw new Error(
        `Response is missing required field 'catchup-message': ${data}`
      );
    return new CatchpointStartResponse(data['catchup-message']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Teal compile Result
 */
export class CompileResponse extends BaseModel {
  /**
   * base32 SHA512_256 of program bytes (Address style)
   */
  public hash: string;

  /**
   * base64 encoded program bytes
   */
  public result: string;

  /**
   * JSON of the source map
   */
  public sourcemap?: Record<string, any>;

  /**
   * Creates a new `CompileResponse` object.
   * @param hash - base32 SHA512_256 of program bytes (Address style)
   * @param result - base64 encoded program bytes
   * @param sourcemap - JSON of the source map
   */
  constructor(hash: string, result: string, sourcemap?: Record<string, any>) {
    super();
    this.hash = hash;
    this.result = result;
    this.sourcemap = sourcemap;

    this.attribute_map = {
      hash: 'hash',
      result: 'result',
      sourcemap: 'sourcemap',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): CompileResponse {
    /* eslint-disable dot-notation */
    if (typeof data['hash'] === 'undefined')
      throw new Error(`Response is missing required field 'hash': ${data}`);
    if (typeof data['result'] === 'undefined')
      throw new Error(`Response is missing required field 'result': ${data}`);
    return new CompileResponse(data['hash'], data['result'], data['sourcemap']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Teal disassembly Result
 */
export class DisassembleResponse extends BaseModel {
  /**
   * disassembled Teal code
   */
  public result: string;

  /**
   * Creates a new `DisassembleResponse` object.
   * @param result - disassembled Teal code
   */
  constructor(result: string) {
    super();
    this.result = result;

    this.attribute_map = {
      result: 'result',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): DisassembleResponse {
    /* eslint-disable dot-notation */
    if (typeof data['result'] === 'undefined')
      throw new Error(`Response is missing required field 'result': ${data}`);
    return new DisassembleResponse(data['result']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Request data type for dryrun endpoint. Given the Transactions and simulated
 * ledger state upload, run TEAL scripts and return debugging information.
 */
export class DryrunRequest extends BaseModel {
  public accounts: Account[];

  public apps: Application[];

  /**
   * LatestTimestamp is available to some TEAL scripts. Defaults to the latest
   * confirmed timestamp this algod is attached to.
   */
  public latestTimestamp: number | bigint;

  /**
   * ProtocolVersion specifies a specific version string to operate under, otherwise
   * whatever the current protocol of the network this algod is running in.
   */
  public protocolVersion: string;

  /**
   * Round is available to some TEAL scripts. Defaults to the current round on the
   * network this algod is attached to.
   */
  public round: number | bigint;

  public sources: DryrunSource[];

  public txns: EncodedSignedTransaction[];

  /**
   * Creates a new `DryrunRequest` object.
   * @param accounts -
   * @param apps -
   * @param latestTimestamp - LatestTimestamp is available to some TEAL scripts. Defaults to the latest
   * confirmed timestamp this algod is attached to.
   * @param protocolVersion - ProtocolVersion specifies a specific version string to operate under, otherwise
   * whatever the current protocol of the network this algod is running in.
   * @param round - Round is available to some TEAL scripts. Defaults to the current round on the
   * network this algod is attached to.
   * @param sources -
   * @param txns -
   */
  constructor({
    accounts,
    apps,
    latestTimestamp,
    protocolVersion,
    round,
    sources,
    txns,
  }: {
    accounts: Account[];
    apps: Application[];
    latestTimestamp: number | bigint;
    protocolVersion: string;
    round: number | bigint;
    sources: DryrunSource[];
    txns: EncodedSignedTransaction[];
  }) {
    super();
    this.accounts = accounts;
    this.apps = apps;
    this.latestTimestamp = latestTimestamp;
    this.protocolVersion = protocolVersion;
    this.round = round;
    this.sources = sources;
    this.txns = txns;

    this.attribute_map = {
      accounts: 'accounts',
      apps: 'apps',
      latestTimestamp: 'latest-timestamp',
      protocolVersion: 'protocol-version',
      round: 'round',
      sources: 'sources',
      txns: 'txns',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): DryrunRequest {
    /* eslint-disable dot-notation */
    if (!Array.isArray(data['accounts']))
      throw new Error(
        `Response is missing required array field 'accounts': ${data}`
      );
    if (!Array.isArray(data['apps']))
      throw new Error(
        `Response is missing required array field 'apps': ${data}`
      );
    if (typeof data['latest-timestamp'] === 'undefined')
      throw new Error(
        `Response is missing required field 'latest-timestamp': ${data}`
      );
    if (typeof data['protocol-version'] === 'undefined')
      throw new Error(
        `Response is missing required field 'protocol-version': ${data}`
      );
    if (typeof data['round'] === 'undefined')
      throw new Error(`Response is missing required field 'round': ${data}`);
    if (!Array.isArray(data['sources']))
      throw new Error(
        `Response is missing required array field 'sources': ${data}`
      );
    if (!Array.isArray(data['txns']))
      throw new Error(
        `Response is missing required array field 'txns': ${data}`
      );
    return new DryrunRequest({
      accounts: data['accounts'].map(Account.from_obj_for_encoding),
      apps: data['apps'].map(Application.from_obj_for_encoding),
      latestTimestamp: data['latest-timestamp'],
      protocolVersion: data['protocol-version'],
      round: data['round'],
      sources: data['sources'].map(DryrunSource.from_obj_for_encoding),
      txns: data['txns'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * DryrunResponse contains per-txn debug information from a dryrun.
 */
export class DryrunResponse extends BaseModel {
  public error: string;

  /**
   * Protocol version is the protocol version Dryrun was operated under.
   */
  public protocolVersion: string;

  public txns: DryrunTxnResult[];

  /**
   * Creates a new `DryrunResponse` object.
   * @param error -
   * @param protocolVersion - Protocol version is the protocol version Dryrun was operated under.
   * @param txns -
   */
  constructor(error: string, protocolVersion: string, txns: DryrunTxnResult[]) {
    super();
    this.error = error;
    this.protocolVersion = protocolVersion;
    this.txns = txns;

    this.attribute_map = {
      error: 'error',
      protocolVersion: 'protocol-version',
      txns: 'txns',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): DryrunResponse {
    /* eslint-disable dot-notation */
    if (typeof data['error'] === 'undefined')
      throw new Error(`Response is missing required field 'error': ${data}`);
    if (typeof data['protocol-version'] === 'undefined')
      throw new Error(
        `Response is missing required field 'protocol-version': ${data}`
      );
    if (!Array.isArray(data['txns']))
      throw new Error(
        `Response is missing required array field 'txns': ${data}`
      );
    return new DryrunResponse(
      data['error'],
      data['protocol-version'],
      data['txns'].map(DryrunTxnResult.from_obj_for_encoding)
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * DryrunSource is TEAL source text that gets uploaded, compiled, and inserted into
 * transactions or application state.
 */
export class DryrunSource extends BaseModel {
  /**
   * FieldName is what kind of sources this is. If lsig then it goes into the
   * transactions[this.TxnIndex].LogicSig. If approv or clearp it goes into the
   * Approval Program or Clear State Program of application[this.AppIndex].
   */
  public fieldName: string;

  public source: string;

  public txnIndex: number | bigint;

  public appIndex: number | bigint;

  /**
   * Creates a new `DryrunSource` object.
   * @param fieldName - FieldName is what kind of sources this is. If lsig then it goes into the
   * transactions[this.TxnIndex].LogicSig. If approv or clearp it goes into the
   * Approval Program or Clear State Program of application[this.AppIndex].
   * @param source -
   * @param txnIndex -
   * @param appIndex -
   */
  constructor(
    fieldName: string,
    source: string,
    txnIndex: number | bigint,
    appIndex: number | bigint
  ) {
    super();
    this.fieldName = fieldName;
    this.source = source;
    this.txnIndex = txnIndex;
    this.appIndex = appIndex;

    this.attribute_map = {
      fieldName: 'field-name',
      source: 'source',
      txnIndex: 'txn-index',
      appIndex: 'app-index',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): DryrunSource {
    /* eslint-disable dot-notation */
    if (typeof data['field-name'] === 'undefined')
      throw new Error(
        `Response is missing required field 'field-name': ${data}`
      );
    if (typeof data['source'] === 'undefined')
      throw new Error(`Response is missing required field 'source': ${data}`);
    if (typeof data['txn-index'] === 'undefined')
      throw new Error(
        `Response is missing required field 'txn-index': ${data}`
      );
    if (typeof data['app-index'] === 'undefined')
      throw new Error(
        `Response is missing required field 'app-index': ${data}`
      );
    return new DryrunSource(
      data['field-name'],
      data['source'],
      data['txn-index'],
      data['app-index']
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * Stores the TEAL eval step data
 */
export class DryrunState extends BaseModel {
  /**
   * Line number
   */
  public line: number | bigint;

  /**
   * Program counter
   */
  public pc: number | bigint;

  public stack: TealValue[];

  /**
   * Evaluation error if any
   */
  public error?: string;

  public scratch?: TealValue[];

  /**
   * Creates a new `DryrunState` object.
   * @param line - Line number
   * @param pc - Program counter
   * @param stack -
   * @param error - Evaluation error if any
   * @param scratch -
   */
  constructor({
    line,
    pc,
    stack,
    error,
    scratch,
  }: {
    line: number | bigint;
    pc: number | bigint;
    stack: TealValue[];
    error?: string;
    scratch?: TealValue[];
  }) {
    super();
    this.line = line;
    this.pc = pc;
    this.stack = stack;
    this.error = error;
    this.scratch = scratch;

    this.attribute_map = {
      line: 'line',
      pc: 'pc',
      stack: 'stack',
      error: 'error',
      scratch: 'scratch',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): DryrunState {
    /* eslint-disable dot-notation */
    if (typeof data['line'] === 'undefined')
      throw new Error(`Response is missing required field 'line': ${data}`);
    if (typeof data['pc'] === 'undefined')
      throw new Error(`Response is missing required field 'pc': ${data}`);
    if (!Array.isArray(data['stack']))
      throw new Error(
        `Response is missing required array field 'stack': ${data}`
      );
    return new DryrunState({
      line: data['line'],
      pc: data['pc'],
      stack: data['stack'].map(TealValue.from_obj_for_encoding),
      error: data['error'],
      scratch:
        typeof data['scratch'] !== 'undefined'
          ? data['scratch'].map(TealValue.from_obj_for_encoding)
          : undefined,
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * DryrunTxnResult contains any LogicSig or ApplicationCall program debug
 * information and state updates from a dryrun.
 */
export class DryrunTxnResult extends BaseModel {
  /**
   * Disassembled program line by line.
   */
  public disassembly: string[];

  public appCallMessages?: string[];

  public appCallTrace?: DryrunState[];

  /**
   * Budget added during execution of app call transaction.
   */
  public budgetAdded?: number | bigint;

  /**
   * Budget consumed during execution of app call transaction.
   */
  public budgetConsumed?: number | bigint;

  /**
   * Net cost of app execution. Field is DEPRECATED and is subject for removal.
   * Instead, use `budget-added` and `budget-consumed.
   */
  public cost?: number | bigint;

  /**
   * Application state delta.
   */
  public globalDelta?: EvalDeltaKeyValue[];

  public localDeltas?: AccountStateDelta[];

  /**
   * Disassembled lsig program line by line.
   */
  public logicSigDisassembly?: string[];

  public logicSigMessages?: string[];

  public logicSigTrace?: DryrunState[];

  public logs?: Uint8Array[];

  /**
   * Creates a new `DryrunTxnResult` object.
   * @param disassembly - Disassembled program line by line.
   * @param appCallMessages -
   * @param appCallTrace -
   * @param budgetAdded - Budget added during execution of app call transaction.
   * @param budgetConsumed - Budget consumed during execution of app call transaction.
   * @param cost - Net cost of app execution. Field is DEPRECATED and is subject for removal.
   * Instead, use `budget-added` and `budget-consumed.
   * @param globalDelta - Application state delta.
   * @param localDeltas -
   * @param logicSigDisassembly - Disassembled lsig program line by line.
   * @param logicSigMessages -
   * @param logicSigTrace -
   * @param logs -
   */
  constructor({
    disassembly,
    appCallMessages,
    appCallTrace,
    budgetAdded,
    budgetConsumed,
    cost,
    globalDelta,
    localDeltas,
    logicSigDisassembly,
    logicSigMessages,
    logicSigTrace,
    logs,
  }: {
    disassembly: string[];
    appCallMessages?: string[];
    appCallTrace?: DryrunState[];
    budgetAdded?: number | bigint;
    budgetConsumed?: number | bigint;
    cost?: number | bigint;
    globalDelta?: EvalDeltaKeyValue[];
    localDeltas?: AccountStateDelta[];
    logicSigDisassembly?: string[];
    logicSigMessages?: string[];
    logicSigTrace?: DryrunState[];
    logs?: Uint8Array[];
  }) {
    super();
    this.disassembly = disassembly;
    this.appCallMessages = appCallMessages;
    this.appCallTrace = appCallTrace;
    this.budgetAdded = budgetAdded;
    this.budgetConsumed = budgetConsumed;
    this.cost = cost;
    this.globalDelta = globalDelta;
    this.localDeltas = localDeltas;
    this.logicSigDisassembly = logicSigDisassembly;
    this.logicSigMessages = logicSigMessages;
    this.logicSigTrace = logicSigTrace;
    this.logs = logs;

    this.attribute_map = {
      disassembly: 'disassembly',
      appCallMessages: 'app-call-messages',
      appCallTrace: 'app-call-trace',
      budgetAdded: 'budget-added',
      budgetConsumed: 'budget-consumed',
      cost: 'cost',
      globalDelta: 'global-delta',
      localDeltas: 'local-deltas',
      logicSigDisassembly: 'logic-sig-disassembly',
      logicSigMessages: 'logic-sig-messages',
      logicSigTrace: 'logic-sig-trace',
      logs: 'logs',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): DryrunTxnResult {
    /* eslint-disable dot-notation */
    if (!Array.isArray(data['disassembly']))
      throw new Error(
        `Response is missing required array field 'disassembly': ${data}`
      );
    return new DryrunTxnResult({
      disassembly: data['disassembly'],
      appCallMessages: data['app-call-messages'],
      appCallTrace:
        typeof data['app-call-trace'] !== 'undefined'
          ? data['app-call-trace'].map(DryrunState.from_obj_for_encoding)
          : undefined,
      budgetAdded: data['budget-added'],
      budgetConsumed: data['budget-consumed'],
      cost: data['cost'],
      globalDelta:
        typeof data['global-delta'] !== 'undefined'
          ? data['global-delta'].map(EvalDeltaKeyValue.from_obj_for_encoding)
          : undefined,
      localDeltas:
        typeof data['local-deltas'] !== 'undefined'
          ? data['local-deltas'].map(AccountStateDelta.from_obj_for_encoding)
          : undefined,
      logicSigDisassembly: data['logic-sig-disassembly'],
      logicSigMessages: data['logic-sig-messages'],
      logicSigTrace:
        typeof data['logic-sig-trace'] !== 'undefined'
          ? data['logic-sig-trace'].map(DryrunState.from_obj_for_encoding)
          : undefined,
      logs: data['logs'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * An error response with optional data field.
 */
export class ErrorResponse extends BaseModel {
  public message: string;

  public data?: Record<string, any>;

  /**
   * Creates a new `ErrorResponse` object.
   * @param message -
   * @param data -
   */
  constructor(message: string, data?: Record<string, any>) {
    super();
    this.message = message;
    this.data = data;

    this.attribute_map = {
      message: 'message',
      data: 'data',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): ErrorResponse {
    /* eslint-disable dot-notation */
    if (typeof data['message'] === 'undefined')
      throw new Error(`Response is missing required field 'message': ${data}`);
    return new ErrorResponse(data['message'], data['data']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Represents a TEAL value delta.
 */
export class EvalDelta extends BaseModel {
  /**
   * (at) delta action.
   */
  public action: number | bigint;

  /**
   * (bs) bytes value.
   */
  public bytes?: string;

  /**
   * (ui) uint value.
   */
  public uint?: number | bigint;

  /**
   * Creates a new `EvalDelta` object.
   * @param action - (at) delta action.
   * @param bytes - (bs) bytes value.
   * @param uint - (ui) uint value.
   */
  constructor(action: number | bigint, bytes?: string, uint?: number | bigint) {
    super();
    this.action = action;
    this.bytes = bytes;
    this.uint = uint;

    this.attribute_map = {
      action: 'action',
      bytes: 'bytes',
      uint: 'uint',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): EvalDelta {
    /* eslint-disable dot-notation */
    if (typeof data['action'] === 'undefined')
      throw new Error(`Response is missing required field 'action': ${data}`);
    return new EvalDelta(data['action'], data['bytes'], data['uint']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Key-value pairs for StateDelta.
 */
export class EvalDeltaKeyValue extends BaseModel {
  public key: string;

  /**
   * Represents a TEAL value delta.
   */
  public value: EvalDelta;

  /**
   * Creates a new `EvalDeltaKeyValue` object.
   * @param key -
   * @param value - Represents a TEAL value delta.
   */
  constructor(key: string, value: EvalDelta) {
    super();
    this.key = key;
    this.value = value;

    this.attribute_map = {
      key: 'key',
      value: 'value',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): EvalDeltaKeyValue {
    /* eslint-disable dot-notation */
    if (typeof data['key'] === 'undefined')
      throw new Error(`Response is missing required field 'key': ${data}`);
    if (typeof data['value'] === 'undefined')
      throw new Error(`Response is missing required field 'value': ${data}`);
    return new EvalDeltaKeyValue(
      data['key'],
      EvalDelta.from_obj_for_encoding(data['value'])
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * Proof of membership and position of a light block header.
 */
export class LightBlockHeaderProof extends BaseModel {
  /**
   * The index of the light block header in the vector commitment tree
   */
  public index: number | bigint;

  /**
   * The encoded proof.
   */
  public proof: Uint8Array;

  /**
   * Represents the depth of the tree that is being proven, i.e. the number of edges
   * from a leaf to the root.
   */
  public treedepth: number | bigint;

  /**
   * Creates a new `LightBlockHeaderProof` object.
   * @param index - The index of the light block header in the vector commitment tree
   * @param proof - The encoded proof.
   * @param treedepth - Represents the depth of the tree that is being proven, i.e. the number of edges
   * from a leaf to the root.
   */
  constructor(
    index: number | bigint,
    proof: string | Uint8Array,
    treedepth: number | bigint
  ) {
    super();
    this.index = index;
    this.proof =
      typeof proof === 'string'
        ? new Uint8Array(Buffer.from(proof, 'base64'))
        : proof;
    this.treedepth = treedepth;

    this.attribute_map = {
      index: 'index',
      proof: 'proof',
      treedepth: 'treedepth',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): LightBlockHeaderProof {
    /* eslint-disable dot-notation */
    if (typeof data['index'] === 'undefined')
      throw new Error(`Response is missing required field 'index': ${data}`);
    if (typeof data['proof'] === 'undefined')
      throw new Error(`Response is missing required field 'proof': ${data}`);
    if (typeof data['treedepth'] === 'undefined')
      throw new Error(
        `Response is missing required field 'treedepth': ${data}`
      );
    return new LightBlockHeaderProof(
      data['index'],
      data['proof'],
      data['treedepth']
    );
    /* eslint-enable dot-notation */
  }
}

/**
 *
 */
export class NodeStatusResponse extends BaseModel {
  /**
   * CatchupTime in nanoseconds
   */
  public catchupTime: number | bigint;

  /**
   * LastRound indicates the last round seen
   */
  public lastRound: number | bigint;

  /**
   * LastVersion indicates the last consensus version supported
   */
  public lastVersion: string;

  /**
   * NextVersion of consensus protocol to use
   */
  public nextVersion: string;

  /**
   * NextVersionRound is the round at which the next consensus version will apply
   */
  public nextVersionRound: number | bigint;

  /**
   * NextVersionSupported indicates whether the next consensus version is supported
   * by this node
   */
  public nextVersionSupported: boolean;

  /**
   * StoppedAtUnsupportedRound indicates that the node does not support the new
   * rounds and has stopped making progress
   */
  public stoppedAtUnsupportedRound: boolean;

  /**
   * TimeSinceLastRound in nanoseconds
   */
  public timeSinceLastRound: number | bigint;

  /**
   * The current catchpoint that is being caught up to
   */
  public catchpoint?: string;

  /**
   * The number of blocks that have already been obtained by the node as part of the
   * catchup
   */
  public catchpointAcquiredBlocks?: number | bigint;

  /**
   * The number of accounts from the current catchpoint that have been processed so
   * far as part of the catchup
   */
  public catchpointProcessedAccounts?: number | bigint;

  /**
   * The number of key-values (KVs) from the current catchpoint that have been
   * processed so far as part of the catchup
   */
  public catchpointProcessedKvs?: number | bigint;

  /**
   * The total number of accounts included in the current catchpoint
   */
  public catchpointTotalAccounts?: number | bigint;

  /**
   * The total number of blocks that are required to complete the current catchpoint
   * catchup
   */
  public catchpointTotalBlocks?: number | bigint;

  /**
   * The total number of key-values (KVs) included in the current catchpoint
   */
  public catchpointTotalKvs?: number | bigint;

  /**
   * The number of accounts from the current catchpoint that have been verified so
   * far as part of the catchup
   */
  public catchpointVerifiedAccounts?: number | bigint;

  /**
   * The number of key-values (KVs) from the current catchpoint that have been
   * verified so far as part of the catchup
   */
  public catchpointVerifiedKvs?: number | bigint;

  /**
   * The last catchpoint seen by the node
   */
  public lastCatchpoint?: string;

  /**
   * Creates a new `NodeStatusResponse` object.
   * @param catchupTime - CatchupTime in nanoseconds
   * @param lastRound - LastRound indicates the last round seen
   * @param lastVersion - LastVersion indicates the last consensus version supported
   * @param nextVersion - NextVersion of consensus protocol to use
   * @param nextVersionRound - NextVersionRound is the round at which the next consensus version will apply
   * @param nextVersionSupported - NextVersionSupported indicates whether the next consensus version is supported
   * by this node
   * @param stoppedAtUnsupportedRound - StoppedAtUnsupportedRound indicates that the node does not support the new
   * rounds and has stopped making progress
   * @param timeSinceLastRound - TimeSinceLastRound in nanoseconds
   * @param catchpoint - The current catchpoint that is being caught up to
   * @param catchpointAcquiredBlocks - The number of blocks that have already been obtained by the node as part of the
   * catchup
   * @param catchpointProcessedAccounts - The number of accounts from the current catchpoint that have been processed so
   * far as part of the catchup
   * @param catchpointProcessedKvs - The number of key-values (KVs) from the current catchpoint that have been
   * processed so far as part of the catchup
   * @param catchpointTotalAccounts - The total number of accounts included in the current catchpoint
   * @param catchpointTotalBlocks - The total number of blocks that are required to complete the current catchpoint
   * catchup
   * @param catchpointTotalKvs - The total number of key-values (KVs) included in the current catchpoint
   * @param catchpointVerifiedAccounts - The number of accounts from the current catchpoint that have been verified so
   * far as part of the catchup
   * @param catchpointVerifiedKvs - The number of key-values (KVs) from the current catchpoint that have been
   * verified so far as part of the catchup
   * @param lastCatchpoint - The last catchpoint seen by the node
   */
  constructor({
    catchupTime,
    lastRound,
    lastVersion,
    nextVersion,
    nextVersionRound,
    nextVersionSupported,
    stoppedAtUnsupportedRound,
    timeSinceLastRound,
    catchpoint,
    catchpointAcquiredBlocks,
    catchpointProcessedAccounts,
    catchpointProcessedKvs,
    catchpointTotalAccounts,
    catchpointTotalBlocks,
    catchpointTotalKvs,
    catchpointVerifiedAccounts,
    catchpointVerifiedKvs,
    lastCatchpoint,
  }: {
    catchupTime: number | bigint;
    lastRound: number | bigint;
    lastVersion: string;
    nextVersion: string;
    nextVersionRound: number | bigint;
    nextVersionSupported: boolean;
    stoppedAtUnsupportedRound: boolean;
    timeSinceLastRound: number | bigint;
    catchpoint?: string;
    catchpointAcquiredBlocks?: number | bigint;
    catchpointProcessedAccounts?: number | bigint;
    catchpointProcessedKvs?: number | bigint;
    catchpointTotalAccounts?: number | bigint;
    catchpointTotalBlocks?: number | bigint;
    catchpointTotalKvs?: number | bigint;
    catchpointVerifiedAccounts?: number | bigint;
    catchpointVerifiedKvs?: number | bigint;
    lastCatchpoint?: string;
  }) {
    super();
    this.catchupTime = catchupTime;
    this.lastRound = lastRound;
    this.lastVersion = lastVersion;
    this.nextVersion = nextVersion;
    this.nextVersionRound = nextVersionRound;
    this.nextVersionSupported = nextVersionSupported;
    this.stoppedAtUnsupportedRound = stoppedAtUnsupportedRound;
    this.timeSinceLastRound = timeSinceLastRound;
    this.catchpoint = catchpoint;
    this.catchpointAcquiredBlocks = catchpointAcquiredBlocks;
    this.catchpointProcessedAccounts = catchpointProcessedAccounts;
    this.catchpointProcessedKvs = catchpointProcessedKvs;
    this.catchpointTotalAccounts = catchpointTotalAccounts;
    this.catchpointTotalBlocks = catchpointTotalBlocks;
    this.catchpointTotalKvs = catchpointTotalKvs;
    this.catchpointVerifiedAccounts = catchpointVerifiedAccounts;
    this.catchpointVerifiedKvs = catchpointVerifiedKvs;
    this.lastCatchpoint = lastCatchpoint;

    this.attribute_map = {
      catchupTime: 'catchup-time',
      lastRound: 'last-round',
      lastVersion: 'last-version',
      nextVersion: 'next-version',
      nextVersionRound: 'next-version-round',
      nextVersionSupported: 'next-version-supported',
      stoppedAtUnsupportedRound: 'stopped-at-unsupported-round',
      timeSinceLastRound: 'time-since-last-round',
      catchpoint: 'catchpoint',
      catchpointAcquiredBlocks: 'catchpoint-acquired-blocks',
      catchpointProcessedAccounts: 'catchpoint-processed-accounts',
      catchpointProcessedKvs: 'catchpoint-processed-kvs',
      catchpointTotalAccounts: 'catchpoint-total-accounts',
      catchpointTotalBlocks: 'catchpoint-total-blocks',
      catchpointTotalKvs: 'catchpoint-total-kvs',
      catchpointVerifiedAccounts: 'catchpoint-verified-accounts',
      catchpointVerifiedKvs: 'catchpoint-verified-kvs',
      lastCatchpoint: 'last-catchpoint',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): NodeStatusResponse {
    /* eslint-disable dot-notation */
    if (typeof data['catchup-time'] === 'undefined')
      throw new Error(
        `Response is missing required field 'catchup-time': ${data}`
      );
    if (typeof data['last-round'] === 'undefined')
      throw new Error(
        `Response is missing required field 'last-round': ${data}`
      );
    if (typeof data['last-version'] === 'undefined')
      throw new Error(
        `Response is missing required field 'last-version': ${data}`
      );
    if (typeof data['next-version'] === 'undefined')
      throw new Error(
        `Response is missing required field 'next-version': ${data}`
      );
    if (typeof data['next-version-round'] === 'undefined')
      throw new Error(
        `Response is missing required field 'next-version-round': ${data}`
      );
    if (typeof data['next-version-supported'] === 'undefined')
      throw new Error(
        `Response is missing required field 'next-version-supported': ${data}`
      );
    if (typeof data['stopped-at-unsupported-round'] === 'undefined')
      throw new Error(
        `Response is missing required field 'stopped-at-unsupported-round': ${data}`
      );
    if (typeof data['time-since-last-round'] === 'undefined')
      throw new Error(
        `Response is missing required field 'time-since-last-round': ${data}`
      );
    return new NodeStatusResponse({
      catchupTime: data['catchup-time'],
      lastRound: data['last-round'],
      lastVersion: data['last-version'],
      nextVersion: data['next-version'],
      nextVersionRound: data['next-version-round'],
      nextVersionSupported: data['next-version-supported'],
      stoppedAtUnsupportedRound: data['stopped-at-unsupported-round'],
      timeSinceLastRound: data['time-since-last-round'],
      catchpoint: data['catchpoint'],
      catchpointAcquiredBlocks: data['catchpoint-acquired-blocks'],
      catchpointProcessedAccounts: data['catchpoint-processed-accounts'],
      catchpointProcessedKvs: data['catchpoint-processed-kvs'],
      catchpointTotalAccounts: data['catchpoint-total-accounts'],
      catchpointTotalBlocks: data['catchpoint-total-blocks'],
      catchpointTotalKvs: data['catchpoint-total-kvs'],
      catchpointVerifiedAccounts: data['catchpoint-verified-accounts'],
      catchpointVerifiedKvs: data['catchpoint-verified-kvs'],
      lastCatchpoint: data['last-catchpoint'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * Details about a pending transaction. If the transaction was recently confirmed,
 * includes confirmation details like the round and reward details.
 */
export class PendingTransactionResponse extends BaseModel {
  /**
   * Indicates that the transaction was kicked out of this node's transaction pool
   * (and specifies why that happened). An empty string indicates the transaction
   * wasn't kicked out of this node's txpool due to an error.
   */
  public poolError: string;

  /**
   * The raw signed transaction.
   */
  public txn: EncodedSignedTransaction;

  /**
   * The application index if the transaction was found and it created an
   * application.
   */
  public applicationIndex?: number | bigint;

  /**
   * The number of the asset's unit that were transferred to the close-to address.
   */
  public assetClosingAmount?: number | bigint;

  /**
   * The asset index if the transaction was found and it created an asset.
   */
  public assetIndex?: number | bigint;

  /**
   * Rewards in microalgos applied to the close remainder to account.
   */
  public closeRewards?: number | bigint;

  /**
   * Closing amount for the transaction.
   */
  public closingAmount?: number | bigint;

  /**
   * The round where this transaction was confirmed, if present.
   */
  public confirmedRound?: number | bigint;

  /**
   * (gd) Global state key/value changes for the application being executed by this
   * transaction.
   */
  public globalStateDelta?: EvalDeltaKeyValue[];

  /**
   * Inner transactions produced by application execution.
   */
  public innerTxns?: PendingTransactionResponse[];

  /**
   * (ld) Local state key/value changes for the application being executed by this
   * transaction.
   */
  public localStateDelta?: AccountStateDelta[];

  /**
   * (lg) Logs for the application being executed by this transaction.
   */
  public logs?: Uint8Array[];

  /**
   * Rewards in microalgos applied to the receiver account.
   */
  public receiverRewards?: number | bigint;

  /**
   * Rewards in microalgos applied to the sender account.
   */
  public senderRewards?: number | bigint;

  /**
   * Creates a new `PendingTransactionResponse` object.
   * @param poolError - Indicates that the transaction was kicked out of this node's transaction pool
   * (and specifies why that happened). An empty string indicates the transaction
   * wasn't kicked out of this node's txpool due to an error.
   * @param txn - The raw signed transaction.
   * @param applicationIndex - The application index if the transaction was found and it created an
   * application.
   * @param assetClosingAmount - The number of the asset's unit that were transferred to the close-to address.
   * @param assetIndex - The asset index if the transaction was found and it created an asset.
   * @param closeRewards - Rewards in microalgos applied to the close remainder to account.
   * @param closingAmount - Closing amount for the transaction.
   * @param confirmedRound - The round where this transaction was confirmed, if present.
   * @param globalStateDelta - (gd) Global state key/value changes for the application being executed by this
   * transaction.
   * @param innerTxns - Inner transactions produced by application execution.
   * @param localStateDelta - (ld) Local state key/value changes for the application being executed by this
   * transaction.
   * @param logs - (lg) Logs for the application being executed by this transaction.
   * @param receiverRewards - Rewards in microalgos applied to the receiver account.
   * @param senderRewards - Rewards in microalgos applied to the sender account.
   */
  constructor({
    poolError,
    txn,
    applicationIndex,
    assetClosingAmount,
    assetIndex,
    closeRewards,
    closingAmount,
    confirmedRound,
    globalStateDelta,
    innerTxns,
    localStateDelta,
    logs,
    receiverRewards,
    senderRewards,
  }: {
    poolError: string;
    txn: EncodedSignedTransaction;
    applicationIndex?: number | bigint;
    assetClosingAmount?: number | bigint;
    assetIndex?: number | bigint;
    closeRewards?: number | bigint;
    closingAmount?: number | bigint;
    confirmedRound?: number | bigint;
    globalStateDelta?: EvalDeltaKeyValue[];
    innerTxns?: PendingTransactionResponse[];
    localStateDelta?: AccountStateDelta[];
    logs?: Uint8Array[];
    receiverRewards?: number | bigint;
    senderRewards?: number | bigint;
  }) {
    super();
    this.poolError = poolError;
    this.txn = txn;
    this.applicationIndex = applicationIndex;
    this.assetClosingAmount = assetClosingAmount;
    this.assetIndex = assetIndex;
    this.closeRewards = closeRewards;
    this.closingAmount = closingAmount;
    this.confirmedRound = confirmedRound;
    this.globalStateDelta = globalStateDelta;
    this.innerTxns = innerTxns;
    this.localStateDelta = localStateDelta;
    this.logs = logs;
    this.receiverRewards = receiverRewards;
    this.senderRewards = senderRewards;

    this.attribute_map = {
      poolError: 'pool-error',
      txn: 'txn',
      applicationIndex: 'application-index',
      assetClosingAmount: 'asset-closing-amount',
      assetIndex: 'asset-index',
      closeRewards: 'close-rewards',
      closingAmount: 'closing-amount',
      confirmedRound: 'confirmed-round',
      globalStateDelta: 'global-state-delta',
      innerTxns: 'inner-txns',
      localStateDelta: 'local-state-delta',
      logs: 'logs',
      receiverRewards: 'receiver-rewards',
      senderRewards: 'sender-rewards',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): PendingTransactionResponse {
    /* eslint-disable dot-notation */
    if (typeof data['pool-error'] === 'undefined')
      throw new Error(
        `Response is missing required field 'pool-error': ${data}`
      );
    if (typeof data['txn'] === 'undefined')
      throw new Error(`Response is missing required field 'txn': ${data}`);
    return new PendingTransactionResponse({
      poolError: data['pool-error'],
      txn: data['txn'],
      applicationIndex: data['application-index'],
      assetClosingAmount: data['asset-closing-amount'],
      assetIndex: data['asset-index'],
      closeRewards: data['close-rewards'],
      closingAmount: data['closing-amount'],
      confirmedRound: data['confirmed-round'],
      globalStateDelta:
        typeof data['global-state-delta'] !== 'undefined'
          ? data['global-state-delta'].map(
              EvalDeltaKeyValue.from_obj_for_encoding
            )
          : undefined,
      innerTxns:
        typeof data['inner-txns'] !== 'undefined'
          ? data['inner-txns'].map(
              PendingTransactionResponse.from_obj_for_encoding
            )
          : undefined,
      localStateDelta:
        typeof data['local-state-delta'] !== 'undefined'
          ? data['local-state-delta'].map(
              AccountStateDelta.from_obj_for_encoding
            )
          : undefined,
      logs: data['logs'],
      receiverRewards: data['receiver-rewards'],
      senderRewards: data['sender-rewards'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * A potentially truncated list of transactions currently in the node's transaction
 * pool. You can compute whether or not the list is truncated if the number of
 * elements in the **top-transactions** array is fewer than **total-transactions**.
 */
export class PendingTransactionsResponse extends BaseModel {
  /**
   * An array of signed transaction objects.
   */
  public topTransactions: EncodedSignedTransaction[];

  /**
   * Total number of transactions in the pool.
   */
  public totalTransactions: number | bigint;

  /**
   * Creates a new `PendingTransactionsResponse` object.
   * @param topTransactions - An array of signed transaction objects.
   * @param totalTransactions - Total number of transactions in the pool.
   */
  constructor(
    topTransactions: EncodedSignedTransaction[],
    totalTransactions: number | bigint
  ) {
    super();
    this.topTransactions = topTransactions;
    this.totalTransactions = totalTransactions;

    this.attribute_map = {
      topTransactions: 'top-transactions',
      totalTransactions: 'total-transactions',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): PendingTransactionsResponse {
    /* eslint-disable dot-notation */
    if (!Array.isArray(data['top-transactions']))
      throw new Error(
        `Response is missing required array field 'top-transactions': ${data}`
      );
    if (typeof data['total-transactions'] === 'undefined')
      throw new Error(
        `Response is missing required field 'total-transactions': ${data}`
      );
    return new PendingTransactionsResponse(
      data['top-transactions'],
      data['total-transactions']
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * Transaction ID of the submission.
 */
export class PostTransactionsResponse extends BaseModel {
  /**
   * encoding of the transaction hash.
   */
  public txid: string;

  /**
   * Creates a new `PostTransactionsResponse` object.
   * @param txid - encoding of the transaction hash.
   */
  constructor(txid: string) {
    super();
    this.txid = txid;

    this.attribute_map = {
      txid: 'txId',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): PostTransactionsResponse {
    /* eslint-disable dot-notation */
    if (typeof data['txId'] === 'undefined')
      throw new Error(`Response is missing required field 'txId': ${data}`);
    return new PostTransactionsResponse(data['txId']);
    /* eslint-enable dot-notation */
  }
}

/**
 * Represents a state proof and its corresponding message
 */
export class StateProof extends BaseModel {
  /**
   * Represents the message that the state proofs are attesting to.
   */
  public message: StateProofMessage;

  /**
   * The encoded StateProof for the message.
   */
  public stateproof: Uint8Array;

  /**
   * Creates a new `StateProof` object.
   * @param message - Represents the message that the state proofs are attesting to.
   * @param stateproof - The encoded StateProof for the message.
   */
  constructor(message: StateProofMessage, stateproof: string | Uint8Array) {
    super();
    this.message = message;
    this.stateproof =
      typeof stateproof === 'string'
        ? new Uint8Array(Buffer.from(stateproof, 'base64'))
        : stateproof;

    this.attribute_map = {
      message: 'Message',
      stateproof: 'StateProof',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): StateProof {
    /* eslint-disable dot-notation */
    if (typeof data['Message'] === 'undefined')
      throw new Error(`Response is missing required field 'Message': ${data}`);
    if (typeof data['StateProof'] === 'undefined')
      throw new Error(
        `Response is missing required field 'StateProof': ${data}`
      );
    return new StateProof(
      StateProofMessage.from_obj_for_encoding(data['Message']),
      data['StateProof']
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * Represents the message that the state proofs are attesting to.
 */
export class StateProofMessage extends BaseModel {
  /**
   * The vector commitment root on all light block headers within a state proof
   * interval.
   */
  public blockheaderscommitment: Uint8Array;

  /**
   * The first round the message attests to.
   */
  public firstattestedround: number | bigint;

  /**
   * The last round the message attests to.
   */
  public lastattestedround: number | bigint;

  /**
   * An integer value representing the natural log of the proven weight with 16 bits
   * of precision. This value would be used to verify the next state proof.
   */
  public lnprovenweight: number | bigint;

  /**
   * The vector commitment root of the top N accounts to sign the next StateProof.
   */
  public voterscommitment: Uint8Array;

  /**
   * Creates a new `StateProofMessage` object.
   * @param blockheaderscommitment - The vector commitment root on all light block headers within a state proof
   * interval.
   * @param firstattestedround - The first round the message attests to.
   * @param lastattestedround - The last round the message attests to.
   * @param lnprovenweight - An integer value representing the natural log of the proven weight with 16 bits
   * of precision. This value would be used to verify the next state proof.
   * @param voterscommitment - The vector commitment root of the top N accounts to sign the next StateProof.
   */
  constructor({
    blockheaderscommitment,
    firstattestedround,
    lastattestedround,
    lnprovenweight,
    voterscommitment,
  }: {
    blockheaderscommitment: string | Uint8Array;
    firstattestedround: number | bigint;
    lastattestedround: number | bigint;
    lnprovenweight: number | bigint;
    voterscommitment: string | Uint8Array;
  }) {
    super();
    this.blockheaderscommitment =
      typeof blockheaderscommitment === 'string'
        ? new Uint8Array(Buffer.from(blockheaderscommitment, 'base64'))
        : blockheaderscommitment;
    this.firstattestedround = firstattestedround;
    this.lastattestedround = lastattestedround;
    this.lnprovenweight = lnprovenweight;
    this.voterscommitment =
      typeof voterscommitment === 'string'
        ? new Uint8Array(Buffer.from(voterscommitment, 'base64'))
        : voterscommitment;

    this.attribute_map = {
      blockheaderscommitment: 'BlockHeadersCommitment',
      firstattestedround: 'FirstAttestedRound',
      lastattestedround: 'LastAttestedRound',
      lnprovenweight: 'LnProvenWeight',
      voterscommitment: 'VotersCommitment',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): StateProofMessage {
    /* eslint-disable dot-notation */
    if (typeof data['BlockHeadersCommitment'] === 'undefined')
      throw new Error(
        `Response is missing required field 'BlockHeadersCommitment': ${data}`
      );
    if (typeof data['FirstAttestedRound'] === 'undefined')
      throw new Error(
        `Response is missing required field 'FirstAttestedRound': ${data}`
      );
    if (typeof data['LastAttestedRound'] === 'undefined')
      throw new Error(
        `Response is missing required field 'LastAttestedRound': ${data}`
      );
    if (typeof data['LnProvenWeight'] === 'undefined')
      throw new Error(
        `Response is missing required field 'LnProvenWeight': ${data}`
      );
    if (typeof data['VotersCommitment'] === 'undefined')
      throw new Error(
        `Response is missing required field 'VotersCommitment': ${data}`
      );
    return new StateProofMessage({
      blockheaderscommitment: data['BlockHeadersCommitment'],
      firstattestedround: data['FirstAttestedRound'],
      lastattestedround: data['LastAttestedRound'],
      lnprovenweight: data['LnProvenWeight'],
      voterscommitment: data['VotersCommitment'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * Supply represents the current supply of MicroAlgos in the system.
 */
export class SupplyResponse extends BaseModel {
  /**
   * Round
   */
  public currentRound: number | bigint;

  /**
   * OnlineMoney
   */
  public onlineMoney: number | bigint;

  /**
   * TotalMoney
   */
  public totalMoney: number | bigint;

  /**
   * Creates a new `SupplyResponse` object.
   * @param currentRound - Round
   * @param onlineMoney - OnlineMoney
   * @param totalMoney - TotalMoney
   */
  constructor(
    currentRound: number | bigint,
    onlineMoney: number | bigint,
    totalMoney: number | bigint
  ) {
    super();
    this.currentRound = currentRound;
    this.onlineMoney = onlineMoney;
    this.totalMoney = totalMoney;

    this.attribute_map = {
      currentRound: 'current_round',
      onlineMoney: 'online-money',
      totalMoney: 'total-money',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): SupplyResponse {
    /* eslint-disable dot-notation */
    if (typeof data['current_round'] === 'undefined')
      throw new Error(
        `Response is missing required field 'current_round': ${data}`
      );
    if (typeof data['online-money'] === 'undefined')
      throw new Error(
        `Response is missing required field 'online-money': ${data}`
      );
    if (typeof data['total-money'] === 'undefined')
      throw new Error(
        `Response is missing required field 'total-money': ${data}`
      );
    return new SupplyResponse(
      data['current_round'],
      data['online-money'],
      data['total-money']
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * Represents a key-value pair in an application store.
 */
export class TealKeyValue extends BaseModel {
  public key: string;

  /**
   * Represents a TEAL value.
   */
  public value: TealValue;

  /**
   * Creates a new `TealKeyValue` object.
   * @param key -
   * @param value - Represents a TEAL value.
   */
  constructor(key: string, value: TealValue) {
    super();
    this.key = key;
    this.value = value;

    this.attribute_map = {
      key: 'key',
      value: 'value',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): TealKeyValue {
    /* eslint-disable dot-notation */
    if (typeof data['key'] === 'undefined')
      throw new Error(`Response is missing required field 'key': ${data}`);
    if (typeof data['value'] === 'undefined')
      throw new Error(`Response is missing required field 'value': ${data}`);
    return new TealKeyValue(
      data['key'],
      TealValue.from_obj_for_encoding(data['value'])
    );
    /* eslint-enable dot-notation */
  }
}

/**
 * Represents a TEAL value.
 */
export class TealValue extends BaseModel {
  /**
   * (tt) value type. Value `1` refers to **bytes**, value `2` refers to **uint**
   */
  public type: number | bigint;

  /**
   * (tb) bytes value.
   */
  public bytes: string;

  /**
   * (ui) uint value.
   */
  public uint: number | bigint;

  /**
   * Creates a new `TealValue` object.
   * @param type - (tt) value type. Value `1` refers to **bytes**, value `2` refers to **uint**
   * @param bytes - (tb) bytes value.
   * @param uint - (ui) uint value.
   */
  constructor(type: number | bigint, bytes: string, uint: number | bigint) {
    super();
    this.type = type;
    this.bytes = bytes;
    this.uint = uint;

    this.attribute_map = {
      type: 'type',
      bytes: 'bytes',
      uint: 'uint',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): TealValue {
    /* eslint-disable dot-notation */
    if (typeof data['type'] === 'undefined')
      throw new Error(`Response is missing required field 'type': ${data}`);
    if (typeof data['bytes'] === 'undefined')
      throw new Error(`Response is missing required field 'bytes': ${data}`);
    if (typeof data['uint'] === 'undefined')
      throw new Error(`Response is missing required field 'uint': ${data}`);
    return new TealValue(data['type'], data['bytes'], data['uint']);
    /* eslint-enable dot-notation */
  }
}

/**
 * TransactionParams contains the parameters that help a client construct a new
 * transaction.
 */
export class TransactionParametersResponse extends BaseModel {
  /**
   * ConsensusVersion indicates the consensus protocol version
   * as of LastRound.
   */
  public consensusVersion: string;

  /**
   * Fee is the suggested transaction fee
   * Fee is in units of micro-Algos per byte.
   * Fee may fall to zero but transactions must still have a fee of
   * at least MinTxnFee for the current network protocol.
   */
  public fee: number | bigint;

  /**
   * GenesisHash is the hash of the genesis block.
   */
  public genesisHash: Uint8Array;

  /**
   * GenesisID is an ID listed in the genesis block.
   */
  public genesisId: string;

  /**
   * LastRound indicates the last round seen
   */
  public lastRound: number | bigint;

  /**
   * The minimum transaction fee (not per byte) required for the
   * txn to validate for the current network protocol.
   */
  public minFee: number | bigint;

  /**
   * Creates a new `TransactionParametersResponse` object.
   * @param consensusVersion - ConsensusVersion indicates the consensus protocol version
   * as of LastRound.
   * @param fee - Fee is the suggested transaction fee
   * Fee is in units of micro-Algos per byte.
   * Fee may fall to zero but transactions must still have a fee of
   * at least MinTxnFee for the current network protocol.
   * @param genesisHash - GenesisHash is the hash of the genesis block.
   * @param genesisId - GenesisID is an ID listed in the genesis block.
   * @param lastRound - LastRound indicates the last round seen
   * @param minFee - The minimum transaction fee (not per byte) required for the
   * txn to validate for the current network protocol.
   */
  constructor({
    consensusVersion,
    fee,
    genesisHash,
    genesisId,
    lastRound,
    minFee,
  }: {
    consensusVersion: string;
    fee: number | bigint;
    genesisHash: string | Uint8Array;
    genesisId: string;
    lastRound: number | bigint;
    minFee: number | bigint;
  }) {
    super();
    this.consensusVersion = consensusVersion;
    this.fee = fee;
    this.genesisHash =
      typeof genesisHash === 'string'
        ? new Uint8Array(Buffer.from(genesisHash, 'base64'))
        : genesisHash;
    this.genesisId = genesisId;
    this.lastRound = lastRound;
    this.minFee = minFee;

    this.attribute_map = {
      consensusVersion: 'consensus-version',
      fee: 'fee',
      genesisHash: 'genesis-hash',
      genesisId: 'genesis-id',
      lastRound: 'last-round',
      minFee: 'min-fee',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): TransactionParametersResponse {
    /* eslint-disable dot-notation */
    if (typeof data['consensus-version'] === 'undefined')
      throw new Error(
        `Response is missing required field 'consensus-version': ${data}`
      );
    if (typeof data['fee'] === 'undefined')
      throw new Error(`Response is missing required field 'fee': ${data}`);
    if (typeof data['genesis-hash'] === 'undefined')
      throw new Error(
        `Response is missing required field 'genesis-hash': ${data}`
      );
    if (typeof data['genesis-id'] === 'undefined')
      throw new Error(
        `Response is missing required field 'genesis-id': ${data}`
      );
    if (typeof data['last-round'] === 'undefined')
      throw new Error(
        `Response is missing required field 'last-round': ${data}`
      );
    if (typeof data['min-fee'] === 'undefined')
      throw new Error(`Response is missing required field 'min-fee': ${data}`);
    return new TransactionParametersResponse({
      consensusVersion: data['consensus-version'],
      fee: data['fee'],
      genesisHash: data['genesis-hash'],
      genesisId: data['genesis-id'],
      lastRound: data['last-round'],
      minFee: data['min-fee'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * Proof of transaction in a block.
 */
export class TransactionProofResponse extends BaseModel {
  /**
   * Index of the transaction in the block's payset.
   */
  public idx: number | bigint;

  /**
   * Proof of transaction membership.
   */
  public proof: Uint8Array;

  /**
   * Hash of SignedTxnInBlock for verifying proof.
   */
  public stibhash: Uint8Array;

  /**
   * Represents the depth of the tree that is being proven, i.e. the number of edges
   * from a leaf to the root.
   */
  public treedepth: number | bigint;

  /**
   * The type of hash function used to create the proof, must be one of:
   * * sha512_256
   * * sha256
   */
  public hashtype?: string;

  /**
   * Creates a new `TransactionProofResponse` object.
   * @param idx - Index of the transaction in the block's payset.
   * @param proof - Proof of transaction membership.
   * @param stibhash - Hash of SignedTxnInBlock for verifying proof.
   * @param treedepth - Represents the depth of the tree that is being proven, i.e. the number of edges
   * from a leaf to the root.
   * @param hashtype - The type of hash function used to create the proof, must be one of:
   * * sha512_256
   * * sha256
   */
  constructor({
    idx,
    proof,
    stibhash,
    treedepth,
    hashtype,
  }: {
    idx: number | bigint;
    proof: string | Uint8Array;
    stibhash: string | Uint8Array;
    treedepth: number | bigint;
    hashtype?: string;
  }) {
    super();
    this.idx = idx;
    this.proof =
      typeof proof === 'string'
        ? new Uint8Array(Buffer.from(proof, 'base64'))
        : proof;
    this.stibhash =
      typeof stibhash === 'string'
        ? new Uint8Array(Buffer.from(stibhash, 'base64'))
        : stibhash;
    this.treedepth = treedepth;
    this.hashtype = hashtype;

    this.attribute_map = {
      idx: 'idx',
      proof: 'proof',
      stibhash: 'stibhash',
      treedepth: 'treedepth',
      hashtype: 'hashtype',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(
    data: Record<string, any>
  ): TransactionProofResponse {
    /* eslint-disable dot-notation */
    if (typeof data['idx'] === 'undefined')
      throw new Error(`Response is missing required field 'idx': ${data}`);
    if (typeof data['proof'] === 'undefined')
      throw new Error(`Response is missing required field 'proof': ${data}`);
    if (typeof data['stibhash'] === 'undefined')
      throw new Error(`Response is missing required field 'stibhash': ${data}`);
    if (typeof data['treedepth'] === 'undefined')
      throw new Error(
        `Response is missing required field 'treedepth': ${data}`
      );
    return new TransactionProofResponse({
      idx: data['idx'],
      proof: data['proof'],
      stibhash: data['stibhash'],
      treedepth: data['treedepth'],
      hashtype: data['hashtype'],
    });
    /* eslint-enable dot-notation */
  }
}

/**
 * algod version information.
 */
export class Version extends BaseModel {
  public build: BuildVersion;

  public genesisHashB64: Uint8Array;

  public genesisId: string;

  public versions: string[];

  /**
   * Creates a new `Version` object.
   * @param build -
   * @param genesisHashB64 -
   * @param genesisId -
   * @param versions -
   */
  constructor(
    build: BuildVersion,
    genesisHashB64: string | Uint8Array,
    genesisId: string,
    versions: string[]
  ) {
    super();
    this.build = build;
    this.genesisHashB64 =
      typeof genesisHashB64 === 'string'
        ? new Uint8Array(Buffer.from(genesisHashB64, 'base64'))
        : genesisHashB64;
    this.genesisId = genesisId;
    this.versions = versions;

    this.attribute_map = {
      build: 'build',
      genesisHashB64: 'genesis_hash_b64',
      genesisId: 'genesis_id',
      versions: 'versions',
    };
  }

  // eslint-disable-next-line camelcase
  static from_obj_for_encoding(data: Record<string, any>): Version {
    /* eslint-disable dot-notation */
    if (typeof data['build'] === 'undefined')
      throw new Error(`Response is missing required field 'build': ${data}`);
    if (typeof data['genesis_hash_b64'] === 'undefined')
      throw new Error(
        `Response is missing required field 'genesis_hash_b64': ${data}`
      );
    if (typeof data['genesis_id'] === 'undefined')
      throw new Error(
        `Response is missing required field 'genesis_id': ${data}`
      );
    if (!Array.isArray(data['versions']))
      throw new Error(
        `Response is missing required array field 'versions': ${data}`
      );
    return new Version(
      BuildVersion.from_obj_for_encoding(data['build']),
      data['genesis_hash_b64'],
      data['genesis_id'],
      data['versions']
    );
    /* eslint-enable dot-notation */
  }
}
