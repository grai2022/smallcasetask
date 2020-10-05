const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const {portfolioService} = require('../services');

/*
Get Potfolio
*/
const portfolio = catchAsync(async (req, res) => {
  let result = false;
    result = await portfolioService.portfolio();  
  if(!result){
    throw new ApiError(httpStatus.NOT_FOUND, 'Data Not Found');
  }
  res.send(result);
});

/*
Get Potfolio Returns
*/
const portfolioReturns = catchAsync(async (req, res) => {
  let result = false;
  result = await portfolioService.portfolioReturns(req.query.symbol);
  
  if(result === false){
    throw new ApiError(httpStatus.NOT_FOUND, 'Data Not Found');
  }
  res.send(result);
});


module.exports = {
portfolio,
portfolioReturns
};