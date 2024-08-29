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
       var Qty=1;
       let userCart=await client.db('shopping-cart').collection('cart').findOne({user:new objectId(userId)})
       if(userCart){
       client.db('shopping-cart').collection('cart').updateOne({user:new objectId(userId)},{
      
         $push:{products:[{product:new objectId(proId),Qty:Qty}]}
       } 
       ).then((response)=>{
         resolve()
       })
       }
       else{
       let userObj={
         user:new objectId(userId), 
         products:[{product:new objectId(proId),Qty:Qty}]
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
         $lookup:{
           from:'product', 
           let:{prodlist:"$products"}, 
          pipeline:[
            {
              $match:{
                $expr:{
                  $in:['$_id',"$$prodlist"]
                }
              }
                
            }], 
            as:'cartItems'
           
         } 
       }
       
       ]).toArray()
       resolve(cartItems)
     })
   }, 
   getCartCount:(userId)=>{
     return new Promise(async(resolve, reject)=>{
       let count=0;
     let user=await client.db('shopping-cart').collection('cart').findOne({user:new objectId(userId)})
     if(user){
       count=user.products.length
     }
   //  console.log(count)
     resolve(count)
     })
   
   }, 
   decreaseCartItem:(proId,userId)=>{
     client.db('shopping-cart').collection('cart').findOne({user:new objectId(userId),})
   },
   placeOrder:(order,product,userId)=>{
    
    let status =order['payment-method']==='COD'?'placed':'pending'
    let orderObj={
      deliveryDetails:{
        mobile:order.mobile,
        address:order.address,
        pincode:order.pincode
      },
      userId:new objectId(userId),
      paymentMethod:order['payment-method'],
      product:product,
      status:status
    }


    client.db('shopping-cart').collection('order').insertOne(orderObj).then((response)=>{
      //resolve()
    })
    console.log(orderObj)
   }
  
   
   
}