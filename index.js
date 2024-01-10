const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pzm1kvk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectToMongo = async () => {
  await client.connect();
};

const orderData = () => client.db("shopping").collection("insertData");
const mainData = () => client.db("shopping").collection("mainData");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", asyncHandler(async (req, res, next) => {
  await connectToMongo();
  next();
}));

const router = express.Router();

router.get("/getMainData", asyncHandler(async (req, res) => {
  const result = await mainData().find().toArray();
  res.send(result);
}));

router.get("/getData", asyncHandler(async (req, res) => {
  const { email } = req.query;
  const booking = await orderData().find({ email }).toArray();
  res.send(booking);
}));

router.post("/postData", asyncHandler(async (req, res) => {
  const body = req.body;
  const result = await orderData().insertOne(body);
  res.send(result);
}));

router.delete("/deleteData/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await orderData().deleteOne({ _id: new ObjectId(id) });
  res.send(result);
}));

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
