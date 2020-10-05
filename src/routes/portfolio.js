var express = require('express');
var router = express.Router();
const {portfolioController} = require('../controllers');
const validate = require('../middlewares/validate');
const {portfolioValidation} =require('../validation')

/* GETlisting. */
router.get('/',validate(portfolioValidation.portfolio),portfolioController.portfolio);
router.get('/returns',validate(portfolioValidation.portfolioReturns), portfolioController.portfolioReturns);

module.exports = router;