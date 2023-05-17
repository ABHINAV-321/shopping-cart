var express = require('express');
var router = express.Router();
var productHelper =require('../helpers/Product-helpers')
var userHelper = require('../helpers/user-helpers.js')

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
router.post('/signup',(req, res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    console.log(req.body)
  })
})
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body)
})

module.exports = router;
