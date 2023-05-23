var express = require('express');
var router = express.Router();
var productHelper =require('../helpers/Product-helpers')
var userHelper = require('../helpers/user-helpers.js')
var login={};
const loginCheck=(req, res, next)=>{
if(req.session.loggedIn){
  next();
  }
  else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let user= req.session.user
//  console.log(user)
productHelper.getAllProducts().then((product)=>{

  res.render('./user/view-user-product', { product,admin:false,user});
}); 
});
router.get('/login',(req, res)=>{
  
  res.render('./user/login',{"EmailErr":login.EmailErr,"PasswordErr":login.PasswordErr});
  console.log("login here to hbs"+login.EmailErr)
})
router.get('/signup',(req, res)=>{
  res.render('./user/Signup');
})
router.post('/signup',(req, res)=>{
  userHelper.doSignup(req.body).then((response)=>{
   //   console.log(req.body)
   console.log(response)
   req.session.loggedIn=true;
   req.session.user=req.body
   res.redirect('/')
  })
})
router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
//console.log("redponse="+response)
login =response.login

    if(response.login.status){
      req.session.loggedIn=true;
      req.session.user=response.user
    
    // console.log("working")
     res.redirect ('/')
    }else{
      res.redirect('/login')
    
    }
  })
})
router.get('/logout',(req, res)=>{
  req.session.destroy()
  res.redirect('/login')
})
router.get('/cart',loginCheck,(req, res)=>{
res.render('./user/cart')
})
router.get('/add-to-cart/:id',loginCheck, (req, res)=>{

  userHelper.addToCart(req.params.id, req.session.user._id).then(()=>{
    res.redirect('/')
  })
})
module.exports = router;
