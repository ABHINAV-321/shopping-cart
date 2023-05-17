var express = require('express');
var router = express.Router();
var productHelper =require('../helpers/Product-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
productHelper.getAllProducts().then((product)=>{

  res.render('index', { product,admin:false});
}); 
});

module.exports = router;
