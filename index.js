// initializing setup

const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());

// connection uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qhwc1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// using mongodb

async function run() {
  try {
    await client.connect();
    const database = client.db('carMechanic');
    const servicesCollection = database.collection('sevices');

    //GET API
    app.get('/services', async (req, res) => {
      // to get all services data use fild method in serviceCollection wiht parameter empty array {}
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // GET SINGLE SERVICE API
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      //   console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      //   console.log('~ result', result);
      res.json(result);
    });

    // POST API
    app.post('/services', async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// default route
app.get('/', (req, res) => {
  res.send('Running genius car mechanics server');
});
app.get('/hello', (req, res) => {
  res.send('hello genius car mechanics server');
});

app.listen(port, () => {
  console.log('Listening from port at', port);
});
