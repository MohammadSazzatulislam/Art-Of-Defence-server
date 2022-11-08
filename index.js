const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4lwt8qz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run() {
    try {
        const serviceCollection = client.db("artDefensee").collection("servicess");
        
        app.get('/services', async(req, res) => {
            const query = {}
            const userServices = serviceCollection.find(query)
            const services = await userServices.limit(3).toArray()
            res.send(services)
        })



    } finally {
        
    }
}
run().catch(err=> console.log(err))







app.listen(port, () => {
    console.log(`port is running on ${port}`)
})