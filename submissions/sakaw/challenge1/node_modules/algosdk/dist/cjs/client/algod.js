const { default: HTTPClient } = require('./client');
const { setSendTransactionHeaders } = require('./v2/algod/sendRawTransaction');
/** @deprecated v1 algod APIs are deprecated, please use the v2 client */
function Algod(token = '', baseServer = 'http://r2.algorand.network', port = 4180, headers = {}) {
    // workaround to allow backwards compatibility for multiple headers
    let tokenHeader = token;
    if (typeof tokenHeader === 'string') {
        tokenHeader = { 'X-Algo-API-Token': tokenHeader };
    }
    // Get client
    const c = new HTTPClient(tokenHeader, baseServer, port, headers);
    /**
     * Takes an object and convert its note field to Buffer, if exist.
     * @param o
     * @returns {*}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    function noteb64ToNote(o) {
        if (!(o.noteb64 === undefined || o.noteb64 === null)) {
            // eslint-disable-next-line no-param-reassign
            o.note = Buffer.from(o.noteb64, 'base64');
        }
        return o;
    }
    /**
     * status retrieves the StatusResponse from the running node
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.status = async (headerObj = {}) => {
        const res = await c.get('/v1/status', {}, headerObj);
        return res.body;
    };
    /**
     * healthCheck returns an empty object iff the node is running
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.healthCheck = async (headerObj = {}) => {
        const res = await c.get('/health', {}, headerObj);
        if (!res.ok) {
            throw new Error(`Health response: ${res.status}`);
        }
        return {};
    };
    /**
     * statusAfterBlock waits for round roundNumber to occur then returns the StatusResponse for this round.
     * This call blocks
     * @param roundNumber
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.statusAfterBlock = async (roundNumber, headerObj = {}) => {
        if (!Number.isInteger(roundNumber))
            throw Error('roundNumber should be an integer');
        const res = await c.get(`/v1/status/wait-for-block-after/${roundNumber}`, {}, headerObj);
        return res.body;
    };
    /**
     * pendingTransactions asks algod for a snapshot of current pending txns on the node, bounded by maxTxns.
     * If maxTxns = 0, fetches as many transactions as possible.
     * @param maxTxns - number
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.pendingTransactions = async (maxTxns, headerObj = {}) => {
        if (!Number.isInteger(maxTxns))
            throw Error('maxTxns should be an integer');
        const res = await c.get('/v1/transactions/pending', { max: maxTxns }, headerObj);
        if (res.statusCode === 200 &&
            res.body.truncatedTxns.transactions !== undefined) {
            for (let i = 0; i < res.body.truncatedTxns.transactions.length; i++) {
                res.body.truncatedTxns.transactions[i] = noteb64ToNote(res.body.truncatedTxns.transactions[i]);
            }
        }
        return res.body;
    };
    /**
     * versions retrieves the VersionResponse from the running node
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.versions = async (headerObj = {}) => {
        const res = await c.get('/versions', {}, headerObj);
        return res.body;
    };
    /**
     * LedgerSupply gets the supply details for the specified node's Ledger
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.ledgerSupply = async (headerObj = {}) => {
        const res = await c.get('/v1/ledger/supply', {}, headerObj);
        return res.body;
    };
    /**
     * transactionsByAddress returns all transactions for a PK [addr] in the [first, last] rounds range.
     * @param addr - string
     * @param first - number, optional
     * @param last - number, optional
     * @param maxTxns - number, optional
     * @param headers, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.transactionByAddress = async (addr, first = null, last = null, maxTxns = null, headerObj = {}) => {
        if (first !== null && !Number.isInteger(first)) {
            throw Error('first round should be an integer');
        }
        if (last !== null && !Number.isInteger(last)) {
            throw Error('last round should be an integer');
        }
        const res = await c.get(`/v1/account/${addr}/transactions`, { firstRound: first, lastRound: last, max: maxTxns }, headerObj);
        if (res.statusCode === 200 && res.body.transactions !== undefined) {
            for (let i = 0; i < res.body.transactions.length; i++) {
                res.body.transactions[i] = noteb64ToNote(res.body.transactions[i]);
            }
        }
        return res.body;
    };
    /**
     * transactionsByAddressAndDate returns all transactions for a PK [addr] in the [fromDate, toDate] date range.
     * The date is a string in the YYYY-MM-DD format.
     * @param addr - string
     * @param fromDate - string
     * @param toDate - string
     * @param maxTxns - number, optional
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.transactionByAddressAndDate = async (addr, fromDate, toDate, maxTxns = null, headerObj = {}) => {
        const res = await c.get(`/v1/account/${addr}/transactions`, { fromDate, toDate, max: maxTxns }, headerObj);
        if (res.statusCode === 200 && res.body.transactions !== undefined) {
            for (let i = 0; i < res.body.transactions.length; i++) {
                res.body.transactions[i] = noteb64ToNote(res.body.transactions[i]);
            }
        }
        return res.body;
    };
    /**
     * transactionById returns the a transaction information of a specific txid [txId]
     * Note - This method is allowed only when Indexer is enabled.
     * @param txid
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.transactionById = async (txid, headerObj = {}) => {
        const res = await c.get(`/v1/transaction/${txid}`, {}, headerObj);
        if (res.statusCode === 200) {
            res.body = noteb64ToNote(res.body);
        }
        return res.body;
    };
    /**
     * transactionInformation returns the transaction information of a specific txid and an address
     * @param addr
     * @param txid
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.transactionInformation = async (addr, txid, headerObj = {}) => {
        const res = await c.get(`/v1/account/${addr}/transaction/${txid}`, {}, headerObj);
        if (res.statusCode === 200) {
            res.body = noteb64ToNote(res.body);
        }
        return res.body;
    };
    /**
     * pendingTransactionInformation returns the transaction information for a specific txid of a pending transaction
     * @param txid
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.pendingTransactionInformation = async (txid, headerObj = {}) => {
        const res = await c.get(`/v1/transactions/pending/${txid}`, {}, headerObj);
        if (res.statusCode === 200) {
            res.body = noteb64ToNote(res.body);
        }
        return res.body;
    };
    /**
     * accountInformation returns the passed account's information
     * @param addr - string
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.accountInformation = async (addr, headerObj = {}) => {
        const res = await c.get(`/v1/account/${addr}`, {}, headerObj);
        return res.body;
    };
    /**
     * assetInformation returns the information for the asset with the passed creator and index
     * @param index - number
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.assetInformation = async (index, headerObj = {}) => {
        const res = await c.get(`/v1/asset/${index}`, {}, headerObj);
        return res.body;
    };
    /**
     * suggestedFee gets the recommended transaction fee from the node
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.suggestedFee = async (headerObj = {}) => {
        const res = await c.get('/v1/transactions/fee', {}, headerObj);
        return res.body;
    };
    /**
     * sendRawTransaction gets an encoded SignedTxn and broadcasts it to the network
     * @param txn - Uin8Array
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.sendRawTransaction = async (txn, headerObj = {}) => {
        const txHeaders = setSendTransactionHeaders(headerObj);
        const res = await c.post('/v1/transactions', Buffer.from(txn), txHeaders);
        return res.body;
    };
    /**
     * sendRawTransactions gets a list of encoded SignedTxns and broadcasts it to the network
     * @param txn - Array of Uin8Array
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.sendRawTransactions = async (txns, headerObj = {}) => {
        const txHeaders = setSendTransactionHeaders(headerObj);
        const merged = Array.prototype.concat(...txns.map((arr) => Array.from(arr)));
        const res = await c.post('/v1/transactions', Buffer.from(merged), txHeaders);
        return res.body;
    };
    /**
     * getTransactionParams returns to common needed parameters for a new transaction
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.getTransactionParams = async (headerObj = {}) => {
        const res = await c.get('/v1/transactions/params', {}, headerObj);
        return res.body;
    };
    /**
     * suggestParams returns to common needed parameters for a new transaction, in a format the transaction builder expects
     * @param headerObj, optional
     * @returns {Object}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.suggestParams = async (headerObj = {}) => {
        const result = await this.getTransactionParams(headerObj);
        return {
            flatFee: false,
            fee: result.fee,
            firstRound: result.lastRound,
            lastRound: result.lastRound + 1000,
            genesisID: result.genesisID,
            genesisHash: result.genesishashb64,
        };
    };
    /**
     * block gets the block info for the given round This call blocks
     * @param roundNumber
     * @param headerObj, optional
     * @returns {Promise<*>}
     * @deprecated v1 algod APIs are deprecated, please use the v2 client
     */
    this.block = async (roundNumber, headerObj = {}) => {
        if (!Number.isInteger(roundNumber))
            throw Error('roundNumber should be an integer');
        const res = await c.get(`/v1/block/${roundNumber}`, {}, headerObj);
        if (res.statusCode === 200 && res.body.txns.transactions !== undefined) {
            for (let i = 0; i < res.body.txns.transactions.length; i++) {
                res.body.txns.transactions[i] = noteb64ToNote(res.body.txns.transactions[i]);
            }
        }
        return res.body;
    };
}
module.exports = { Algod };
//# sourceMappingURL=algod.js.map