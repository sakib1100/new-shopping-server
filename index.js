const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;






app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pzm1kvk.mongodb.net/?retryWrites=true&w=majority`;

// console.log(url)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run(){
    try{
  await client.connect();
  const serviceCollection = client.db('shopping').collection('insertData');
  
  
  //get data from database

app.get('/getData', async (req,res) => {
const service = await serviceCollection.find({}).toArray();
res.send(service);
})

//post data

app.post('/post-data', async(req,res) => {
  const body = req.body;
  const result = await serviceCollection.insertOne(body);
  res.send(result);
})

// delete product

// app.get('/getData/:id', async(req,res) => {
//   const id = req.params.id;
// const query = await serviceCollection.find({_id: new ObjectId(id)});
// res.send(query);
// })




app.delete('/deleteData/:id', async(req,res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await serviceCollection.deleteOne(query);
  res.send(result)
  })
  
  
    }


    finally{
  
    }
  }
  
  
  run().catch(console.dir);
  
  

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})