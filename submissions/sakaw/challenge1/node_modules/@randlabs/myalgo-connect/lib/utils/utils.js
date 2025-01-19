
function sleep(msec = 200) {
	return new Promise(resolve => setTimeout(resolve, msec));
}

/**
 * @typedef {import("../main").Transaction} Transaction
 */

/**
 * @typedef {import("../main").EncodedTransaction} EncodedTransaction
 */

/**
 * @description Preparate transactions before send it to the bridge.
 * This method changes all ArrayBuffer to base64.
 * @param {Transaction|EncodedTransaction} transaction Transaction provided by the user
 * @returns {any} Return the same input
 */
function prepareTxn(transaction) {

	if (transaction.constructor === Uint8Array)
		return Buffer.from(transaction).toString("base64");
	else if (typeof transaction === "string")
		return transaction;

	const txn = Object.assign({}, transaction);

	if (txn.note && txn.note.constructor === Uint8Array)
		txn.note = Buffer.from(txn.note).toString("base64");

	if (txn.assetMetadataHash && txn.assetMetadataHash.constructor === Uint8Array)
		txn.assetMetadataHash = Buffer.from(txn.assetMetadataHash).toString("base64");

	if (txn.group && txn.group.constructor === Uint8Array)
		txn.group = Buffer.from(txn.group).toString("base64");

	if (txn.type === "appl" && txn.appApprovalProgram && txn.appApprovalProgram.constructor === Uint8Array)
		txn.appApprovalProgram = Buffer.from(txn.appApprovalProgram).toString("base64");

	if (txn.type === "appl" && txn.appClearProgram && txn.appClearProgram.constructor === Uint8Array)
		txn.appClearProgram = Buffer.from(txn.appClearProgram).toString("base64");

	if (txn.type === "appl" && txn.appArgs && txn.appArgs.length > 0)
		for (let i = 0; i < txn.appArgs.length; i++)
			if (txn.appArgs[i].constructor === Uint8Array)
				txn.appArgs[i] = Buffer.from(txn.appArgs[i]).toString("base64");

	return txn;
}

module.exports = {
	sleep,
	prepareTxn,
};
