const Joi = require('@hapi/joi');

const buyTrades = {
  body: Joi.object().keys({
    symbol: Joi.string().valid('TCS','WIPRO','GODREJIND'),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(1).required()
  }),
};

const sellTrades = {
  body: Joi.object().keys({
    symbol: Joi.string().valid('TCS','WIPRO','GODREJIND'),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(1).required()
  }),
};

const updateTrades = {
  body: Joi.object().keys({
    id: Joi.number().required(),
    price: Joi.number().positive(),
    quantity : Joi.number().integer().min(1),
    type: Joi.string().valid('BUY','SELL'),
    symbol: Joi.string().valid('TCS','WIPRO','GODREJIND')
  }).xor('price','quantity','type','symbol'),
};



const deleteTrades = {
  query: Joi.object().keys({
    id: Joi.number().required()
  }),
};


module.exports = {
  buyTrades,
  sellTrades,
  updateTrades,
  deleteTrades
};
