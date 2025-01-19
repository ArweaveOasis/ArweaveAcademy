const dynamicFeeTemplate = require('./dynamicfee');
const htlcTemplate = require('./htlc');
const limitOrderTemplate = require('./limitorder');
const splitTemplate = require('./split');
const periodicPayTemplate = require('./periodicpayment');
module.exports = {
    DynamicFee: dynamicFeeTemplate.DynamicFee,
    getDynamicFeeTransactions: dynamicFeeTemplate.getDynamicFeeTransactions,
    signDynamicFee: dynamicFeeTemplate.signDynamicFee,
    HTLC: htlcTemplate.HTLC,
    signTransactionWithHTLCUnlock: htlcTemplate.signTransactionWithHTLCUnlock,
    LimitOrder: limitOrderTemplate.LimitOrder,
    getSwapAssetsTransaction: limitOrderTemplate.getSwapAssetsTransaction,
    Split: splitTemplate.Split,
    getSplitFundsTransaction: splitTemplate.getSplitFundsTransaction,
    PeriodicPayment: periodicPayTemplate.PeriodicPayment,
    getPeriodicPaymentWithdrawalTransaction: periodicPayTemplate.getPeriodicPaymentWithdrawalTransaction,
};
//# sourceMappingURL=index.js.map