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
module.exports={
  addProduct:(product, callback)=>{
 //   console.log(product)
    client.db('shopping-cart').collection('product').insertOne(product).then((data)=>{
   //  console.log(data.insertedId.toString() )
      callback(data.insertedId.toString()) 
    }) 
  }, 
  getAllProducts:()=>{
    return new Promise(async(resolve, reject)=>{
      let product=await client.db('shopping-cart').collection('product').find().toArray()
/*let productsId=await client.db('shopping-cart').collection('product').find({},{"_id":0}).toArray()*/
console.log(product.name)
let id =product._id 

console.log("id jhggg"+id+" profuct id here")
    resolve(product)
      
    })
  }
}