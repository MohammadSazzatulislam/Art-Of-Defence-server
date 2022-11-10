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

function verifyJWT(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401).send({ message: "unauthorization access" });
  }

  jwt.verify(
    authorization,
    process.env.JWT_TOKEN_ACCESS,
    function (err, decoded) {
      if (err) {
        res.status(401).send({ message: "unauthorization access" });
      }
      req.decoded = decoded;
      next();
    }
  );
}

async function run() {
  try {
    const serviceCollection = client.db("artDefensee").collection("servicess");
    const reviewCollection = client.db("artUserReviews").collection("reviews");

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_TOKEN_ACCESS, {
        expiresIn: "1d",
      });
      res.send({ token });
    });

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

    app.post("/services", async (req, res) => {
      const query = req.body;
      const result = await serviceCollection.insertOne(query);
      res.send(result);
    });

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

    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      const option = { upsert: true };
      const update = {
        $set: {
          name: user.name,
          description: user.description,
        },
      };
      const result = await reviewCollection.updateOne(filter, update, option);
      res.send(result);
    });

    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const userReview = await reviewCollection.findOne(query);
      res.send(userReview);
    });

    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.name) {
        query = {
          name: req.query.name,
        };
      }
      const filter = reviewCollection.find(query);
      const result = await filter.toArray();
      res.send(result);
    });

    app.get("/review", verifyJWT, async (req, res) => {
      const decoded = req.decoded;

      if (decoded.email !== req.query.email) {
        res.status(403).send({ message: "Forbidden access" });
      }

      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }

      const filter = reviewCollection.find(query);
      const result = await filter.toArray();
      res.send(result);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`port is running on ${port}`);
});
