/**
 * Wait until a transaction has been confirmed or rejected by the network, or
 * until 'waitRounds' number of rounds have passed.
 * @param client - An Algodv2 client
 * @param txid - The ID of the transaction to wait for.
 * @param waitRounds - The maximum number of rounds to wait for.
 * @returns A promise that, upon success, will resolve to the output of the
 *   `pendingTransactionInformation` call for the confirmed transaction.
 */
export async function waitForConfirmation(client, txid, waitRounds) {
    // Wait until the transaction is confirmed or rejected, or until 'waitRounds'
    // number of rounds have passed.
    const status = await client.status().do();
    if (typeof status === 'undefined') {
        throw new Error('Unable to get node status');
    }
    const startRound = status['last-round'] + 1;
    let currentRound = startRound;
    /* eslint-disable no-await-in-loop */
    while (currentRound < startRound + waitRounds) {
        let poolError = false;
        try {
            const pendingInfo = await client.pendingTransactionInformation(txid).do();
            if (pendingInfo['confirmed-round']) {
                // Got the completed Transaction
                return pendingInfo;
            }
            if (pendingInfo['pool-error']) {
                // If there was a pool error, then the transaction has been rejected
                poolError = true;
                throw new Error(`Transaction Rejected: ${pendingInfo['pool-error']}`);
            }
        }
        catch (err) {
            // Ignore errors from PendingTransactionInformation, since it may return 404 if the algod
            // instance is behind a load balancer and the request goes to a different algod than the
            // one we submitted the transaction to
            if (poolError) {
                // Rethrow error only if it's because the transaction was rejected
                throw err;
            }
        }
        await client.statusAfterBlock(currentRound).do();
        currentRound += 1;
    }
    /* eslint-enable no-await-in-loop */
    throw new Error(`Transaction not confirmed after ${waitRounds} rounds`);
}
//# sourceMappingURL=wait.js.map