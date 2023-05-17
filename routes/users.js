var express = require('express');
var router = express.Router();
var productHelper =require('../helpers/Product-helpers')

/* GET home page. */
router.get('/', function(req, res, next) {
productHelper.getAllProducts().then((product)=>{

  res.render('./user/view-user-product', { product,admin:false});
}); 
});
router.get('/login',(req, res)=>{
  res.render('./user/login');
})
router.get('/signup',(req, res)=>{
  res.render('./user/Signup');
})

module.exports = router;
