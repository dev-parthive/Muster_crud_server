const express = require('express')
const cors = require('cors');
require('colors')

const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express() ;


// require dotenv 
require('dotenv').config()

// Middleware 
app.use(cors())
app.use(express.json())



// make connection with mongodb 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.afdwhlk.mongodb.net/?retryWrites=true&w=majority`;

// client k use kore ami database theke data nib 
const client = new MongoClient(uri)

async function dbConnect(){
    try{
         // akane cesta kora hocce database sathe connect korar 
 await client.connect() 

 console.log('database connected'.blue.bold) 

    }
    catch(error){
        console.log(error.name.bgRed, error.message.bold, error.stack)

    }

}
dbConnect();

// -------------------------
 // akane 2 ta colelction create korlam (productCollection , usersCollection)
const productCollection =  client.db("crud-operation").collection("products")

const usersCollection = client.db("crud-operation").collection("users") 


//endpoint 
app.post('/product', async(req, res)=>{
 // res.send(getAllProduts())
try {
    const result =  await productCollection.insertOne(req.body);
    if(result.insertedId){
     res.send({
         succeess: true,
         message: `successfully created the ${req.body.name}  product with id ${result.insertedId}`
     })
     
    }else{
     res.send({
         success: false,
         error: 'Couldn\'t create the product'
     })
    }
    
}
catch(error){
    console.log(error.name.bgRed, error.message.bold)
    res.send({
        success: false,
        error: error.message,
    })
}
});


app.get('/', (req, res)=>{
    res.send('server is running...')
})
app.listen( port, ()=> {
    console.log(`server is running on port : ${port}` .yellow)
})
