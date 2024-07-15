const Joi = require('joi');
const express = require('express')
const app = express()

app.use(express.json())

let books = [
  {id: 1, title: 'book 1', description: 'book 1', price: 200},
  {id: 2, title: 'book 2', description: 'book 2', price: 300},
  {id: 3, title: 'book 3', description: 'book 3', price: 400},
  {id: 4, title: 'book 4', description: 'book 4', price: 500},
]

// GET
app.get('/', (_, res) => {
  res.send('Hello world!')
})

app.get('/api/books', (_, res) => {
  res.send(books)
})

app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id))
  if (!book) return res.status(404).send('Book not found!')
  res.send(book)
})

// POST
app.post('/api/books', (req, res) => {
  const { error } = validateBook(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const book = {
    id: books.length + 1,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
  }
  books.push(book)
  res.send(book)
})

// PUT
app.put('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id))
  if (!book) return res.status(404).send('Book not found!')

  const { error } = validateBook(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const {title, description, price} = req.body
  book.title = title
  book.description = description
  book.price = price

  res.send(book)
})

// Delete
app.delete('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id))
  if (!book) return res.status(404).send('Book not found!')

  const index = books.indexOf(book)
  books.splice(index, 1)
  res.send(book)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}`))

function validateBook (books) {
  const schema = Joi.object().keys({
    title: Joi.string().min(4).required(),
    description: Joi.string().min(4).required(),
    price: Joi.number().required(),
  })
  return schema.validate(books)
}