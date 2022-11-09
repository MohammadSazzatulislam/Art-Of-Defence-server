const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4lwt8qz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("artDefensee").collection("servicess");
    const reviewCollection = client.db("artUserReviews").collection("reviews");

    app.get("/services", async (req, res) => {
      const query = {};
      const userServices = serviceCollection.find(query);
      const services = await userServices.limit(3).toArray();
      res.send(services);
    });

    app.get("/service", async (req, res) => {
      const query = {};
      const userServices = serviceCollection.find(query);
      const services = await userServices.toArray();
      res.send(services);
    });

    app.post('/services', async (req, res) => {
      const query = req.body
      const result = await serviceCollection.insertOne(query);
      res.send(result)
      
    })

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const userServices = await serviceCollection.findOne(query);
      res.send(userServices);
    });

    app.post("/reviews", async (req, res) => {
      const query = req.body;
      const result = await reviewCollection.insertOne(query);
      res.send(result);
    });

    app.get('/reviews', async (req, res) => {
      let query = {}
      if (req.query.name) {
        query = {
          name : req.query.name
        };
      }
      const filter = reviewCollection.find(query)
      const result = await filter.toArray()
      res.send(result)

    })


    app.get('/review', async (req, res) => {
      let query = {}
      if (req.query.email) {
        query = {
          email : req.query.email
        };
      }
      const filter = reviewCollection.find(query)
      const result = await filter.toArray()
      res.send(result)

    })

    app.delete('/reviews/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: ObjectId(id) }
      const result =await reviewCollection.deleteOne(filter)
      res.send(result)
    })


    



  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`port is running on ${port}`);
});
