const M = require('../../models')
const utils = require('../../utils')
const moment = require('moment');
const {TIMEZONE}  = require('../../config/config');
const buyTransaction = require('./buyTransactions');
const sellTransaction = require('./sellTransactions');
const deleteTransaction = require('./deleteTransactions');

/*
Update Trade DB transactional Query
*/
module.exports = async  (id, updateEntry) => {
    
    if('ticker_symbol' in updateEntry && updateEntry.ticker_symbol){
        return _validateAndUpdateSymbol(id, updateEntry)

    }else if('trade_type' in updateEntry && updateEntry.trade_type) {
        return _validateAndUpdateType(id,updateEntry);
    }else if('rate' in updateEntry && updateEntry.rate){
        return _validateAndUpdateRate(id, updateEntry);
    } else if('quantity' in updateEntry && updateEntry.quantity){
        return _validateAndUpdateQuantity(id, updateEntry);
    } else{
        return {err:true,msg:"Invalid"};
    }
}


const _validateAndUpdateSymbol = (id, updateEntry) => {
    return M.transaction(async function (t) {
        // Get the available securities in portfolio
        let tradeRecord = await M.trade.findOne({where : {id : id, status : true}}, {transaction: t});
        if(!tradeRecord) throw Error("Invalid Transaction");
        else if(tradeRecord.ticker_symbol == updateEntry.ticker_symbol) throw Error("No changes")
        else{
            //Delete the existing transaction
                await deleteTransaction(id);
                //Create New Transaction
                if(tradeEntry.trade_type == 'BUY'){
                    let tradeEntry = tradeRecord.get({plain:true})
                    tradeEntry.ticker_symbol = updateEntry.ticker_symbol;
                    delete tradeEntry['id'];
                    return buyTransaction(tradeEntry)

                }else if(tradeEntry.trade_type == 'SELL'){
                    let tradeEntry = tradeRecord.get({plain:true})
                    tradeEntry.ticker_symbol = updateEntry.ticker_symbol;
                    delete tradeEntry['id'];
                    return sellTransaction(tradeEntry)
                }
                else{
                    throw Error("Invalid Transaction Type");
                }
                
            }
      }).catch(function (error) {
          console.log(error)
        return {err:true,msg:error.message};
    });
}

const _validateAndUpdateType = (id, updateEntry) => {
    return M.transaction(async function (t) {
        // Get the available securities in portfolio
        let tradeRecord = await M.trade.findOne({where : {id : id, status : true}}, {transaction: t});
        if(!tradeRecord) throw Error("Invalid Transaction");
        else if(tradeRecord.trade_type == updateEntry.trade_type) throw Error("No changes")
        else{
            //Delete the existing transaction
                await deleteTransaction(id);
                //Create New Transaction
                if(tradeEntry.trade_type == 'BUY'){
                    let tradeEntry = tradeRecord.get({plain:true})
                    tradeEntry.trade_type = updateEntry.trade_type;
                    delete tradeEntry['id'];
                    return buyTransaction(tradeEntry)

                }else if(tradeEntry.trade_type == 'SELL'){
                    let tradeEntry = tradeRecord.get({plain:true})
                    tradeEntry.trade_type = updateEntry.trade_type;
                    delete tradeEntry['id'];
                    return sellTransaction(tradeEntry)
                }
                else{
                    throw Error("Invalid Transaction Type");
                }
                
            }
      }).catch(function (error) {
          console.log(error)
        return {err:true,msg:error.message};
    });
}

