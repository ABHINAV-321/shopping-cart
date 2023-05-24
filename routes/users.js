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
router.get('/', async function(req, res, next) {
  let user= req.session.user
  let cartCount=0
if(user){
 cartCount= await userHelper.getCartCount(user._id)
console.log(cartCount)
}

productHelper.getAllProducts().then((product)=>{

  res.render('./user/view-user-product', { product,admin:false,user,cartCount});
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
router.get('/cart',loginCheck,async(req, res)=>{
let cartCount=0
if(req.session.user){
 cartCount= await userHelper.getCartCount(req.session.user._id)}
  let products=await userHelper.getCartProducts(req.session.user._id)
  console.log(products)
res.render('./user/cart',{products,user:req.session.user,cartCount})
})
router.get('/add-to-cart/:id',loginCheck, (req, res)=>{

  userHelper.addToCart(req.params.id, req.session.user._id).then(()=>{
    res.redirect('/')
  })
})
router.get('/sub/:id',(req, res)=>{
  userHelper.decreaseCartItem(req.params.id,req.session.user._id)
})
module.exports = router;
