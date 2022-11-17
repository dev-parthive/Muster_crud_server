const express = require('express')
const cors = require('cors');
require('colors')

const { MongoClient, ObjectId } = require('mongodb');
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
// create producs  
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

// read/ get products from DB
app.get('/product', async (req, res) =>{
    try{
        const cursor =   productCollection.find({})
       const products = await  cursor.toArray()
       res.send({
        success: true, 
        message: 'got the data', 
        data: products 
       })
    }
    catch(error){
        console.log(error.name.bgRed, error.message.bold)
        
        res.send({
            succeess: false, 
            message: "something went wrong "
        })

    }
})

//Prodcut delete api 
app.delete('/product/:id', async (req, res)=>{
    const id = req.params.id

    try{
        // const product = await productCollection.findOne({_id: ObjectId(id)})
        // if(product?._id){
        //     res.send({
        //         success: false, 
        //         erro: "Product doesn't exist "
        //     });
        //     return;
        //  } 

        const result = await productCollection.deleteOne({_id: ObjectId(id)})
        if(result.deletedCount){
            console.log("successfully deleted".yellow)
            res.send({
                success: true,
                message: `product is deleted`
            })
        }else{
            console.log("something went wrong ".red)
        }
    }
    catch(error){
        res.send({
            success: false,
            error: error.message
        })
    }
}) 

/// to get the specific product 
app.get('/product/:id',  async(req, res)=>{
    try {
        const  id = req.params.id
        const product = await productCollection.findOne({_id: ObjectId(id)})
        res.send({
            success: true ,
            data: product
        })
        
    }
    catch(error){
        res.send({
            success : false,
            error: error.message
        })

    }
}) 

//akn kaj holo edit korar data k db te patano 
app.patch("/product/:id", async(req, res)=>{
    const {id} = req.params
    try{
        const result = await productCollection.updateOne({_id: ObjectId(id)} , {$set: req.body})
        if(result.modifiedCount){
            res.send({
                success: true, 
                message: 'successfully updated '
            })
        }else{
            res.send({
                success: false, 
                error: "Couldn't update the product"
            })
        }
    }
    catch(error){
        res.send({
            succeess: false,
            error: error.message
        })
    }
})

app.get('/', (req, res)=>{
    res.send('server is running...')
})
app.listen( port, ()=> {
    console.log(`server is running on port : ${port}` .yellow)
})