const _validateAndUpdateQuantity = (id, updateEntry) => {
    return M.transaction(async function (t) {
        let tradeRecord = await M.trade.findOne({where : {id : id, status : true}}, {transaction: t});
        if(!tradeRecord)throw Error("Invalid Transaction");
        if(tradeRecord.quantity == updateEntry.quantity) throw Error("No Changes")
        else{
            let tradeEntry         = tradeRecord.get({plain:true});
            let record             = await M.portfolio.findOne({where : {ticker_symbol : tradeEntry.ticker_symbol}}, {transaction: t});
            let prevRecord         = record.get({plain:true});
            let [valid , updatedPortfolio , updatedTradeOld, updateTradeEntry] = await __quantityUpdateValidationHelper(updateEntry , tradeEntry, prevRecord);
            if(!valid) throw Error("Invalid Transaction :: "+ updatedPortfolio);
            else{
                await record.update(updatedPortfolio, {transaction: t});
                console.log("tradeRecord")
                console.log(tradeRecord)
                await tradeRecord.update(updatedTradeOld,{transaction: t});
                await M.trade.create(updateTradeEntry, {transaction:t});
                return {err : false, msg:'Success'};
            }
        }
  }).catch(function (error) {
      console.log(error)
    return {err:true,msg:error.message};
  });
}

const _validateAndUpdateRate = (id, updateEntry) => {
    return M.transaction(async function (t) {
        let tradeRecord = await M.trade.findOne({where : {id : id, status : true}}, {transaction: t});
        if(!tradeRecord)throw Error("Invalid Transaction");
        else{
            let tradeEntry         = tradeRecord.get({plain:true});
            let record             = await M.portfolio.findOne({where : {ticker_symbol : tradeEntry.ticker_symbol}}, {transaction: t});
            let prevRecord         = record.get({plain:true});
            let [valid , updatedPortfolio , updatedTradeOld, updateTradeEntry] = await __rateUpdateValidationHelper(updateEntry , tradeEntry, prevRecord);
            if(!valid) throw Error("Invalid Transaction :: "+ updatedPortfolio);
            else{
                await record.update(updatedPortfolio, {transaction: t});
                await tradeRecord.update(updatedTradeOld,{transaction: t});
                await M.trade.create(updateTradeEntry, {transaction:t});
                return {err : false, msg:'Success'};
            }
        }
  }).catch(function (error) {
      console.log(error)
    return {err:true,msg:error.message};
  });
}

const __quantityUpdateValidationHelper = (updateEntry,tradeRecord, portfolioRecord)=>{
    let updatedPortfolio = {};
    let updatedTradeRecord = Object.assign({},tradeRecord)
    updatedPortfolio.quantity = portfolioRecord.quantity;
    if(updateEntry.trade_type == 'BUY' || tradeRecord.trade_type == 'BUY'){
        if(updatedPortfolio.quantity + updateEntry.quantity - tradeRecord.quantity < 0){
            return [false , "Invalid Update Quantity"]
        }else{
            updatedPortfolio.quantity = updatedPortfolio.quantity + updateEntry.quantity - tradeRecord.quantity;
        }
    }else if(updateEntry.trade_type == 'SELL' || tradeRecord.trade_type == 'SELL'){
        if(updatedPortfolio.quantity - (updateEntry.quantity - tradeRecord.quantity) < 0){
            return [false, "Invalid Update Quantity"];
        }else{
            updatedPortfolio.quantity = updatedPortfolio.quantity - (updateEntry.quantity - tradeRecord.quantity);
        }
    } else{
        return [false,  "Invalid Trade Type"];
    }
    updatedTradeRecord.quantity = updateEntry.quantity;
    updatedTradeRecord.updated_on =moment().tz(TIMEZONE).format();
    delete updatedTradeRecord['id'];
    return [true, updatedPortfolio, {status:false,updated_on:moment().tz(TIMEZONE).format()}, updatedTradeRecord];
}

const __rateUpdateValidationHelper = (updateEntry,tradeRecord, portfolioRecord)=>{
    let updatedPortfolio = {};
    let updatedTradeRecord = Object.assign({},tradeRecord)
    updatedPortfolio.average_price = portfolioRecord.average_price;
    
    if(updateEntry.trade_type == 'BUY' || tradeRecord.trade_type == 'BUY'){
        //change average
    }else if(updateEntry.trade_type == 'SELL' || tradeRecord.trade_type == 'SELL'){
        //update avg
    }else{
        return [false,  "Invalid Trade Type"];
    }
    updatedTradeRecord.rate = updateEntry.rate;
    updatedTradeRecord.updated_on =moment().tz(TIMEZONE).format();
    delete updatedTradeRecord['id'];
    return [true, updatedPortfolio, {status:false,updated_on:moment().tz(TIMEZONE).format()}, updatedTradeRecord];
}

