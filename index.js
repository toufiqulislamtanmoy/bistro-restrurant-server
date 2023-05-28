const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Order Is coming")
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zvd8xno.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("bistroDB");
    const usersCollection = database.collection("users");
    const menuCollection = database.collection("menu");
    const reviewCollection = database.collection("reviews");
    const cartCollection = database.collection("carts");

    // User  api

    app.post('/users',async(req,res)=>{
      const user =req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    // Menu api
    app.get("/menu", async(req,res)=>{
        const result =await menuCollection.find().toArray();

        res.send(result)
    })

    // Reviews api
    app.get("/reviews", async(req,res)=>{
        const result =await reviewCollection.find().toArray();
        res.send(result)
    })

    // Cart api
    app.get('/carts',async(req,res)=>{
      const email = req.query.email;
      if(!email){
        return res.send([]);
      }
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/carts',async(req,res)=>{
      const item =req.body;
      console.log(item);
      const result = await cartCollection.insertOne(item);
      res.send(result);
    })

    app.delete("/carts/:id",async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })
   
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})