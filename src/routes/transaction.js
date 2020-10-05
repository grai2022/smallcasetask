var express = require('express');
var router = express.Router();
const {transactionController} = require('../controllers');
const validate = require('../middlewares/validate');
const {transactionValidation} =require('../validation')

/*PostListing*/
router.post('/buy',validate(transactionValidation.buyTrades),transactionController.buyTrades );
router.post('/sell',validate(transactionValidation.sellTrades),transactionController.sellTrades );

/*patchListing*/
router.patch('/update', validate(transactionValidation.updateTrades), transactionController.updateTrades);

/*deleteListing*/
router.delete('/', validate(transactionValidation.deleteTrades), transactionController.deleteTrades);

module.exports = router;