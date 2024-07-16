const express = require('express')
const app = express()

const home = require('./routes/home')
const books = require('./routes/books')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', home)
app.use('/api/books', books)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))