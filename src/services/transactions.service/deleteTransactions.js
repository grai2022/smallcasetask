const M = require('../../models')
const utils = require('../../utils')
const moment = require('moment');
const {TIMEZONE}  = require('../../config/config');

/*
Delete Trade DB transactional Query
*/
module.exports = async function (id) {
    const portfolioEntry = {
        updated_on : moment().tz(TIMEZONE).format()
    };
    return M.transaction(async function (t) {
        // Get the available securities in portfolio
        let tradeRecord = await M.trade.findOne({where : {id : id, status : true}}, {transaction: t});
            if(!tradeRecord)throw Error("Invalid Transaction");
            else{
                let tradeEntry = tradeRecord.get({plain:true});
                let record = await M.portfolio.findOne({where : {ticker_symbol : tradeEntry.ticker_symbol}}, {transaction: t});
                let prevRecord               = record.get({plain:true});
                if(tradeEntry.trade_type == 'BUY' && prevRecord.quantity - tradeEntry.quantity < 0) throw Error("Invalid Transaction");
                else{
                    portfolioEntry.quantity      = await utils._getUpdateQuantity(tradeEntry.quantity,prevRecord.quantity, tradeEntry.trade_type, true);
                    /*average price has been considered same as sell case is it required to recalculate this?*/
                    portfolioEntry.average_price = await utils._getUpdateAvg(tradeEntry.rate,tradeEntry.quantity,prevRecord.average_price, prevRecord.quantity, tradeEntry.trade_type, true);
                    if(portfolioEntry.average_price <0) throw Error("Invalid transaction : avg price")
                    await record.update(portfolioEntry, {transaction: t});
                    await tradeRecord.update({status:false},{transaction: t})
                    return {err : false, msg:'Success'};
                }
            }
      }).catch(function (error) {
          console.log(error)
        return {err:true,msg:error.message};
    });
}