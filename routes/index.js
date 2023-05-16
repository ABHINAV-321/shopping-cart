var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let products=[
    {
    name:"iphone 14 pro max ", 
    img:"https://media.croma.com/image/upload/v1662655485/Croma%20Assets/Communication/Mobiles/Images/261971_c8p8eb.png" , 
    des:"latest iphone model 14 pro max with 128gb sd", 
    price:140000
  }, 
  {
    name:"i watch series 8", 
    des:"with huge display, gps, Bluetooth,.....", 
    price:89000, 
    img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRc_46L5h4D_3YjyDbVILMMryJQGzv27E2V8iUU520TyA&usqp=CAU&ec=48600113"
  
    
  }, 
  {
    name:"Apple ear pods pro", 
    img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSwPCbKzlYNa5QISiL5EKb8zamYIGoqfagdPAznG24QQ&usqp=CAU&ec=48600113", 
    des:"brand Apple, ear pods with Bluetooth", 
    price:25000
  }, 
  {
    name:"apple mac book 2023 512 GB", 
    img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8qrvXnOeX9dUXQX6xnSODGD0-Km15tsjwSygI_BgWaQ&usqp=CAU&ec=48600113",
    des:"mac book with 512 gb varient ", 
    price:"249,000"
  }
  ]
  res.render('index', { products,admin:false});
});

module.exports = router;
