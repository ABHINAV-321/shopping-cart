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
 // let cartCount=0
 if(user){
cartCount= await userHelper.getCartCount(user._id)
productHelper.getAllProducts().then((product)=>{

  res.render('./user/view-user-product', { product,admin:false,user,cartCount});
}); 

 }else{


productHelper.getAllProducts().then((product)=>{

  res.render('./user/view-user-product', { product,admin:false,user});
}); 
}
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
  let totalPrice=await userHelper.totalPrice(req.session.user._id,cartCount)
  
res.render('./user/cart',{products,user:req.session.user,totalPrice})
})
router.get('/add-to-cart/:id', async (req, res)=>{
//console.log('api log')

  userHelper.addToCart(req.params.id, req.session.user._id).then(()=>{
  //  res.redirect('/')
  res.json({status:true})
  })
})
router.get('/sub/',(req, res)=>{
  userHelper.decCartItem(req.query.id,req.query.Qty,req.session.user._id)
  res.json({status:true})
})
router.get('/add/:id',async (req, res)=>{
//  console.log("post "+req.body)
let data=req.body;
console.log(req.params.id)

//console.log("price"+totalPriceProduct)



  userHelper.addCartItem(req.params.id,req.session.user._id).then(async()=>{

let total= await userHelper.totalPrice(req.session.user._id,req.params.id)
console.log(total)
res.json({status:true,total})
   // console.log(data)
  })
})
router.get('/remove/',(req, res)=>{
 // console.log('f ok')
  id=req.query.id
  productHelper.removeCartProduct(req.session.user._id,id)
  res.redirect('/cart')
})
router.get('/order/',loginCheck,async (req, res)=>{
 let products=await userHelper.getCartProducts(req.session.user._id)
  let totalPrice=await userHelper.totalPrice(req.session.user._id)
  
cartCount= await userHelper.getCartCount(req.session.user._id)
  
  
  res.render('./user/order',{products,totalPrice,cartCount})
})
router.get('/order/address/',(req, res)=>{
  
res.render('./user/address')
})
router.post('/address',(req, res)=>{
  console.log(req.body)
})
module.exports = router;
