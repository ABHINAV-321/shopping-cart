var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs-extra');
var productHelper =require('../helpers/Product-helpers')
/* GET home page. */
router.get('/', function(req, res, next) {
productHelper.getAllProducts().then((product,_id)=>{
res.render('./admin/view-products', {product,admin:true});
})

  
 
});
router.get('/add-product',(req,res)=>{
  res.render('./admin/add-product',{admin:true})
})
router.post('/add-product',(req,res)=>{
//  console.log(req.body)
  //console.log(req.files.img)
  productHelper.addProduct(req.body,(id)=>{
   // console.log(id)
    const image = req.files;
   // console.log(image.img.name)
//var uploadPath = path.resolve(__dirname, '../public/images/products-Img/')
   image.img.mv(__dirname + '/../public/images/product-img/'+id+".jpg",(err, done)=>{
     if(!err){
       console.log("file saved as "+__dirname + '/../public/images/product-img/'+id+".jpg") 
     }else{
       console.log(err)
     }
   }) ;

// Using call back function
res.render('./admin/add-product',{admin:true})
  })
})
module.exports = router;
