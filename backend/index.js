const express = require('express')
const dotenv = require('dotenv')

dotenv.config();
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || 5000, () => {
    console.log("Server listening on port " + process.env.PORT || 5000)
})