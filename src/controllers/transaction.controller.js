const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');
const {TIMEZONE}  = require('../config/config');
const moment = require('moment');

/*
Buy Trades
*/
const buyTrades = catchAsync(async (req, res) => {
  let result     = {err: true};
  const symbol   = req.body.symbol;
  const type     = 'BUY';
  const price    = req.body.price;
  const quantity = req.body.quantity;
  try{
    let tradeEntry ={
        ticker_symbol : symbol,
        trade_type    : type,
        quantity      : quantity,
        rate          : price,
        status        : true,
        created_on    : moment().tz(TIMEZONE).format(),
        updated_on    : moment().tz(TIMEZONE).format()
      }
      result = await transactionService.buyTransaction(tradeEntry)
    }catch(e){
      console.log(e);
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,e);
    }
  res.send(result);
});

/*
Sell Trades 
*/
const sellTrades = catchAsync(async (req, res) => {
  let result     = {err: true};
  const symbol   = req.body.symbol;
  const type     = 'SELL';
  const price    = req.body.price;
  const quantity = req.body.quantity;
  try{
  let tradeEntry ={
      ticker_symbol : symbol,
      trade_type    : type,
      quantity      : quantity,
      rate          : price,
      status        : true,
      created_on    : moment().tz(TIMEZONE).format(),
      updated_on    : moment().tz(TIMEZONE).format()
    }
    result = await transactionService.sellTransaction(tradeEntry)
  }catch(e){
    console.log(e);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,e);
  }
  res.send(result);
});

/*
Delete Trades Transaction
*/
const deleteTrades = catchAsync(async (req, res) => {
  let result     = {err: true};
  try{
  result = await transactionService.deleteTransaction(req.query.id);
  }catch(e){
    console.log(e);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,e);
  }
  res.send(result);
});

/*
Update Trades Transaction
*/
const updateTrades = catchAsync(async (req, res) => {
  let result     = {err: true};
  const symbol   = req.body.symbol;
  const type     = req.body.type;
  const price    = req.body.price;
  const quantity = req.body.quantity;
  const id       = req.body.id;
  try{
    let tradeEntry ={
      ticker_symbol : symbol,
      trade_type    : type,
      quantity      : quantity,
      rate          : price,
      status        : true,
      created_on    : moment().tz(TIMEZONE).format(),
      updated_on    : moment().tz(TIMEZONE).format()
    }
    result = await transactionService.updateTransaction(id,tradeEntry);
  }catch(e){
    console.log(e);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,e);
  }
  res.send(result);
});


module.exports = {
  buyTrades,
  sellTrades,
  updateTrades,
  deleteTrades
};
