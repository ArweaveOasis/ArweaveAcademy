/**
 * NOTICE: This file was generated. Editing this file manually is not recommended.
 */
/* eslint-disable no-use-before-define */
import BaseModel from '../../basemodel';
/**
 * Account information at a given round.
 * Definition:
 * data/basics/userBalance.go : AccountData
 */
export class Account extends BaseModel {
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
    constructor({ address, amount, amountWithoutPendingRewards, pendingRewards, rewards, round, status, totalAppsOptedIn, totalAssetsOptedIn, totalBoxBytes, totalBoxes, totalCreatedApps, totalCreatedAssets, appsLocalState, appsTotalExtraPages, appsTotalSchema, assets, authAddr, closedAtRound, createdApps, createdAssets, createdAtRound, deleted, participation, rewardBase, sigType, }) {
        super();
        this.address = address;
        this.amount = amount;
        this.amountWithoutPendingRewards = amountWithoutPendingRewards;
        this.pendingRewards = pendingRewards;
        this.rewards = rewards;
        this.round = round;
        this.status = status;
        this.totalAppsOptedIn = totalAppsOptedIn;
        this.totalAssetsOptedIn = totalAssetsOptedIn;
        this.totalBoxBytes = totalBoxBytes;
        this.totalBoxes = totalBoxes;
        this.totalCreatedApps = totalCreatedApps;
        this.totalCreatedAssets = totalCreatedAssets;
        this.appsLocalState = appsLocalState;
        this.appsTotalExtraPages = appsTotalExtraPages;
        this.appsTotalSchema = appsTotalSchema;
        this.assets = assets;
        this.authAddr = authAddr;
        this.closedAtRound = closedAtRound;
        this.createdApps = createdApps;
        this.createdAssets = createdAssets;
        this.createdAtRound = createdAtRound;
        this.deleted = deleted;
        this.participation = participation;
        this.rewardBase = rewardBase;
        this.sigType = sigType;
        this.attribute_map = {
            address: 'address',
            amount: 'amount',
            amountWithoutPendingRewards: 'amount-without-pending-rewards',
            pendingRewards: 'pending-rewards',
            rewards: 'rewards',
            round: 'round',
            status: 'status',
            totalAppsOptedIn: 'total-apps-opted-in',
            totalAssetsOptedIn: 'total-assets-opted-in',
            totalBoxBytes: 'total-box-bytes',
            totalBoxes: 'total-boxes',
            totalCreatedApps: 'total-created-apps',
            totalCreatedAssets: 'total-created-assets',
            appsLocalState: 'apps-local-state',
            appsTotalExtraPages: 'apps-total-extra-pages',
            appsTotalSchema: 'apps-total-schema',
            assets: 'assets',
            authAddr: 'auth-addr',
            closedAtRound: 'closed-at-round',
            createdApps: 'created-apps',
            createdAssets: 'created-assets',
            createdAtRound: 'created-at-round',
            deleted: 'deleted',
            participation: 'participation',
            rewardBase: 'reward-base',
            sigType: 'sig-type',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['address'] === 'undefined')
            throw new Error(`Response is missing required field 'address': ${data}`);
        if (typeof data['amount'] === 'undefined')
            throw new Error(`Response is missing required field 'amount': ${data}`);
        if (typeof data['amount-without-pending-rewards'] === 'undefined')
            throw new Error(`Response is missing required field 'amount-without-pending-rewards': ${data}`);
        if (typeof data['pending-rewards'] === 'undefined')
            throw new Error(`Response is missing required field 'pending-rewards': ${data}`);
        if (typeof data['rewards'] === 'undefined')
            throw new Error(`Response is missing required field 'rewards': ${data}`);
        if (typeof data['round'] === 'undefined')
            throw new Error(`Response is missing required field 'round': ${data}`);
        if (typeof data['status'] === 'undefined')
            throw new Error(`Response is missing required field 'status': ${data}`);
        if (typeof data['total-apps-opted-in'] === 'undefined')
            throw new Error(`Response is missing required field 'total-apps-opted-in': ${data}`);
        if (typeof data['total-assets-opted-in'] === 'undefined')
            throw new Error(`Response is missing required field 'total-assets-opted-in': ${data}`);
        if (typeof data['total-box-bytes'] === 'undefined')
            throw new Error(`Response is missing required field 'total-box-bytes': ${data}`);
        if (typeof data['total-boxes'] === 'undefined')
            throw new Error(`Response is missing required field 'total-boxes': ${data}`);
        if (typeof data['total-created-apps'] === 'undefined')
            throw new Error(`Response is missing required field 'total-created-apps': ${data}`);
        if (typeof data['total-created-assets'] === 'undefined')
            throw new Error(`Response is missing required field 'total-created-assets': ${data}`);
        return new Account({
            address: data['address'],
            amount: data['amount'],
            amountWithoutPendingRewards: data['amount-without-pending-rewards'],
            pendingRewards: data['pending-rewards'],
            rewards: data['rewards'],
            round: data['round'],
            status: data['status'],
            totalAppsOptedIn: data['total-apps-opted-in'],
            totalAssetsOptedIn: data['total-assets-opted-in'],
            totalBoxBytes: data['total-box-bytes'],
            totalBoxes: data['total-boxes'],
            totalCreatedApps: data['total-created-apps'],
            totalCreatedAssets: data['total-created-assets'],
            appsLocalState: typeof data['apps-local-state'] !== 'undefined'
                ? data['apps-local-state'].map(ApplicationLocalState.from_obj_for_encoding)
                : undefined,
            appsTotalExtraPages: data['apps-total-extra-pages'],
            appsTotalSchema: typeof data['apps-total-schema'] !== 'undefined'
                ? ApplicationStateSchema.from_obj_for_encoding(data['apps-total-schema'])
                : undefined,
            assets: typeof data['assets'] !== 'undefined'
                ? data['assets'].map(AssetHolding.from_obj_for_encoding)
                : undefined,
            authAddr: data['auth-addr'],
            closedAtRound: data['closed-at-round'],
            createdApps: typeof data['created-apps'] !== 'undefined'
                ? data['created-apps'].map(Application.from_obj_for_encoding)
                : undefined,
            createdAssets: typeof data['created-assets'] !== 'undefined'
                ? data['created-assets'].map(Asset.from_obj_for_encoding)
                : undefined,
            createdAtRound: data['created-at-round'],
            deleted: data['deleted'],
            participation: typeof data['participation'] !== 'undefined'
                ? AccountParticipation.from_obj_for_encoding(data['participation'])
                : undefined,
            rewardBase: data['reward-base'],
            sigType: data['sig-type'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * AccountParticipation describes the parameters used by this account in consensus
 * protocol.
 */
export class AccountParticipation extends BaseModel {
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
    constructor({ selectionParticipationKey, voteFirstValid, voteKeyDilution, voteLastValid, voteParticipationKey, stateProofKey, }) {
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
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['selection-participation-key'] === 'undefined')
            throw new Error(`Response is missing required field 'selection-participation-key': ${data}`);
        if (typeof data['vote-first-valid'] === 'undefined')
            throw new Error(`Response is missing required field 'vote-first-valid': ${data}`);
        if (typeof data['vote-key-dilution'] === 'undefined')
            throw new Error(`Response is missing required field 'vote-key-dilution': ${data}`);
        if (typeof data['vote-last-valid'] === 'undefined')
            throw new Error(`Response is missing required field 'vote-last-valid': ${data}`);
        if (typeof data['vote-participation-key'] === 'undefined')
            throw new Error(`Response is missing required field 'vote-participation-key': ${data}`);
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
 *
 */
export class AccountResponse extends BaseModel {
    /**
     * Creates a new `AccountResponse` object.
     * @param account - Account information at a given round.
     * Definition:
     * data/basics/userBalance.go : AccountData
     * @param currentRound - Round at which the results were computed.
     */
    constructor({ account, currentRound, }) {
        super();
        this.account = account;
        this.currentRound = currentRound;
        this.attribute_map = {
            account: 'account',
            currentRound: 'current-round',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['account'] === 'undefined')
            throw new Error(`Response is missing required field 'account': ${data}`);
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        return new AccountResponse({
            account: Account.from_obj_for_encoding(data['account']),
            currentRound: data['current-round'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Application state delta.
 */
export class AccountStateDelta extends BaseModel {
    /**
     * Creates a new `AccountStateDelta` object.
     * @param address -
     * @param delta - Application state delta.
     */
    constructor({ address, delta, }) {
        super();
        this.address = address;
        this.delta = delta;
        this.attribute_map = {
            address: 'address',
            delta: 'delta',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['address'] === 'undefined')
            throw new Error(`Response is missing required field 'address': ${data}`);
        if (!Array.isArray(data['delta']))
            throw new Error(`Response is missing required array field 'delta': ${data}`);
        return new AccountStateDelta({
            address: data['address'],
            delta: data['delta'].map(EvalDeltaKeyValue.from_obj_for_encoding),
        });
        /* eslint-enable dot-notation */
    }
}
/**
 *
 */
export class AccountsResponse extends BaseModel {
    /**
     * Creates a new `AccountsResponse` object.
     * @param accounts -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ accounts, currentRound, nextToken, }) {
        super();
        this.accounts = accounts;
        this.currentRound = currentRound;
        this.nextToken = nextToken;
        this.attribute_map = {
            accounts: 'accounts',
            currentRound: 'current-round',
            nextToken: 'next-token',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (!Array.isArray(data['accounts']))
            throw new Error(`Response is missing required array field 'accounts': ${data}`);
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        return new AccountsResponse({
            accounts: data['accounts'].map(Account.from_obj_for_encoding),
            currentRound: data['current-round'],
            nextToken: data['next-token'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Application index and its parameters
 */
export class Application extends BaseModel {
    /**
     * Creates a new `Application` object.
     * @param id - (appidx) application index.
     * @param params - (appparams) application parameters.
     * @param createdAtRound - Round when this application was created.
     * @param deleted - Whether or not this application is currently deleted.
     * @param deletedAtRound - Round when this application was deleted.
     */
    constructor({ id, params, createdAtRound, deleted, deletedAtRound, }) {
        super();
        this.id = id;
        this.params = params;
        this.createdAtRound = createdAtRound;
        this.deleted = deleted;
        this.deletedAtRound = deletedAtRound;
        this.attribute_map = {
            id: 'id',
            params: 'params',
            createdAtRound: 'created-at-round',
            deleted: 'deleted',
            deletedAtRound: 'deleted-at-round',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['id'] === 'undefined')
            throw new Error(`Response is missing required field 'id': ${data}`);
        if (typeof data['params'] === 'undefined')
            throw new Error(`Response is missing required field 'params': ${data}`);
        return new Application({
            id: data['id'],
            params: ApplicationParams.from_obj_for_encoding(data['params']),
            createdAtRound: data['created-at-round'],
            deleted: data['deleted'],
            deletedAtRound: data['deleted-at-round'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Stores local state associated with an application.
 */
export class ApplicationLocalState extends BaseModel {
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
    constructor({ id, schema, closedOutAtRound, deleted, keyValue, optedInAtRound, }) {
        super();
        this.id = id;
        this.schema = schema;
        this.closedOutAtRound = closedOutAtRound;
        this.deleted = deleted;
        this.keyValue = keyValue;
        this.optedInAtRound = optedInAtRound;
        this.attribute_map = {
            id: 'id',
            schema: 'schema',
            closedOutAtRound: 'closed-out-at-round',
            deleted: 'deleted',
            keyValue: 'key-value',
            optedInAtRound: 'opted-in-at-round',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['id'] === 'undefined')
            throw new Error(`Response is missing required field 'id': ${data}`);
        if (typeof data['schema'] === 'undefined')
            throw new Error(`Response is missing required field 'schema': ${data}`);
        return new ApplicationLocalState({
            id: data['id'],
            schema: ApplicationStateSchema.from_obj_for_encoding(data['schema']),
            closedOutAtRound: data['closed-out-at-round'],
            deleted: data['deleted'],
            keyValue: typeof data['key-value'] !== 'undefined'
                ? data['key-value'].map(TealKeyValue.from_obj_for_encoding)
                : undefined,
            optedInAtRound: data['opted-in-at-round'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 *
 */
export class ApplicationLocalStatesResponse extends BaseModel {
    /**
     * Creates a new `ApplicationLocalStatesResponse` object.
     * @param appsLocalStates -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ appsLocalStates, currentRound, nextToken, }) {
        super();
        this.appsLocalStates = appsLocalStates;
        this.currentRound = currentRound;
        this.nextToken = nextToken;
        this.attribute_map = {
            appsLocalStates: 'apps-local-states',
            currentRound: 'current-round',
            nextToken: 'next-token',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (!Array.isArray(data['apps-local-states']))
            throw new Error(`Response is missing required array field 'apps-local-states': ${data}`);
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        return new ApplicationLocalStatesResponse({
            appsLocalStates: data['apps-local-states'].map(ApplicationLocalState.from_obj_for_encoding),
            currentRound: data['current-round'],
            nextToken: data['next-token'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Stores the global information associated with an application.
 */
export class ApplicationLogData extends BaseModel {
    /**
     * Creates a new `ApplicationLogData` object.
     * @param logs - (lg) Logs for the application being executed by the transaction.
     * @param txid - Transaction ID
     */
    constructor({ logs, txid }) {
        super();
        this.logs = logs;
        this.txid = txid;
        this.attribute_map = {
            logs: 'logs',
            txid: 'txid',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (!Array.isArray(data['logs']))
            throw new Error(`Response is missing required array field 'logs': ${data}`);
        if (typeof data['txid'] === 'undefined')
            throw new Error(`Response is missing required field 'txid': ${data}`);
        return new ApplicationLogData({
            logs: data['logs'],
            txid: data['txid'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 *
 */
export class ApplicationLogsResponse extends BaseModel {
    /**
     * Creates a new `ApplicationLogsResponse` object.
     * @param applicationId - (appidx) application index.
     * @param currentRound - Round at which the results were computed.
     * @param logData -
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ applicationId, currentRound, logData, nextToken, }) {
        super();
        this.applicationId = applicationId;
        this.currentRound = currentRound;
        this.logData = logData;
        this.nextToken = nextToken;
        this.attribute_map = {
            applicationId: 'application-id',
            currentRound: 'current-round',
            logData: 'log-data',
            nextToken: 'next-token',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['application-id'] === 'undefined')
            throw new Error(`Response is missing required field 'application-id': ${data}`);
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        return new ApplicationLogsResponse({
            applicationId: data['application-id'],
            currentRound: data['current-round'],
            logData: typeof data['log-data'] !== 'undefined'
                ? data['log-data'].map(ApplicationLogData.from_obj_for_encoding)
                : undefined,
            nextToken: data['next-token'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Stores the global information associated with an application.
 */
export class ApplicationParams extends BaseModel {
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
    constructor({ approvalProgram, clearStateProgram, creator, extraProgramPages, globalState, globalStateSchema, localStateSchema, }) {
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
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['approval-program'] === 'undefined')
            throw new Error(`Response is missing required field 'approval-program': ${data}`);
        if (typeof data['clear-state-program'] === 'undefined')
            throw new Error(`Response is missing required field 'clear-state-program': ${data}`);
        return new ApplicationParams({
            approvalProgram: data['approval-program'],
            clearStateProgram: data['clear-state-program'],
            creator: data['creator'],
            extraProgramPages: data['extra-program-pages'],
            globalState: typeof data['global-state'] !== 'undefined'
                ? data['global-state'].map(TealKeyValue.from_obj_for_encoding)
                : undefined,
            globalStateSchema: typeof data['global-state-schema'] !== 'undefined'
                ? ApplicationStateSchema.from_obj_for_encoding(data['global-state-schema'])
                : undefined,
            localStateSchema: typeof data['local-state-schema'] !== 'undefined'
                ? ApplicationStateSchema.from_obj_for_encoding(data['local-state-schema'])
                : undefined,
        });
        /* eslint-enable dot-notation */
    }
}
/**
 *
 */
export class ApplicationResponse extends BaseModel {
    /**
     * Creates a new `ApplicationResponse` object.
     * @param currentRound - Round at which the results were computed.
     * @param application - Application index and its parameters
     */
    constructor({ currentRound, application, }) {
        super();
        this.currentRound = currentRound;
        this.application = application;
        this.attribute_map = {
            currentRound: 'current-round',
            application: 'application',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        return new ApplicationResponse({
            currentRound: data['current-round'],
            application: typeof data['application'] !== 'undefined'
                ? Application.from_obj_for_encoding(data['application'])
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
     * Creates a new `ApplicationStateSchema` object.
     * @param numByteSlice - (nbs) num of byte slices.
     * @param numUint - (nui) num of uints.
     */
    constructor({ numByteSlice, numUint, }) {
        super();
        this.numByteSlice = numByteSlice;
        this.numUint = numUint;
        this.attribute_map = {
            numByteSlice: 'num-byte-slice',
            numUint: 'num-uint',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['num-byte-slice'] === 'undefined')
            throw new Error(`Response is missing required field 'num-byte-slice': ${data}`);
        if (typeof data['num-uint'] === 'undefined')
            throw new Error(`Response is missing required field 'num-uint': ${data}`);
        return new ApplicationStateSchema({
            numByteSlice: data['num-byte-slice'],
            numUint: data['num-uint'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 *
 */
export class ApplicationsResponse extends BaseModel {
    /**
     * Creates a new `ApplicationsResponse` object.
     * @param applications -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ applications, currentRound, nextToken, }) {
        super();
        this.applications = applications;
        this.currentRound = currentRound;
        this.nextToken = nextToken;
        this.attribute_map = {
            applications: 'applications',
            currentRound: 'current-round',
            nextToken: 'next-token',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (!Array.isArray(data['applications']))
            throw new Error(`Response is missing required array field 'applications': ${data}`);
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        return new ApplicationsResponse({
            applications: data['applications'].map(Application.from_obj_for_encoding),
            currentRound: data['current-round'],
            nextToken: data['next-token'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Specifies both the unique identifier and the parameters for an asset
 */
export class Asset extends BaseModel {
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
    constructor({ index, params, createdAtRound, deleted, destroyedAtRound, }) {
        super();
        this.index = index;
        this.params = params;
        this.createdAtRound = createdAtRound;
        this.deleted = deleted;
        this.destroyedAtRound = destroyedAtRound;
        this.attribute_map = {
            index: 'index',
            params: 'params',
            createdAtRound: 'created-at-round',
            deleted: 'deleted',
            destroyedAtRound: 'destroyed-at-round',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['index'] === 'undefined')
            throw new Error(`Response is missing required field 'index': ${data}`);
        if (typeof data['params'] === 'undefined')
            throw new Error(`Response is missing required field 'params': ${data}`);
        return new Asset({
            index: data['index'],
            params: AssetParams.from_obj_for_encoding(data['params']),
            createdAtRound: data['created-at-round'],
            deleted: data['deleted'],
            destroyedAtRound: data['destroyed-at-round'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 *
 */
export class AssetBalancesResponse extends BaseModel {
    /**
     * Creates a new `AssetBalancesResponse` object.
     * @param balances -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ balances, currentRound, nextToken, }) {
        super();
        this.balances = balances;
        this.currentRound = currentRound;
        this.nextToken = nextToken;
        this.attribute_map = {
            balances: 'balances',
            currentRound: 'current-round',
            nextToken: 'next-token',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (!Array.isArray(data['balances']))
            throw new Error(`Response is missing required array field 'balances': ${data}`);
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        return new AssetBalancesResponse({
            balances: data['balances'].map(MiniAssetHolding.from_obj_for_encoding),
            currentRound: data['current-round'],
            nextToken: data['next-token'],
        });
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
     * Creates a new `AssetHolding` object.
     * @param amount - (a) number of units held.
     * @param assetId - Asset ID of the holding.
     * @param isFrozen - (f) whether or not the holding is frozen.
     * @param deleted - Whether or not the asset holding is currently deleted from its account.
     * @param optedInAtRound - Round during which the account opted into this asset holding.
     * @param optedOutAtRound - Round during which the account opted out of this asset holding.
     */
    constructor({ amount, assetId, isFrozen, deleted, optedInAtRound, optedOutAtRound, }) {
        super();
        this.amount = amount;
        this.assetId = assetId;
        this.isFrozen = isFrozen;
        this.deleted = deleted;
        this.optedInAtRound = optedInAtRound;
        this.optedOutAtRound = optedOutAtRound;
        this.attribute_map = {
            amount: 'amount',
            assetId: 'asset-id',
            isFrozen: 'is-frozen',
            deleted: 'deleted',
            optedInAtRound: 'opted-in-at-round',
            optedOutAtRound: 'opted-out-at-round',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['amount'] === 'undefined')
            throw new Error(`Response is missing required field 'amount': ${data}`);
        if (typeof data['asset-id'] === 'undefined')
            throw new Error(`Response is missing required field 'asset-id': ${data}`);
        if (typeof data['is-frozen'] === 'undefined')
            throw new Error(`Response is missing required field 'is-frozen': ${data}`);
        return new AssetHolding({
            amount: data['amount'],
            assetId: data['asset-id'],
            isFrozen: data['is-frozen'],
            deleted: data['deleted'],
            optedInAtRound: data['opted-in-at-round'],
            optedOutAtRound: data['opted-out-at-round'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 *
 */
export class AssetHoldingsResponse extends BaseModel {
    /**
     * Creates a new `AssetHoldingsResponse` object.
     * @param assets -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ assets, currentRound, nextToken, }) {
        super();
        this.assets = assets;
        this.currentRound = currentRound;
        this.nextToken = nextToken;
        this.attribute_map = {
            assets: 'assets',
            currentRound: 'current-round',
            nextToken: 'next-token',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (!Array.isArray(data['assets']))
            throw new Error(`Response is missing required array field 'assets': ${data}`);
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        return new AssetHoldingsResponse({
            assets: data['assets'].map(AssetHolding.from_obj_for_encoding),
            currentRound: data['current-round'],
            nextToken: data['next-token'],
        });
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
    constructor({ creator, decimals, total, clawback, defaultFrozen, freeze, manager, metadataHash, name, nameB64, reserve, unitName, unitNameB64, url, urlB64, }) {
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
    static from_obj_for_encoding(data) {
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
 *
 */
export class AssetResponse extends BaseModel {
    /**
     * Creates a new `AssetResponse` object.
     * @param asset - Specifies both the unique identifier and the parameters for an asset
     * @param currentRound - Round at which the results were computed.
     */
    constructor({ asset, currentRound, }) {
        super();
        this.asset = asset;
        this.currentRound = currentRound;
        this.attribute_map = {
            asset: 'asset',
            currentRound: 'current-round',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['asset'] === 'undefined')
            throw new Error(`Response is missing required field 'asset': ${data}`);
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        return new AssetResponse({
            asset: Asset.from_obj_for_encoding(data['asset']),
            currentRound: data['current-round'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 *
 */
export class AssetsResponse extends BaseModel {
    /**
     * Creates a new `AssetsResponse` object.
     * @param assets -
     * @param currentRound - Round at which the results were computed.
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ assets, currentRound, nextToken, }) {
        super();
        this.assets = assets;
        this.currentRound = currentRound;
        this.nextToken = nextToken;
        this.attribute_map = {
            assets: 'assets',
            currentRound: 'current-round',
            nextToken: 'next-token',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (!Array.isArray(data['assets']))
            throw new Error(`Response is missing required array field 'assets': ${data}`);
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        return new AssetsResponse({
            assets: data['assets'].map(Asset.from_obj_for_encoding),
            currentRound: data['current-round'],
            nextToken: data['next-token'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Block information.
 * Definition:
 * data/bookkeeping/block.go : Block
 */
export class Block extends BaseModel {
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
    constructor({ genesisHash, genesisId, previousBlockHash, round, seed, timestamp, transactionsRoot, transactionsRootSha256, participationUpdates, rewards, stateProofTracking, transactions, txnCounter, upgradeState, upgradeVote, }) {
        super();
        this.genesisHash =
            typeof genesisHash === 'string'
                ? new Uint8Array(Buffer.from(genesisHash, 'base64'))
                : genesisHash;
        this.genesisId = genesisId;
        this.previousBlockHash =
            typeof previousBlockHash === 'string'
                ? new Uint8Array(Buffer.from(previousBlockHash, 'base64'))
                : previousBlockHash;
        this.round = round;
        this.seed =
            typeof seed === 'string'
                ? new Uint8Array(Buffer.from(seed, 'base64'))
                : seed;
        this.timestamp = timestamp;
        this.transactionsRoot =
            typeof transactionsRoot === 'string'
                ? new Uint8Array(Buffer.from(transactionsRoot, 'base64'))
                : transactionsRoot;
        this.transactionsRootSha256 =
            typeof transactionsRootSha256 === 'string'
                ? new Uint8Array(Buffer.from(transactionsRootSha256, 'base64'))
                : transactionsRootSha256;
        this.participationUpdates = participationUpdates;
        this.rewards = rewards;
        this.stateProofTracking = stateProofTracking;
        this.transactions = transactions;
        this.txnCounter = txnCounter;
        this.upgradeState = upgradeState;
        this.upgradeVote = upgradeVote;
        this.attribute_map = {
            genesisHash: 'genesis-hash',
            genesisId: 'genesis-id',
            previousBlockHash: 'previous-block-hash',
            round: 'round',
            seed: 'seed',
            timestamp: 'timestamp',
            transactionsRoot: 'transactions-root',
            transactionsRootSha256: 'transactions-root-sha256',
            participationUpdates: 'participation-updates',
            rewards: 'rewards',
            stateProofTracking: 'state-proof-tracking',
            transactions: 'transactions',
            txnCounter: 'txn-counter',
            upgradeState: 'upgrade-state',
            upgradeVote: 'upgrade-vote',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['genesis-hash'] === 'undefined')
            throw new Error(`Response is missing required field 'genesis-hash': ${data}`);
        if (typeof data['genesis-id'] === 'undefined')
            throw new Error(`Response is missing required field 'genesis-id': ${data}`);
        if (typeof data['previous-block-hash'] === 'undefined')
            throw new Error(`Response is missing required field 'previous-block-hash': ${data}`);
        if (typeof data['round'] === 'undefined')
            throw new Error(`Response is missing required field 'round': ${data}`);
        if (typeof data['seed'] === 'undefined')
            throw new Error(`Response is missing required field 'seed': ${data}`);
        if (typeof data['timestamp'] === 'undefined')
            throw new Error(`Response is missing required field 'timestamp': ${data}`);
        if (typeof data['transactions-root'] === 'undefined')
            throw new Error(`Response is missing required field 'transactions-root': ${data}`);
        if (typeof data['transactions-root-sha256'] === 'undefined')
            throw new Error(`Response is missing required field 'transactions-root-sha256': ${data}`);
        return new Block({
            genesisHash: data['genesis-hash'],
            genesisId: data['genesis-id'],
            previousBlockHash: data['previous-block-hash'],
            round: data['round'],
            seed: data['seed'],
            timestamp: data['timestamp'],
            transactionsRoot: data['transactions-root'],
            transactionsRootSha256: data['transactions-root-sha256'],
            participationUpdates: typeof data['participation-updates'] !== 'undefined'
                ? ParticipationUpdates.from_obj_for_encoding(data['participation-updates'])
                : undefined,
            rewards: typeof data['rewards'] !== 'undefined'
                ? BlockRewards.from_obj_for_encoding(data['rewards'])
                : undefined,
            stateProofTracking: typeof data['state-proof-tracking'] !== 'undefined'
                ? data['state-proof-tracking'].map(StateProofTracking.from_obj_for_encoding)
                : undefined,
            transactions: typeof data['transactions'] !== 'undefined'
                ? data['transactions'].map(Transaction.from_obj_for_encoding)
                : undefined,
            txnCounter: data['txn-counter'],
            upgradeState: typeof data['upgrade-state'] !== 'undefined'
                ? BlockUpgradeState.from_obj_for_encoding(data['upgrade-state'])
                : undefined,
            upgradeVote: typeof data['upgrade-vote'] !== 'undefined'
                ? BlockUpgradeVote.from_obj_for_encoding(data['upgrade-vote'])
                : undefined,
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Fields relating to rewards,
 */
export class BlockRewards extends BaseModel {
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
    constructor({ feeSink, rewardsCalculationRound, rewardsLevel, rewardsPool, rewardsRate, rewardsResidue, }) {
        super();
        this.feeSink = feeSink;
        this.rewardsCalculationRound = rewardsCalculationRound;
        this.rewardsLevel = rewardsLevel;
        this.rewardsPool = rewardsPool;
        this.rewardsRate = rewardsRate;
        this.rewardsResidue = rewardsResidue;
        this.attribute_map = {
            feeSink: 'fee-sink',
            rewardsCalculationRound: 'rewards-calculation-round',
            rewardsLevel: 'rewards-level',
            rewardsPool: 'rewards-pool',
            rewardsRate: 'rewards-rate',
            rewardsResidue: 'rewards-residue',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['fee-sink'] === 'undefined')
            throw new Error(`Response is missing required field 'fee-sink': ${data}`);
        if (typeof data['rewards-calculation-round'] === 'undefined')
            throw new Error(`Response is missing required field 'rewards-calculation-round': ${data}`);
        if (typeof data['rewards-level'] === 'undefined')
            throw new Error(`Response is missing required field 'rewards-level': ${data}`);
        if (typeof data['rewards-pool'] === 'undefined')
            throw new Error(`Response is missing required field 'rewards-pool': ${data}`);
        if (typeof data['rewards-rate'] === 'undefined')
            throw new Error(`Response is missing required field 'rewards-rate': ${data}`);
        if (typeof data['rewards-residue'] === 'undefined')
            throw new Error(`Response is missing required field 'rewards-residue': ${data}`);
        return new BlockRewards({
            feeSink: data['fee-sink'],
            rewardsCalculationRound: data['rewards-calculation-round'],
            rewardsLevel: data['rewards-level'],
            rewardsPool: data['rewards-pool'],
            rewardsRate: data['rewards-rate'],
            rewardsResidue: data['rewards-residue'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Fields relating to a protocol upgrade.
 */
export class BlockUpgradeState extends BaseModel {
    /**
     * Creates a new `BlockUpgradeState` object.
     * @param currentProtocol - (proto) The current protocol version.
     * @param nextProtocol - (nextproto) The next proposed protocol version.
     * @param nextProtocolApprovals - (nextyes) Number of blocks which approved the protocol upgrade.
     * @param nextProtocolSwitchOn - (nextswitch) Round on which the protocol upgrade will take effect.
     * @param nextProtocolVoteBefore - (nextbefore) Deadline round for this protocol upgrade (No votes will be consider
     * after this round).
     */
    constructor({ currentProtocol, nextProtocol, nextProtocolApprovals, nextProtocolSwitchOn, nextProtocolVoteBefore, }) {
        super();
        this.currentProtocol = currentProtocol;
        this.nextProtocol = nextProtocol;
        this.nextProtocolApprovals = nextProtocolApprovals;
        this.nextProtocolSwitchOn = nextProtocolSwitchOn;
        this.nextProtocolVoteBefore = nextProtocolVoteBefore;
        this.attribute_map = {
            currentProtocol: 'current-protocol',
            nextProtocol: 'next-protocol',
            nextProtocolApprovals: 'next-protocol-approvals',
            nextProtocolSwitchOn: 'next-protocol-switch-on',
            nextProtocolVoteBefore: 'next-protocol-vote-before',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['current-protocol'] === 'undefined')
            throw new Error(`Response is missing required field 'current-protocol': ${data}`);
        return new BlockUpgradeState({
            currentProtocol: data['current-protocol'],
            nextProtocol: data['next-protocol'],
            nextProtocolApprovals: data['next-protocol-approvals'],
            nextProtocolSwitchOn: data['next-protocol-switch-on'],
            nextProtocolVoteBefore: data['next-protocol-vote-before'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Fields relating to voting for a protocol upgrade.
 */
export class BlockUpgradeVote extends BaseModel {
    /**
     * Creates a new `BlockUpgradeVote` object.
     * @param upgradeApprove - (upgradeyes) Indicates a yes vote for the current proposal.
     * @param upgradeDelay - (upgradedelay) Indicates the time between acceptance and execution.
     * @param upgradePropose - (upgradeprop) Indicates a proposed upgrade.
     */
    constructor({ upgradeApprove, upgradeDelay, upgradePropose, }) {
        super();
        this.upgradeApprove = upgradeApprove;
        this.upgradeDelay = upgradeDelay;
        this.upgradePropose = upgradePropose;
        this.attribute_map = {
            upgradeApprove: 'upgrade-approve',
            upgradeDelay: 'upgrade-delay',
            upgradePropose: 'upgrade-propose',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new BlockUpgradeVote({
            upgradeApprove: data['upgrade-approve'],
            upgradeDelay: data['upgrade-delay'],
            upgradePropose: data['upgrade-propose'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Box name and its content.
 */
export class Box extends BaseModel {
    /**
     * Creates a new `Box` object.
     * @param name - (name) box name, base64 encoded
     * @param value - (value) box value, base64 encoded.
     */
    constructor({ name, value, }) {
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
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['name'] === 'undefined')
            throw new Error(`Response is missing required field 'name': ${data}`);
        if (typeof data['value'] === 'undefined')
            throw new Error(`Response is missing required field 'value': ${data}`);
        return new Box({
            name: data['name'],
            value: data['value'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Box descriptor describes an app box without a value.
 */
export class BoxDescriptor extends BaseModel {
    /**
     * Creates a new `BoxDescriptor` object.
     * @param name - Base64 encoded box name
     */
    constructor({ name }) {
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
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['name'] === 'undefined')
            throw new Error(`Response is missing required field 'name': ${data}`);
        return new BoxDescriptor({
            name: data['name'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Box names of an application
 */
export class BoxesResponse extends BaseModel {
    /**
     * Creates a new `BoxesResponse` object.
     * @param applicationId - (appidx) application index.
     * @param boxes -
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ applicationId, boxes, nextToken, }) {
        super();
        this.applicationId = applicationId;
        this.boxes = boxes;
        this.nextToken = nextToken;
        this.attribute_map = {
            applicationId: 'application-id',
            boxes: 'boxes',
            nextToken: 'next-token',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['application-id'] === 'undefined')
            throw new Error(`Response is missing required field 'application-id': ${data}`);
        if (!Array.isArray(data['boxes']))
            throw new Error(`Response is missing required array field 'boxes': ${data}`);
        return new BoxesResponse({
            applicationId: data['application-id'],
            boxes: data['boxes'].map(BoxDescriptor.from_obj_for_encoding),
            nextToken: data['next-token'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Response for errors
 */
export class ErrorResponse extends BaseModel {
    /**
     * Creates a new `ErrorResponse` object.
     * @param message -
     * @param data -
     */
    constructor({ message, data, }) {
        super();
        this.message = message;
        this.data = data;
        this.attribute_map = {
            message: 'message',
            data: 'data',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['message'] === 'undefined')
            throw new Error(`Response is missing required field 'message': ${data}`);
        return new ErrorResponse({
            message: data['message'],
            data: data['data'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Represents a TEAL value delta.
 */
export class EvalDelta extends BaseModel {
    /**
     * Creates a new `EvalDelta` object.
     * @param action - (at) delta action.
     * @param bytes - (bs) bytes value.
     * @param uint - (ui) uint value.
     */
    constructor({ action, bytes, uint, }) {
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
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['action'] === 'undefined')
            throw new Error(`Response is missing required field 'action': ${data}`);
        return new EvalDelta({
            action: data['action'],
            bytes: data['bytes'],
            uint: data['uint'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Key-value pairs for StateDelta.
 */
export class EvalDeltaKeyValue extends BaseModel {
    /**
     * Creates a new `EvalDeltaKeyValue` object.
     * @param key -
     * @param value - Represents a TEAL value delta.
     */
    constructor({ key, value }) {
        super();
        this.key = key;
        this.value = value;
        this.attribute_map = {
            key: 'key',
            value: 'value',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['key'] === 'undefined')
            throw new Error(`Response is missing required field 'key': ${data}`);
        if (typeof data['value'] === 'undefined')
            throw new Error(`Response is missing required field 'value': ${data}`);
        return new EvalDeltaKeyValue({
            key: data['key'],
            value: EvalDelta.from_obj_for_encoding(data['value']),
        });
        /* eslint-enable dot-notation */
    }
}
export class HashFactory extends BaseModel {
    /**
     * Creates a new `HashFactory` object.
     * @param hashType - (t)
     */
    constructor({ hashType }) {
        super();
        this.hashType = hashType;
        this.attribute_map = {
            hashType: 'hash-type',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new HashFactory({
            hashType: data['hash-type'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * A health check response.
 */
export class HealthCheck extends BaseModel {
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
    constructor({ dbAvailable, isMigrating, message, round, version, data, errors, }) {
        super();
        this.dbAvailable = dbAvailable;
        this.isMigrating = isMigrating;
        this.message = message;
        this.round = round;
        this.version = version;
        this.data = data;
        this.errors = errors;
        this.attribute_map = {
            dbAvailable: 'db-available',
            isMigrating: 'is-migrating',
            message: 'message',
            round: 'round',
            version: 'version',
            data: 'data',
            errors: 'errors',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['db-available'] === 'undefined')
            throw new Error(`Response is missing required field 'db-available': ${data}`);
        if (typeof data['is-migrating'] === 'undefined')
            throw new Error(`Response is missing required field 'is-migrating': ${data}`);
        if (typeof data['message'] === 'undefined')
            throw new Error(`Response is missing required field 'message': ${data}`);
        if (typeof data['round'] === 'undefined')
            throw new Error(`Response is missing required field 'round': ${data}`);
        if (typeof data['version'] === 'undefined')
            throw new Error(`Response is missing required field 'version': ${data}`);
        return new HealthCheck({
            dbAvailable: data['db-available'],
            isMigrating: data['is-migrating'],
            message: data['message'],
            round: data['round'],
            version: data['version'],
            data: data['data'],
            errors: data['errors'],
        });
        /* eslint-enable dot-notation */
    }
}
export class IndexerStateProofMessage extends BaseModel {
    /**
     * Creates a new `IndexerStateProofMessage` object.
     * @param blockHeadersCommitment - (b)
     * @param firstAttestedRound - (f)
     * @param latestAttestedRound - (l)
     * @param lnProvenWeight - (P)
     * @param votersCommitment - (v)
     */
    constructor({ blockHeadersCommitment, firstAttestedRound, latestAttestedRound, lnProvenWeight, votersCommitment, }) {
        super();
        this.blockHeadersCommitment =
            typeof blockHeadersCommitment === 'string'
                ? new Uint8Array(Buffer.from(blockHeadersCommitment, 'base64'))
                : blockHeadersCommitment;
        this.firstAttestedRound = firstAttestedRound;
        this.latestAttestedRound = latestAttestedRound;
        this.lnProvenWeight = lnProvenWeight;
        this.votersCommitment =
            typeof votersCommitment === 'string'
                ? new Uint8Array(Buffer.from(votersCommitment, 'base64'))
                : votersCommitment;
        this.attribute_map = {
            blockHeadersCommitment: 'block-headers-commitment',
            firstAttestedRound: 'first-attested-round',
            latestAttestedRound: 'latest-attested-round',
            lnProvenWeight: 'ln-proven-weight',
            votersCommitment: 'voters-commitment',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new IndexerStateProofMessage({
            blockHeadersCommitment: data['block-headers-commitment'],
            firstAttestedRound: data['first-attested-round'],
            latestAttestedRound: data['latest-attested-round'],
            lnProvenWeight: data['ln-proven-weight'],
            votersCommitment: data['voters-commitment'],
        });
        /* eslint-enable dot-notation */
    }
}
export class MerkleArrayProof extends BaseModel {
    /**
     * Creates a new `MerkleArrayProof` object.
     * @param hashFactory -
     * @param path - (pth)
     * @param treeDepth - (td)
     */
    constructor({ hashFactory, path, treeDepth, }) {
        super();
        this.hashFactory = hashFactory;
        this.path = path;
        this.treeDepth = treeDepth;
        this.attribute_map = {
            hashFactory: 'hash-factory',
            path: 'path',
            treeDepth: 'tree-depth',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new MerkleArrayProof({
            hashFactory: typeof data['hash-factory'] !== 'undefined'
                ? HashFactory.from_obj_for_encoding(data['hash-factory'])
                : undefined,
            path: data['path'],
            treeDepth: data['tree-depth'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * A simplified version of AssetHolding
 */
export class MiniAssetHolding extends BaseModel {
    /**
     * Creates a new `MiniAssetHolding` object.
     * @param address -
     * @param amount -
     * @param isFrozen -
     * @param deleted - Whether or not this asset holding is currently deleted from its account.
     * @param optedInAtRound - Round during which the account opted into the asset.
     * @param optedOutAtRound - Round during which the account opted out of the asset.
     */
    constructor({ address, amount, isFrozen, deleted, optedInAtRound, optedOutAtRound, }) {
        super();
        this.address = address;
        this.amount = amount;
        this.isFrozen = isFrozen;
        this.deleted = deleted;
        this.optedInAtRound = optedInAtRound;
        this.optedOutAtRound = optedOutAtRound;
        this.attribute_map = {
            address: 'address',
            amount: 'amount',
            isFrozen: 'is-frozen',
            deleted: 'deleted',
            optedInAtRound: 'opted-in-at-round',
            optedOutAtRound: 'opted-out-at-round',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['address'] === 'undefined')
            throw new Error(`Response is missing required field 'address': ${data}`);
        if (typeof data['amount'] === 'undefined')
            throw new Error(`Response is missing required field 'amount': ${data}`);
        if (typeof data['is-frozen'] === 'undefined')
            throw new Error(`Response is missing required field 'is-frozen': ${data}`);
        return new MiniAssetHolding({
            address: data['address'],
            amount: data['amount'],
            isFrozen: data['is-frozen'],
            deleted: data['deleted'],
            optedInAtRound: data['opted-in-at-round'],
            optedOutAtRound: data['opted-out-at-round'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Participation account data that needs to be checked/acted on by the network.
 */
export class ParticipationUpdates extends BaseModel {
    /**
     * Creates a new `ParticipationUpdates` object.
     * @param expiredParticipationAccounts - (partupdrmv) a list of online accounts that needs to be converted to offline
     * since their participation key expired.
     */
    constructor({ expiredParticipationAccounts, }) {
        super();
        this.expiredParticipationAccounts = expiredParticipationAccounts;
        this.attribute_map = {
            expiredParticipationAccounts: 'expired-participation-accounts',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new ParticipationUpdates({
            expiredParticipationAccounts: data['expired-participation-accounts'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * (sp) represents a state proof.
 * Definition:
 * crypto/stateproof/structs.go : StateProof
 */
export class StateProofFields extends BaseModel {
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
    constructor({ partProofs, positionsToReveal, reveals, saltVersion, sigCommit, sigProofs, signedWeight, }) {
        super();
        this.partProofs = partProofs;
        this.positionsToReveal = positionsToReveal;
        this.reveals = reveals;
        this.saltVersion = saltVersion;
        this.sigCommit =
            typeof sigCommit === 'string'
                ? new Uint8Array(Buffer.from(sigCommit, 'base64'))
                : sigCommit;
        this.sigProofs = sigProofs;
        this.signedWeight = signedWeight;
        this.attribute_map = {
            partProofs: 'part-proofs',
            positionsToReveal: 'positions-to-reveal',
            reveals: 'reveals',
            saltVersion: 'salt-version',
            sigCommit: 'sig-commit',
            sigProofs: 'sig-proofs',
            signedWeight: 'signed-weight',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new StateProofFields({
            partProofs: typeof data['part-proofs'] !== 'undefined'
                ? MerkleArrayProof.from_obj_for_encoding(data['part-proofs'])
                : undefined,
            positionsToReveal: data['positions-to-reveal'],
            reveals: typeof data['reveals'] !== 'undefined'
                ? data['reveals'].map(StateProofReveal.from_obj_for_encoding)
                : undefined,
            saltVersion: data['salt-version'],
            sigCommit: data['sig-commit'],
            sigProofs: typeof data['sig-proofs'] !== 'undefined'
                ? MerkleArrayProof.from_obj_for_encoding(data['sig-proofs'])
                : undefined,
            signedWeight: data['signed-weight'],
        });
        /* eslint-enable dot-notation */
    }
}
export class StateProofParticipant extends BaseModel {
    /**
     * Creates a new `StateProofParticipant` object.
     * @param verifier - (p)
     * @param weight - (w)
     */
    constructor({ verifier, weight, }) {
        super();
        this.verifier = verifier;
        this.weight = weight;
        this.attribute_map = {
            verifier: 'verifier',
            weight: 'weight',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new StateProofParticipant({
            verifier: typeof data['verifier'] !== 'undefined'
                ? StateProofVerifier.from_obj_for_encoding(data['verifier'])
                : undefined,
            weight: data['weight'],
        });
        /* eslint-enable dot-notation */
    }
}
export class StateProofReveal extends BaseModel {
    /**
     * Creates a new `StateProofReveal` object.
     * @param participant - (p)
     * @param position - The position in the signature and participants arrays corresponding to this
     * entry.
     * @param sigSlot - (s)
     */
    constructor({ participant, position, sigSlot, }) {
        super();
        this.participant = participant;
        this.position = position;
        this.sigSlot = sigSlot;
        this.attribute_map = {
            participant: 'participant',
            position: 'position',
            sigSlot: 'sig-slot',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new StateProofReveal({
            participant: typeof data['participant'] !== 'undefined'
                ? StateProofParticipant.from_obj_for_encoding(data['participant'])
                : undefined,
            position: data['position'],
            sigSlot: typeof data['sig-slot'] !== 'undefined'
                ? StateProofSigSlot.from_obj_for_encoding(data['sig-slot'])
                : undefined,
        });
        /* eslint-enable dot-notation */
    }
}
export class StateProofSigSlot extends BaseModel {
    /**
     * Creates a new `StateProofSigSlot` object.
     * @param lowerSigWeight - (l) The total weight of signatures in the lower-numbered slots.
     * @param signature -
     */
    constructor({ lowerSigWeight, signature, }) {
        super();
        this.lowerSigWeight = lowerSigWeight;
        this.signature = signature;
        this.attribute_map = {
            lowerSigWeight: 'lower-sig-weight',
            signature: 'signature',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new StateProofSigSlot({
            lowerSigWeight: data['lower-sig-weight'],
            signature: typeof data['signature'] !== 'undefined'
                ? StateProofSignature.from_obj_for_encoding(data['signature'])
                : undefined,
        });
        /* eslint-enable dot-notation */
    }
}
export class StateProofSignature extends BaseModel {
    /**
     * Creates a new `StateProofSignature` object.
     * @param falconSignature -
     * @param merkleArrayIndex -
     * @param proof -
     * @param verifyingKey - (vkey)
     */
    constructor({ falconSignature, merkleArrayIndex, proof, verifyingKey, }) {
        super();
        this.falconSignature =
            typeof falconSignature === 'string'
                ? new Uint8Array(Buffer.from(falconSignature, 'base64'))
                : falconSignature;
        this.merkleArrayIndex = merkleArrayIndex;
        this.proof = proof;
        this.verifyingKey =
            typeof verifyingKey === 'string'
                ? new Uint8Array(Buffer.from(verifyingKey, 'base64'))
                : verifyingKey;
        this.attribute_map = {
            falconSignature: 'falcon-signature',
            merkleArrayIndex: 'merkle-array-index',
            proof: 'proof',
            verifyingKey: 'verifying-key',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new StateProofSignature({
            falconSignature: data['falcon-signature'],
            merkleArrayIndex: data['merkle-array-index'],
            proof: typeof data['proof'] !== 'undefined'
                ? MerkleArrayProof.from_obj_for_encoding(data['proof'])
                : undefined,
            verifyingKey: data['verifying-key'],
        });
        /* eslint-enable dot-notation */
    }
}
export class StateProofTracking extends BaseModel {
    /**
     * Creates a new `StateProofTracking` object.
     * @param nextRound - (n) Next round for which we will accept a state proof transaction.
     * @param onlineTotalWeight - (t) The total number of microalgos held by the online accounts during the
     * StateProof round.
     * @param type - State Proof Type. Note the raw object uses map with this as key.
     * @param votersCommitment - (v) Root of a vector commitment containing online accounts that will help sign
     * the proof.
     */
    constructor({ nextRound, onlineTotalWeight, type, votersCommitment, }) {
        super();
        this.nextRound = nextRound;
        this.onlineTotalWeight = onlineTotalWeight;
        this.type = type;
        this.votersCommitment =
            typeof votersCommitment === 'string'
                ? new Uint8Array(Buffer.from(votersCommitment, 'base64'))
                : votersCommitment;
        this.attribute_map = {
            nextRound: 'next-round',
            onlineTotalWeight: 'online-total-weight',
            type: 'type',
            votersCommitment: 'voters-commitment',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new StateProofTracking({
            nextRound: data['next-round'],
            onlineTotalWeight: data['online-total-weight'],
            type: data['type'],
            votersCommitment: data['voters-commitment'],
        });
        /* eslint-enable dot-notation */
    }
}
export class StateProofVerifier extends BaseModel {
    /**
     * Creates a new `StateProofVerifier` object.
     * @param commitment - (cmt) Represents the root of the vector commitment tree.
     * @param keyLifetime - (lf) Key lifetime.
     */
    constructor({ commitment, keyLifetime, }) {
        super();
        this.commitment =
            typeof commitment === 'string'
                ? new Uint8Array(Buffer.from(commitment, 'base64'))
                : commitment;
        this.keyLifetime = keyLifetime;
        this.attribute_map = {
            commitment: 'commitment',
            keyLifetime: 'key-lifetime',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new StateProofVerifier({
            commitment: data['commitment'],
            keyLifetime: data['key-lifetime'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Represents a (apls) local-state or (apgs) global-state schema. These schemas
 * determine how much storage may be used in a local-state or global-state for an
 * application. The more space used, the larger minimum balance must be maintained
 * in the account holding the data.
 */
export class StateSchema extends BaseModel {
    /**
     * Creates a new `StateSchema` object.
     * @param numByteSlice - Maximum number of TEAL byte slices that may be stored in the key/value store.
     * @param numUint - Maximum number of TEAL uints that may be stored in the key/value store.
     */
    constructor({ numByteSlice, numUint, }) {
        super();
        this.numByteSlice = numByteSlice;
        this.numUint = numUint;
        this.attribute_map = {
            numByteSlice: 'num-byte-slice',
            numUint: 'num-uint',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['num-byte-slice'] === 'undefined')
            throw new Error(`Response is missing required field 'num-byte-slice': ${data}`);
        if (typeof data['num-uint'] === 'undefined')
            throw new Error(`Response is missing required field 'num-uint': ${data}`);
        return new StateSchema({
            numByteSlice: data['num-byte-slice'],
            numUint: data['num-uint'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Represents a key-value pair in an application store.
 */
export class TealKeyValue extends BaseModel {
    /**
     * Creates a new `TealKeyValue` object.
     * @param key -
     * @param value - Represents a TEAL value.
     */
    constructor({ key, value }) {
        super();
        this.key = key;
        this.value = value;
        this.attribute_map = {
            key: 'key',
            value: 'value',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['key'] === 'undefined')
            throw new Error(`Response is missing required field 'key': ${data}`);
        if (typeof data['value'] === 'undefined')
            throw new Error(`Response is missing required field 'value': ${data}`);
        return new TealKeyValue({
            key: data['key'],
            value: TealValue.from_obj_for_encoding(data['value']),
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Represents a TEAL value.
 */
export class TealValue extends BaseModel {
    /**
     * Creates a new `TealValue` object.
     * @param bytes - (tb) bytes value.
     * @param type - (tt) value type. Value `1` refers to **bytes**, value `2` refers to **uint**
     * @param uint - (ui) uint value.
     */
    constructor({ bytes, type, uint, }) {
        super();
        this.bytes = bytes;
        this.type = type;
        this.uint = uint;
        this.attribute_map = {
            bytes: 'bytes',
            type: 'type',
            uint: 'uint',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['bytes'] === 'undefined')
            throw new Error(`Response is missing required field 'bytes': ${data}`);
        if (typeof data['type'] === 'undefined')
            throw new Error(`Response is missing required field 'type': ${data}`);
        if (typeof data['uint'] === 'undefined')
            throw new Error(`Response is missing required field 'uint': ${data}`);
        return new TealValue({
            bytes: data['bytes'],
            type: data['type'],
            uint: data['uint'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Contains all fields common to all transactions and serves as an envelope to all
 * transactions type. Represents both regular and inner transactions.
 * Definition:
 * data/transactions/signedtxn.go : SignedTxn
 * data/transactions/transaction.go : Transaction
 */
export class Transaction extends BaseModel {
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
    constructor({ fee, firstValid, lastValid, sender, applicationTransaction, assetConfigTransaction, assetFreezeTransaction, assetTransferTransaction, authAddr, closeRewards, closingAmount, confirmedRound, createdApplicationIndex, createdAssetIndex, genesisHash, genesisId, globalStateDelta, group, id, innerTxns, intraRoundOffset, keyregTransaction, lease, localStateDelta, logs, note, paymentTransaction, receiverRewards, rekeyTo, roundTime, senderRewards, signature, stateProofTransaction, txType, }) {
        super();
        this.fee = fee;
        this.firstValid = firstValid;
        this.lastValid = lastValid;
        this.sender = sender;
        this.applicationTransaction = applicationTransaction;
        this.assetConfigTransaction = assetConfigTransaction;
        this.assetFreezeTransaction = assetFreezeTransaction;
        this.assetTransferTransaction = assetTransferTransaction;
        this.authAddr = authAddr;
        this.closeRewards = closeRewards;
        this.closingAmount = closingAmount;
        this.confirmedRound = confirmedRound;
        this.createdApplicationIndex = createdApplicationIndex;
        this.createdAssetIndex = createdAssetIndex;
        this.genesisHash =
            typeof genesisHash === 'string'
                ? new Uint8Array(Buffer.from(genesisHash, 'base64'))
                : genesisHash;
        this.genesisId = genesisId;
        this.globalStateDelta = globalStateDelta;
        this.group =
            typeof group === 'string'
                ? new Uint8Array(Buffer.from(group, 'base64'))
                : group;
        this.id = id;
        this.innerTxns = innerTxns;
        this.intraRoundOffset = intraRoundOffset;
        this.keyregTransaction = keyregTransaction;
        this.lease =
            typeof lease === 'string'
                ? new Uint8Array(Buffer.from(lease, 'base64'))
                : lease;
        this.localStateDelta = localStateDelta;
        this.logs = logs;
        this.note =
            typeof note === 'string'
                ? new Uint8Array(Buffer.from(note, 'base64'))
                : note;
        this.paymentTransaction = paymentTransaction;
        this.receiverRewards = receiverRewards;
        this.rekeyTo = rekeyTo;
        this.roundTime = roundTime;
        this.senderRewards = senderRewards;
        this.signature = signature;
        this.stateProofTransaction = stateProofTransaction;
        this.txType = txType;
        this.attribute_map = {
            fee: 'fee',
            firstValid: 'first-valid',
            lastValid: 'last-valid',
            sender: 'sender',
            applicationTransaction: 'application-transaction',
            assetConfigTransaction: 'asset-config-transaction',
            assetFreezeTransaction: 'asset-freeze-transaction',
            assetTransferTransaction: 'asset-transfer-transaction',
            authAddr: 'auth-addr',
            closeRewards: 'close-rewards',
            closingAmount: 'closing-amount',
            confirmedRound: 'confirmed-round',
            createdApplicationIndex: 'created-application-index',
            createdAssetIndex: 'created-asset-index',
            genesisHash: 'genesis-hash',
            genesisId: 'genesis-id',
            globalStateDelta: 'global-state-delta',
            group: 'group',
            id: 'id',
            innerTxns: 'inner-txns',
            intraRoundOffset: 'intra-round-offset',
            keyregTransaction: 'keyreg-transaction',
            lease: 'lease',
            localStateDelta: 'local-state-delta',
            logs: 'logs',
            note: 'note',
            paymentTransaction: 'payment-transaction',
            receiverRewards: 'receiver-rewards',
            rekeyTo: 'rekey-to',
            roundTime: 'round-time',
            senderRewards: 'sender-rewards',
            signature: 'signature',
            stateProofTransaction: 'state-proof-transaction',
            txType: 'tx-type',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['fee'] === 'undefined')
            throw new Error(`Response is missing required field 'fee': ${data}`);
        if (typeof data['first-valid'] === 'undefined')
            throw new Error(`Response is missing required field 'first-valid': ${data}`);
        if (typeof data['last-valid'] === 'undefined')
            throw new Error(`Response is missing required field 'last-valid': ${data}`);
        if (typeof data['sender'] === 'undefined')
            throw new Error(`Response is missing required field 'sender': ${data}`);
        return new Transaction({
            fee: data['fee'],
            firstValid: data['first-valid'],
            lastValid: data['last-valid'],
            sender: data['sender'],
            applicationTransaction: typeof data['application-transaction'] !== 'undefined'
                ? TransactionApplication.from_obj_for_encoding(data['application-transaction'])
                : undefined,
            assetConfigTransaction: typeof data['asset-config-transaction'] !== 'undefined'
                ? TransactionAssetConfig.from_obj_for_encoding(data['asset-config-transaction'])
                : undefined,
            assetFreezeTransaction: typeof data['asset-freeze-transaction'] !== 'undefined'
                ? TransactionAssetFreeze.from_obj_for_encoding(data['asset-freeze-transaction'])
                : undefined,
            assetTransferTransaction: typeof data['asset-transfer-transaction'] !== 'undefined'
                ? TransactionAssetTransfer.from_obj_for_encoding(data['asset-transfer-transaction'])
                : undefined,
            authAddr: data['auth-addr'],
            closeRewards: data['close-rewards'],
            closingAmount: data['closing-amount'],
            confirmedRound: data['confirmed-round'],
            createdApplicationIndex: data['created-application-index'],
            createdAssetIndex: data['created-asset-index'],
            genesisHash: data['genesis-hash'],
            genesisId: data['genesis-id'],
            globalStateDelta: typeof data['global-state-delta'] !== 'undefined'
                ? data['global-state-delta'].map(EvalDeltaKeyValue.from_obj_for_encoding)
                : undefined,
            group: data['group'],
            id: data['id'],
            innerTxns: typeof data['inner-txns'] !== 'undefined'
                ? data['inner-txns'].map(Transaction.from_obj_for_encoding)
                : undefined,
            intraRoundOffset: data['intra-round-offset'],
            keyregTransaction: typeof data['keyreg-transaction'] !== 'undefined'
                ? TransactionKeyreg.from_obj_for_encoding(data['keyreg-transaction'])
                : undefined,
            lease: data['lease'],
            localStateDelta: typeof data['local-state-delta'] !== 'undefined'
                ? data['local-state-delta'].map(AccountStateDelta.from_obj_for_encoding)
                : undefined,
            logs: data['logs'],
            note: data['note'],
            paymentTransaction: typeof data['payment-transaction'] !== 'undefined'
                ? TransactionPayment.from_obj_for_encoding(data['payment-transaction'])
                : undefined,
            receiverRewards: data['receiver-rewards'],
            rekeyTo: data['rekey-to'],
            roundTime: data['round-time'],
            senderRewards: data['sender-rewards'],
            signature: typeof data['signature'] !== 'undefined'
                ? TransactionSignature.from_obj_for_encoding(data['signature'])
                : undefined,
            stateProofTransaction: typeof data['state-proof-transaction'] !== 'undefined'
                ? TransactionStateProof.from_obj_for_encoding(data['state-proof-transaction'])
                : undefined,
            txType: data['tx-type'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Fields for application transactions.
 * Definition:
 * data/transactions/application.go : ApplicationCallTxnFields
 */
export class TransactionApplication extends BaseModel {
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
    constructor({ applicationId, accounts, applicationArgs, approvalProgram, clearStateProgram, extraProgramPages, foreignApps, foreignAssets, globalStateSchema, localStateSchema, onCompletion, }) {
        super();
        this.applicationId = applicationId;
        this.accounts = accounts;
        this.applicationArgs = applicationArgs;
        this.approvalProgram =
            typeof approvalProgram === 'string'
                ? new Uint8Array(Buffer.from(approvalProgram, 'base64'))
                : approvalProgram;
        this.clearStateProgram =
            typeof clearStateProgram === 'string'
                ? new Uint8Array(Buffer.from(clearStateProgram, 'base64'))
                : clearStateProgram;
        this.extraProgramPages = extraProgramPages;
        this.foreignApps = foreignApps;
        this.foreignAssets = foreignAssets;
        this.globalStateSchema = globalStateSchema;
        this.localStateSchema = localStateSchema;
        this.onCompletion = onCompletion;
        this.attribute_map = {
            applicationId: 'application-id',
            accounts: 'accounts',
            applicationArgs: 'application-args',
            approvalProgram: 'approval-program',
            clearStateProgram: 'clear-state-program',
            extraProgramPages: 'extra-program-pages',
            foreignApps: 'foreign-apps',
            foreignAssets: 'foreign-assets',
            globalStateSchema: 'global-state-schema',
            localStateSchema: 'local-state-schema',
            onCompletion: 'on-completion',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['application-id'] === 'undefined')
            throw new Error(`Response is missing required field 'application-id': ${data}`);
        return new TransactionApplication({
            applicationId: data['application-id'],
            accounts: data['accounts'],
            applicationArgs: data['application-args'],
            approvalProgram: data['approval-program'],
            clearStateProgram: data['clear-state-program'],
            extraProgramPages: data['extra-program-pages'],
            foreignApps: data['foreign-apps'],
            foreignAssets: data['foreign-assets'],
            globalStateSchema: typeof data['global-state-schema'] !== 'undefined'
                ? StateSchema.from_obj_for_encoding(data['global-state-schema'])
                : undefined,
            localStateSchema: typeof data['local-state-schema'] !== 'undefined'
                ? StateSchema.from_obj_for_encoding(data['local-state-schema'])
                : undefined,
            onCompletion: data['on-completion'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Fields for asset allocation, re-configuration, and destruction.
 * A zero value for asset-id indicates asset creation.
 * A zero value for the params indicates asset destruction.
 * Definition:
 * data/transactions/asset.go : AssetConfigTxnFields
 */
export class TransactionAssetConfig extends BaseModel {
    /**
     * Creates a new `TransactionAssetConfig` object.
     * @param assetId - (xaid) ID of the asset being configured or empty if creating.
     * @param params - AssetParams specifies the parameters for an asset.
     * (apar) when part of an AssetConfig transaction.
     * Definition:
     * data/transactions/asset.go : AssetParams
     */
    constructor({ assetId, params, }) {
        super();
        this.assetId = assetId;
        this.params = params;
        this.attribute_map = {
            assetId: 'asset-id',
            params: 'params',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new TransactionAssetConfig({
            assetId: data['asset-id'],
            params: typeof data['params'] !== 'undefined'
                ? AssetParams.from_obj_for_encoding(data['params'])
                : undefined,
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Fields for an asset freeze transaction.
 * Definition:
 * data/transactions/asset.go : AssetFreezeTxnFields
 */
export class TransactionAssetFreeze extends BaseModel {
    /**
     * Creates a new `TransactionAssetFreeze` object.
     * @param address - (fadd) Address of the account whose asset is being frozen or thawed.
     * @param assetId - (faid) ID of the asset being frozen or thawed.
     * @param newFreezeStatus - (afrz) The new freeze status.
     */
    constructor({ address, assetId, newFreezeStatus, }) {
        super();
        this.address = address;
        this.assetId = assetId;
        this.newFreezeStatus = newFreezeStatus;
        this.attribute_map = {
            address: 'address',
            assetId: 'asset-id',
            newFreezeStatus: 'new-freeze-status',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['address'] === 'undefined')
            throw new Error(`Response is missing required field 'address': ${data}`);
        if (typeof data['asset-id'] === 'undefined')
            throw new Error(`Response is missing required field 'asset-id': ${data}`);
        if (typeof data['new-freeze-status'] === 'undefined')
            throw new Error(`Response is missing required field 'new-freeze-status': ${data}`);
        return new TransactionAssetFreeze({
            address: data['address'],
            assetId: data['asset-id'],
            newFreezeStatus: data['new-freeze-status'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Fields for an asset transfer transaction.
 * Definition:
 * data/transactions/asset.go : AssetTransferTxnFields
 */
export class TransactionAssetTransfer extends BaseModel {
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
    constructor({ amount, assetId, receiver, closeAmount, closeTo, sender, }) {
        super();
        this.amount = amount;
        this.assetId = assetId;
        this.receiver = receiver;
        this.closeAmount = closeAmount;
        this.closeTo = closeTo;
        this.sender = sender;
        this.attribute_map = {
            amount: 'amount',
            assetId: 'asset-id',
            receiver: 'receiver',
            closeAmount: 'close-amount',
            closeTo: 'close-to',
            sender: 'sender',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['amount'] === 'undefined')
            throw new Error(`Response is missing required field 'amount': ${data}`);
        if (typeof data['asset-id'] === 'undefined')
            throw new Error(`Response is missing required field 'asset-id': ${data}`);
        if (typeof data['receiver'] === 'undefined')
            throw new Error(`Response is missing required field 'receiver': ${data}`);
        return new TransactionAssetTransfer({
            amount: data['amount'],
            assetId: data['asset-id'],
            receiver: data['receiver'],
            closeAmount: data['close-amount'],
            closeTo: data['close-to'],
            sender: data['sender'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Fields for a keyreg transaction.
 * Definition:
 * data/transactions/keyreg.go : KeyregTxnFields
 */
export class TransactionKeyreg extends BaseModel {
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
    constructor({ nonParticipation, selectionParticipationKey, stateProofKey, voteFirstValid, voteKeyDilution, voteLastValid, voteParticipationKey, }) {
        super();
        this.nonParticipation = nonParticipation;
        this.selectionParticipationKey =
            typeof selectionParticipationKey === 'string'
                ? new Uint8Array(Buffer.from(selectionParticipationKey, 'base64'))
                : selectionParticipationKey;
        this.stateProofKey =
            typeof stateProofKey === 'string'
                ? new Uint8Array(Buffer.from(stateProofKey, 'base64'))
                : stateProofKey;
        this.voteFirstValid = voteFirstValid;
        this.voteKeyDilution = voteKeyDilution;
        this.voteLastValid = voteLastValid;
        this.voteParticipationKey =
            typeof voteParticipationKey === 'string'
                ? new Uint8Array(Buffer.from(voteParticipationKey, 'base64'))
                : voteParticipationKey;
        this.attribute_map = {
            nonParticipation: 'non-participation',
            selectionParticipationKey: 'selection-participation-key',
            stateProofKey: 'state-proof-key',
            voteFirstValid: 'vote-first-valid',
            voteKeyDilution: 'vote-key-dilution',
            voteLastValid: 'vote-last-valid',
            voteParticipationKey: 'vote-participation-key',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new TransactionKeyreg({
            nonParticipation: data['non-participation'],
            selectionParticipationKey: data['selection-participation-key'],
            stateProofKey: data['state-proof-key'],
            voteFirstValid: data['vote-first-valid'],
            voteKeyDilution: data['vote-key-dilution'],
            voteLastValid: data['vote-last-valid'],
            voteParticipationKey: data['vote-participation-key'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Fields for a payment transaction.
 * Definition:
 * data/transactions/payment.go : PaymentTxnFields
 */
export class TransactionPayment extends BaseModel {
    /**
     * Creates a new `TransactionPayment` object.
     * @param amount - (amt) number of MicroAlgos intended to be transferred.
     * @param receiver - (rcv) receiver's address.
     * @param closeAmount - Number of MicroAlgos that were sent to the close-remainder-to address when
     * closing the sender account.
     * @param closeRemainderTo - (close) when set, indicates that the sending account should be closed and all
     * remaining funds be transferred to this address.
     */
    constructor({ amount, receiver, closeAmount, closeRemainderTo, }) {
        super();
        this.amount = amount;
        this.receiver = receiver;
        this.closeAmount = closeAmount;
        this.closeRemainderTo = closeRemainderTo;
        this.attribute_map = {
            amount: 'amount',
            receiver: 'receiver',
            closeAmount: 'close-amount',
            closeRemainderTo: 'close-remainder-to',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['amount'] === 'undefined')
            throw new Error(`Response is missing required field 'amount': ${data}`);
        if (typeof data['receiver'] === 'undefined')
            throw new Error(`Response is missing required field 'receiver': ${data}`);
        return new TransactionPayment({
            amount: data['amount'],
            receiver: data['receiver'],
            closeAmount: data['close-amount'],
            closeRemainderTo: data['close-remainder-to'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 *
 */
export class TransactionResponse extends BaseModel {
    /**
     * Creates a new `TransactionResponse` object.
     * @param currentRound - Round at which the results were computed.
     * @param transaction - Contains all fields common to all transactions and serves as an envelope to all
     * transactions type. Represents both regular and inner transactions.
     * Definition:
     * data/transactions/signedtxn.go : SignedTxn
     * data/transactions/transaction.go : Transaction
     */
    constructor({ currentRound, transaction, }) {
        super();
        this.currentRound = currentRound;
        this.transaction = transaction;
        this.attribute_map = {
            currentRound: 'current-round',
            transaction: 'transaction',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        if (typeof data['transaction'] === 'undefined')
            throw new Error(`Response is missing required field 'transaction': ${data}`);
        return new TransactionResponse({
            currentRound: data['current-round'],
            transaction: Transaction.from_obj_for_encoding(data['transaction']),
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Validation signature associated with some data. Only one of the signatures
 * should be provided.
 */
export class TransactionSignature extends BaseModel {
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
    constructor({ logicsig, multisig, sig, }) {
        super();
        this.logicsig = logicsig;
        this.multisig = multisig;
        this.sig =
            typeof sig === 'string'
                ? new Uint8Array(Buffer.from(sig, 'base64'))
                : sig;
        this.attribute_map = {
            logicsig: 'logicsig',
            multisig: 'multisig',
            sig: 'sig',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new TransactionSignature({
            logicsig: typeof data['logicsig'] !== 'undefined'
                ? TransactionSignatureLogicsig.from_obj_for_encoding(data['logicsig'])
                : undefined,
            multisig: typeof data['multisig'] !== 'undefined'
                ? TransactionSignatureMultisig.from_obj_for_encoding(data['multisig'])
                : undefined,
            sig: data['sig'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * (lsig) Programatic transaction signature.
 * Definition:
 * data/transactions/logicsig.go
 */
export class TransactionSignatureLogicsig extends BaseModel {
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
    constructor({ logic, args, multisigSignature, signature, }) {
        super();
        this.logic =
            typeof logic === 'string'
                ? new Uint8Array(Buffer.from(logic, 'base64'))
                : logic;
        this.args = args;
        this.multisigSignature = multisigSignature;
        this.signature =
            typeof signature === 'string'
                ? new Uint8Array(Buffer.from(signature, 'base64'))
                : signature;
        this.attribute_map = {
            logic: 'logic',
            args: 'args',
            multisigSignature: 'multisig-signature',
            signature: 'signature',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['logic'] === 'undefined')
            throw new Error(`Response is missing required field 'logic': ${data}`);
        return new TransactionSignatureLogicsig({
            logic: data['logic'],
            args: data['args'],
            multisigSignature: typeof data['multisig-signature'] !== 'undefined'
                ? TransactionSignatureMultisig.from_obj_for_encoding(data['multisig-signature'])
                : undefined,
            signature: data['signature'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * (msig) structure holding multiple subsignatures.
 * Definition:
 * crypto/multisig.go : MultisigSig
 */
export class TransactionSignatureMultisig extends BaseModel {
    /**
     * Creates a new `TransactionSignatureMultisig` object.
     * @param subsignature - (subsig) holds pairs of public key and signatures.
     * @param threshold - (thr)
     * @param version - (v)
     */
    constructor({ subsignature, threshold, version, }) {
        super();
        this.subsignature = subsignature;
        this.threshold = threshold;
        this.version = version;
        this.attribute_map = {
            subsignature: 'subsignature',
            threshold: 'threshold',
            version: 'version',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new TransactionSignatureMultisig({
            subsignature: typeof data['subsignature'] !== 'undefined'
                ? data['subsignature'].map(TransactionSignatureMultisigSubsignature.from_obj_for_encoding)
                : undefined,
            threshold: data['threshold'],
            version: data['version'],
        });
        /* eslint-enable dot-notation */
    }
}
export class TransactionSignatureMultisigSubsignature extends BaseModel {
    /**
     * Creates a new `TransactionSignatureMultisigSubsignature` object.
     * @param publicKey - (pk)
     * @param signature - (s)
     */
    constructor({ publicKey, signature, }) {
        super();
        this.publicKey =
            typeof publicKey === 'string'
                ? new Uint8Array(Buffer.from(publicKey, 'base64'))
                : publicKey;
        this.signature =
            typeof signature === 'string'
                ? new Uint8Array(Buffer.from(signature, 'base64'))
                : signature;
        this.attribute_map = {
            publicKey: 'public-key',
            signature: 'signature',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new TransactionSignatureMultisigSubsignature({
            publicKey: data['public-key'],
            signature: data['signature'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 * Fields for a state proof transaction.
 * Definition:
 * data/transactions/stateproof.go : StateProofTxnFields
 */
export class TransactionStateProof extends BaseModel {
    /**
     * Creates a new `TransactionStateProof` object.
     * @param message - (spmsg)
     * @param stateProof - (sp) represents a state proof.
     * Definition:
     * crypto/stateproof/structs.go : StateProof
     * @param stateProofType - (sptype) Type of the state proof. Integer representing an entry defined in
     * protocol/stateproof.go
     */
    constructor({ message, stateProof, stateProofType, }) {
        super();
        this.message = message;
        this.stateProof = stateProof;
        this.stateProofType = stateProofType;
        this.attribute_map = {
            message: 'message',
            stateProof: 'state-proof',
            stateProofType: 'state-proof-type',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        return new TransactionStateProof({
            message: typeof data['message'] !== 'undefined'
                ? IndexerStateProofMessage.from_obj_for_encoding(data['message'])
                : undefined,
            stateProof: typeof data['state-proof'] !== 'undefined'
                ? StateProofFields.from_obj_for_encoding(data['state-proof'])
                : undefined,
            stateProofType: data['state-proof-type'],
        });
        /* eslint-enable dot-notation */
    }
}
/**
 *
 */
export class TransactionsResponse extends BaseModel {
    /**
     * Creates a new `TransactionsResponse` object.
     * @param currentRound - Round at which the results were computed.
     * @param transactions -
     * @param nextToken - Used for pagination, when making another request provide this token with the
     * next parameter.
     */
    constructor({ currentRound, transactions, nextToken, }) {
        super();
        this.currentRound = currentRound;
        this.transactions = transactions;
        this.nextToken = nextToken;
        this.attribute_map = {
            currentRound: 'current-round',
            transactions: 'transactions',
            nextToken: 'next-token',
        };
    }
    // eslint-disable-next-line camelcase
    static from_obj_for_encoding(data) {
        /* eslint-disable dot-notation */
        if (typeof data['current-round'] === 'undefined')
            throw new Error(`Response is missing required field 'current-round': ${data}`);
        if (!Array.isArray(data['transactions']))
            throw new Error(`Response is missing required array field 'transactions': ${data}`);
        return new TransactionsResponse({
            currentRound: data['current-round'],
            transactions: data['transactions'].map(Transaction.from_obj_for_encoding),
            nextToken: data['next-token'],
        });
        /* eslint-enable dot-notation */
    }
}
//# sourceMappingURL=types.js.map