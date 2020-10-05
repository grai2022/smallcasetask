const Joi = require('@hapi/joi');

const portfolio = {
query: Joi.object().keys({
  }),
};

const portfolioReturns = {
  query: Joi.object().keys({
  }),
};



module.exports = {
    portfolioReturns,
    portfolio
};