/*const validatedAndUpdated = (updateEntry,tradeRecord, portfolioRecord) =>{
    let updateRequired = {
        rate : false,
        type : false,
        quantity : false,
        symbol : false
    }
    let update = false;
    if(updateEntry.ticker_symbol && tradeRecord.ticker_symbol != updateEntry.ticker_symbol){
        updateRequired.symbol = true;
        update  = true;
        return _validateSymbolUpdate(updateEntry,tradeRecord, portfolioRecord, updateRequired);
    }
    if(updateEntry.trade_type && tradeRecord.trade_type != updateEntry.trade_type){
        updateRequired.type = true;
        update  = true;
    }
    if(updateEntry.rate && tradeRecord.rate != updateEntry.rate){
        updateRequired.rate = true;
        update  = true;
    }
    if(updateEntry.quantity && tradeRecord.quantity != updateEntry.quantity){
        updateRequired.quantity = true;
        update  = true;
    }
    if(!update){
        return [false, "Nothing to Update"];
    }
}*/
/*const _fieldUpdateFormatHelper = function (updateEntry,tradeRecord, portfolioRecord, updateRequired) {
    let updatedPortfolio = {};
    updatedPortfolio.quantity = portfolioRecord.quantity;
    updateEntry.ticker_symbol = tradeRecord.ticker_symbol;
    //symbol changes
    if(upgradeRequired.symbol){
        if(portfolioRecord.quantity < tradeRecord.quantity){
            return [false, "Illegal"]
        }else{

        }
    }
    //type based changes
    if(updateRequired.type){
        if(updateEntry.trade_type == 'BUY'){
            updatedPortfolio.quantity = portfolioRecord.quantity + 2*tradeRecord.quantity;
        }else if(updateEntry.trade_type == 'SELL'){
            if(portfolioRecord.quantity - 2*tradeRecord.quantity < 0){
                return [false, "Illegal Portfolio Quantity"];
            }else{
                updatedPortfolio.quantity = portfolioRecord.quantity - 2*tradeRecord.quantity;
            }
        }else{
            return [false , "Invalid Trade Type"];
        }
    }else{
        updateEntry.trade_type = tradeRecord.trade_type;
    }
    //quantity changes
    if(updateRequired.quantity){
        if(updateEntry.trade_type == 'BUY' || tradeRecord.trade_type == 'BUY'){
            if(updatedPortfolio.quantity + updateEntry.quantity - tradeRecord.quantity < 0){
                return [false , "Invalid Update Quantity"]
            }else{
                updatedPortfolio.quantity = updatedPortfolio.quantity + updateEntry.quantity - tradeRecord.quantity;
            }
        }else if(updateEntry.trade_type == 'SELL' || tradeRecord.trade_type == 'SELL'){
            if(updatedPortfolio.quantity - (updateEntry.quantity - tradeRecord.quantity) < 0){
                return [false, "Invalid Update Quantity"];
            }else{
                updatedPortfolio.quantity = updatedPortfolio.quantity - (updateEntry.quantity - tradeRecord.quantity);
            }
        } else{
            return [false,  "Invalid Trade Type"];
        }
    }
    //rate changes
    if(updateRequired.rate){
        if(updateEntry.trade_type == 'BUY' || tradeRecord.trade_type == 'BUY'){
            //change average
        }else if(updateEntry.trade_type == 'SELL' || tradeRecord.trade_type == 'SELL'){
            updatedTradeRecord.trade_type = 'SELL';
            //update avg
        }else{
            return [false,  "Invalid Trade Type"];
        }
    }
    tradeRecord.created_on = moment().tz(TIMEZONE).format();
    return [true, updatedPortfolio, {status:false,updated_on:moment().tz(TIMEZONE).format()}, updateEntry];
}*/
