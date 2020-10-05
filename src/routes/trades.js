var express = require('express');
var router = express.Router();
const {tradeController} = require('../controllers');
const validate = require('../middlewares/validate');
const {tradeValidation} =require('../validation')

/* GETlisting. */
router.get('/all',validate(tradeValidation.allTrades),tradeController.allTrades );


module.exports = router;
