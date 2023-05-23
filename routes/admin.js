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
router.post('/add-product',(req,res)=>{  productHelper.addProduct(req.body,(id)=>{
   // console.log(id)
    const image = req.files;
   
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
router.get('/delete-product',(req, res)=>{
  let proId=req.query.id;
 productHelper.deleteProduct(proId).then((resolve,reject)=>{
   res.redirect('/admin')
   //console.log(resolve)
 })
  
})
router.get('/edit-product',(req, res)=>{
  let proId=req.query.id
productHelper.getProduct(proId).then((product)=>{

  
res.render('./admin/Edit-product', product)
}) 

})
router.post('/edit-product',(req, res)=>{
  id=req.query.id 
const image = req.files;
  productHelper.updateProduct(id,req.body).then(()=>{
    
//  console.log(image) 
    if(image){
        image.img.mv( __dirname +'/../public/images/product-img/'+id+".jpg") 
    }else{
      console.log('no file'+id)
    }
res.redirect('/admin')
  })
})

module.exports = router;
