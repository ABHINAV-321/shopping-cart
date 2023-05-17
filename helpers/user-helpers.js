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
       userData.Password=await bcrypt.hash(userData.Password,10)
      client.db('shopping-cart').collection('user').insertOne(userData).then((data)=>{
        console.log(data)
        resolve(data);
      }) 
     })
   }
}