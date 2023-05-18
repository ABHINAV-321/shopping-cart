var express = require('express');
var router = express.Router();
var productHelper =require('../helpers/Product-helpers')
var userHelper = require('../helpers/user-helpers.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  let user= req.session.user
  console.log(user)
productHelper.getAllProducts().then((product)=>{

  res.render('./user/view-user-product', { product,admin:false,user});
}); 
});
router.get('/login',(req, res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
  res.render('./user/login',{"login-err":req.session.loginErr});
  req.session.loginErr=false;
  }
})
router.get('/signup',(req, res)=>{
  res.render('./user/Signup');
})
router.post('/signup',(req, res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    console.log(req.body)
    res.send('<h1>signup successful</h1>')
  })
})
router.post('/login',(req,res)=>{

  userHelper.doLogin(req.body).then((response)=>{
    console.log(response.loginErr);
    if(response.status===true){
      req.session.loggedIn=true;
      req.session.user=response.user
     
    //  console.log("working")
      
      res.redirect ('/')
    }else{
      res.redirect('/login')
      req.session.loginErr=true;
    
    }
  })

})

router.get('/logout',(req, res)=>{
  req.session.destroy()
  res.redirect('/login')
})

module.exports = router;
