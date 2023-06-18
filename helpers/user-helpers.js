const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://abhi:hacker.abhi@cluster0.rfzif0y.mongodb.net/?retryWrites=true&w=majority";
var objectId=require('mongodb').ObjectId
// Create a MongoClient with a MongoClientOptions object to set the Stable API version


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
var db=require('../Config/connection').get
const bcrypt = require('bcrypt');
module.exports={
   doSignup:(userData)=>{
     return new Promise(async(resolve, reject)=>{
    //  console.log(userData)
       userData.Password=await bcrypt.hash(userData.Password,10)
       
       
      client.db('shopping-cart').collection('user').insertOne(userData).then((data)=>{
        resolve(data);
      }) 
     })
   },
   doLogin:(userData)=>{
    return new Promise(async(resolve,reject)=>{
   //   let loginStatus=false;
      let response={}
      
     let login={}
      let user=await client.db('shopping-cart').collection('user').findOne({Email:userData.Email})
   //   console.log(userData)
     // console.log(user)
    if(user){
        bcrypt.compare(userData.Password,user.Password).then((status)=>{
          if(status){
            
            // remove it 
            
            
            
          //  console.log(status)
            response.user=user;
            login.status=true;
            response.login=login;
            resolve(response);
          //  console.log(resolve)
          //  console.log(response)
            console.log("Login success");
          }else{
            login.status=false;
            login.PasswordErr=true;
            login.EmailErr=false;
            response.login=login;
            console.log("login failed pswd err")
            resolve(response);
          }
        })
      }else{
        login.status=false;
        login.PasswordErr=false;
        login.EmailErr=true;
    //    response.status=false;
        response.login=login;
        resolve(response);
    //    console.log(user)
        console.log('login failed email wrong')
      }
  //    console.log("responce in user helper "+response)
    })
   }, 
   addToCart:(proId, userId)=>{
     return new Promise(async(resolve, reject)=>{
let  products={
         item:new objectId(proId), 
         Qty:1
       }
    //   var gty=1;
       let userCart=await client.db('shopping-cart').collection('cart').findOne({user:new objectId(userId)})
       
       if(userCart){
             proExit=userCart.products.findIndex(product => product.item==proId)
    //   console.log(userCart.prodobj)
    //   console.log(proExit)
    if(proExit!=-1){
     client.db('shopping-cart').collection('cart').findOneAndUpdate({"user":new objectId(userId), "products.item":new objectId(proId)},
{
        $inc:{"products.$.Qty":1}
     
      }).then(()=>{
        resolve()
      })
    }else{
       client.db('shopping-cart').collection('cart').updateOne({user:new objectId(userId)},{
      
         $push:{products}
       } 
       ).then((response)=>{
         resolve()
       })
       }}
       else{
       let userObj={
         user:new objectId(userId), 
         products:[products] 
       }
    
     
       client.db('shopping-cart').collection('cart').insertOne(userObj).then((response)=>{
         resolve()
       })
       }

       
     })
   }, 
   getCartProducts:(userId) =>{
     return new Promise(async(resolve, reject)=>{
  let cartItems=await  client.db('shopping-cart').collection('cart').aggregate([
         {
         $match:{user:new objectId(userId)}
       }, 
       {
         $unwind:"$products"
       }, {
         $project:{
           item:"$products.item", 
           Qty:"$products.Qty"
         }
       },
       {
       $lookup:{
           from:"product", 
           localField:"item", 
           foreignField:"_id", 
           as:"product"
         }
       }

       
       ]).toArray()
     //  console.log(cartItems)
       resolve(cartItems)
     })
   }, 
  getCartCount:(userId)=>{
     return new Promise(async(resolve, reject)=>{
       let count=0;
     let user=await client.db('shopping-cart').collection('cart').findOne({user:new objectId(userId)})
     if(user){
       count=Object.keys(user.products).length
     }
     console.log("count ="+count)
     resolve(count)
     })
   
   }, 
  addCartItem:(proId,userId)=>{
     return new Promise((resolve, reject)=>{

       console.log('add')
     client.db('shopping-cart').collection('cart').findOneAndUpdate({"user":new objectId(userId),"products.item":new objectId(proId)},
     {
        $inc:{"products.$.Qty":1}
     
      }).then(()=>{
        resolve()
      })
     }) 
   }, 
   decCartItem:(proId,Qty,userId)=>{
     return new Promise(async(resolve, reject)=>{

  // let productData =await client.db('shopping-cart').collection('cart').findOne({"user":new objectId(userId),"products.item":new objectId(proId)})
  // console.log(productData)
  //console.log(Qty)
  if(Qty==0){
    client.db('shopping-cart').collection('cart').updateOne(
      {user:new objectId(userId)},
    {$pull:
    {products:
    {item:new objectId(proId)}
    }
    })
    resolve()
//    console.log("removed")
  }
  else{
     
     client.db('shopping-cart').collection('cart').findOneAndUpdate({"user":new objectId(userId),"products.item":new objectId(proId)},
     {
        $inc:{"products.$.Qty": -1}
     
      }).then(()=>{
        resolve()
      })
     }
   }) 
   }, 
  totalPrice:(userId ,cartCount)=>{
return new Promise(async(resolve, reject)=>{
  if (cartCount!=0){
  let total=await  client.db('shopping-cart').collection('cart').aggregate([
         {
         $match:{user:new objectId(userId)}
       }, 
       {
         $unwind:"$products"
       }, {
         $project:{
           item:"$products.item", 
           Qty:"$products.Qty"
         }
       },
       {
       $lookup:{
           from:"product", 
           localField:"item", 
           foreignField:"_id", 
           as:"product"
         }
       }, 
         {
       $project:{
           item:1, Qty:1, product:{$arrayElemAt:["$product",0]}
         }
         }, 
         {
           
        $group:{
           _id:null, 
           total:{$sum:{$multiply:['$Qty','$product.price']}}
         }
       }

              ]).toArray()
  
    
       resolve(total[0].total)
  }else{
    resolve()
  }
     })
  }, 
  getCartProductsList:(userId)=>{
    return new Promise(async(resolve, reject)=>{
      let cart=await client.db('shopping-cart').collection('cart').findOne({user:new objectId(userId)})
      resolve(cart.products)
    })
  }, 
  placOrder:(order, product, totalPrice)=>{
    return new Promise ((resolve, reject)=>{
let date = new Date().toLocaleDateString("en-IN");
//console.log(date);
     // console.log(order, product, totalPrice)
      let status=order.paymentMethod==='COD'?'Order Placed':'pending'
      let orderObj={
        deliveryDetails:{
          address:order.address, 
          mobile:order.mobile, 
          pincode:order.pincode
        }, 
        date:date, 
        userId:new objectId(order.userId), 
        product:product, 
        totalPrice:totalPrice, 
        status:status
      }
      client.db('shopping-cart').collection('order').insertOne(orderObj).then((response)=>{
 client.db('shopping-cart').collection('cart').deleteOne({user:new objectId(order.userId)}).then(()=>{
   resolve()
 })
        
      })
   
    })
  }, 
 /* getOrders:(userId)=>{
    return new Promise(async(resolve, reject)=>{
let orders= await client.db('shopping-cart').collection('order').findOne({userId:new objectId(userId)})
 
       resolve(orders)
    })
  }, */
   getUserOrders:(userId) =>{
     return new Promise(async(resolve, reject)=>{
  let cartItems=await  client.db('shopping-cart').collection('order').aggregate([
         {
         $match:{userId:new objectId(userId)}
       }, 
       {
         $unwind:"$product"
       }, {
         $project:{
           item:"$product.item", 
           Qty:"$product.Qty", 
           date:"$date", 
           deliveryDetails:"$deliveryDetails", 
           totalPrice:"$totalPrice", 
           status:"$status", 
           userId:"$userId"
         }
       },
       {
       $lookup:{
           from:"product", 
           localField:"item", 
           foreignField:"_id", 
           as:"product"
         }
       }

       
       ]).toArray()
       console.log(cartItems)
       resolve(cartItems)
     })
   }, 
   getProduct:(proId)=>{
     return new Promise (async(resolve, reject)=>{
    product=await client.db('shopping-cart').collection('product').findOne({_id:new objectId(proId)})
    resolve(product)
     }) 
   }, 
   getOrderDetails:(userId)=>{
     return new Promise(async(resolve, reject)=>{
     let  details=await  client.db('shopping-cart').collection('order').findOne({userId:new objectId(userId)})
     resolve(details)
     })
   }
  

}
  
   
   
