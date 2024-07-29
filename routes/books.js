const express = require('express');
const Joi = require("joi");
const mongoose = require("mongoose");
const router = express.Router();

mongoose.connect('mongodb://localhost:27017/project')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
    uppercase: true
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 30,
  },
  price: {
    type: Number,
    required: true,
    min: 50,
    max: 1000,
    get: v => Math.round(v),
    set: v => Math.round(v),
  }
})

const Book = mongoose.model('Book', bookSchema);

// GET
router.get('/', (_, res) => {
  res.send(books)
})

router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id))
  if (!book) return res.status(404).send('Book not found!')
  res.send(book)
})

// POST
router.post('/', (req, res) => {
  const {error} = validateBook(req.body)
  if (error) return res.status(400).send(error.details[0].message)


  const book = new Book({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price
  });

  try {
    const result =  book.save()
    console.log(result)
  } catch (e) {
    for (let field in e.errors) {
      console.log(e.errors[field].message)
    }
  }


  postCourse()
  res.send(book)
})

// PUT
router.put('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id))
  if (!book) return res.status(404).send('Book not found!')

  const {error} = validateBook(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const {title, description, price} = req.body
  book.title = title
  book.description = description
  book.price = price

  res.send(book)
})

// Delete
router.delete('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id))
  if (!book) return res.status(404).send('Book not found!')

  const index = books.indexOf(book)
  books.splice(index, 1)
  res.send(book)
})

function validateBook(books) {
  const schema = Joi.object().keys({
    title: Joi.string().min(4).required(),
    description: Joi.string().min(4).required(),
    price: Joi.number().required(),
  })
  return schema.validate(books)
}

module.exports = router