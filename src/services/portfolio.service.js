const M = require('./../models');

/**
 * get all trades
 * @param 
 * @returns {Promise<QueryResult>}
 */
const portfolio = async() =>{
    let allData = await M.portfolio.findAll();
    return allData;
}

/**
 * get all trades
 * @param 
 * @returns {Promise<QueryResult>}
 */
const portfolioReturns = async() => {
    let activeData = await M.portfolio.findAll({attributes: ['ticker_symbol','average_price', 'quantity']});
    return _calculateReturns(activeData , [100]);

} 

const _calculateReturns = async(dataArray, currPrice) =>{
    let result = {"returns" : 0};
    for(let i = 0; i< dataArray.length ; i++){
        result["returns"] += (currPrice[0] - dataArray[i]['average_price'])*dataArray[i]['quantity'];
    }

    return result;
}


module.exports = {
    portfolio,
    portfolioReturns
  };