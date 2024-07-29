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

//                                  GET all
router.get('/', async (_, res) => {
  const books = await Book.find().sort('name')
  res.send(books)
})

//                                  GET one
router.get('/:id', async (req, res) => {
  const book = await Book.find(req.params.id)
  if (!book) return res.status(404).send('Book not found!')
  res.send(book)
})

//                                   POST
router.post('/', async (req, res) => {
  const {error} = validateBook(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let book = new Book({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price
  });

  try {
    book = await book.save()
    res.send(book);
  } catch (e) {
    for (let field in e.errors) {
      console.log(e.errors[field].message)
    }
    res.status(500).send('Error saving the book');
  }
})

//                                   PUT
router.put('/:id', async (req, res) => {
  const {error} = validateBook(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const book = await Book.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price
  }, {new: true})

  if (!book) return res.status(404).send('Book not found!')

  res.send(book)
})

//                                   Delete
router.delete('/:id', async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id)
  if (!book) return res.status(404).send('Book not found!')

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