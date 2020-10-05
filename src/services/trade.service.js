
const M = require('./../models');
const utils = require('./../utils');


/**
 * get all trades
 * @param 
 * @returns {Promise<QueryResult>}
 */
const allTrades = async () => {
    let allData = await M.trade.findAll();
    let formattedData = await utils.groupBy(allData , i=>i.ticker_symbol);
    console.log(allData)
    console.log(formattedData)
    return formattedData;
};


module.exports = {
  allTrades
};
