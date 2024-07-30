const express = require('express')
const mongoose = require("mongoose");

const app = express()
const home = require('./routes/home')
const books = require('./routes/books')
const customers = require('./routes/customers')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost:27017/project')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

app.use('/', home)
app.use('/api/books', books)
app.use('/api/customers', customers)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))