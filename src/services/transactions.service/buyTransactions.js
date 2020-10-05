const M = require('../../models')
const utils = require('../../utils')
const moment = require('moment');
const {TIMEZONE}  = require('../../config/config');


/*
Buy Trade DB transactional Query
*/
module.exports = async function (tradeEntry) {
    const portfolioEntry = {
        updated_on : moment().tz(TIMEZONE).format()
    };
    return M.transaction(async function (t) {
        // Get the available securities in portfolio
        let record = await M.portfolio.findOne({where : {ticker_symbol : tradeEntry.ticker_symbol}}, {transaction: t});
        if (!record) {
            portfolioEntry.port_id       = '0' + tradeEntry.ticker_symbol;
            portfolioEntry.ticker_symbol = tradeEntry.ticker_symbol;
            portfolioEntry.quantity      = tradeEntry.quantity;
            portfolioEntry.average_price = tradeEntry.rate;
            portfolioEntry.created_on    = moment().tz(TIMEZONE).format();
            createdRecord  = (await M.portfolio.create(portfolioEntry)).get({plain:true});
        }else{
            let prevRecord = record.get({plain:true});
            portfolioEntry.quantity      = await utils._getUpdateQuantity(tradeEntry.quantity,prevRecord.quantity, tradeEntry.trade_type);
            portfolioEntry.average_price = await utils._getUpdateAvg(tradeEntry.rate,tradeEntry.quantity,prevRecord.average_price, prevRecord.quantity, tradeEntry.trade_type);
            await record.update(portfolioEntry, {transaction: t});
        }
        await M.trade.create(tradeEntry,{transaction: t});
        return {err : false, msg:'Success'};
      }).catch(function (error) {
        console.log(error)
        return {err:true,msg:error.message};
      });
}