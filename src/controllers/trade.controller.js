const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tradeService} = require('../services');

/*
Get All Trades
*/
const allTrades = catchAsync(async (req, res) => {
  let result = false;
    result = await tradeService.allTrades({where:{status:true}});
  if(!result){
    throw new ApiError(httpStatus.NOT_FOUND, 'No Trade Data Found');
  }
  res.send(result);
});

module.exports = {
  allTrades
};
