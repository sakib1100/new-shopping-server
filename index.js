const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ${process.env.DB_USER} ${process.env.DB_PASS}
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pzm1kvk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const orderData = client.db("shopping").collection("insertData");
    const mainData = client.db("shopping").collection("mainData");

    // get main data get
    app.get("/getMainData", async (req, res) => {
      const service = mainData.find();
      const result = await service.toArray();
      res.send(result);
    });

    // get data from database for delete
    // app.get("/getData", async (req, res) => {
    //   const service = orderData.find();
    //   const result = await service.toArray();
    //   res.send(result);
    // });
    app.get("/getData", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      console.log("database eamil is", query);
      const booking = await orderData.find(query).toArray();
      res.send(booking);
    });

    // post data
    app.post("/postData", async (req, res) => {
      const body = req.body;
      const result = await orderData.insertOne(body);
      res.send(result);
    });

    app.delete("/deleteData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderData.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Optionally, you may want to close the client when done
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
