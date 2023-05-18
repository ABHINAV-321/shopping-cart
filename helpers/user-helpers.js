const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://abhi:hacker.abhi@cluster0.rfzif0y.mongodb.net/?retryWrites=true&w=majority";

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
      let loginStatus=false;
      let response={}
      let user=await client.db('shopping-cart').collection('user').findOne({Email:userData.Email})

   //   console.log(userData)
     // console.log(user)
    if(user){
      resolve({EmailErr:false})
        bcrypt.compare(userData.Password,user.Password).then((status)=>{
          if(status){
            response.user=user;
            response.status=true;
            resolve({response,PasswordErr:false});
          //  console.log(resolve)
          //  console.log(response)
            
          }else{

            //console.log(status)
          

            resolve({status:false,PasswordErr:true});
          }
        })
      }else{
        resolve({status:false,EmailErr:true});
    //    console.log(user)
        console.log('login failed paswd wrong')
      }
    })
   }
}