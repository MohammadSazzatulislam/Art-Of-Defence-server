const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('api comming soon')
})







app.listen(port, () => {
    console.log(`port is running on ${port}`)
})