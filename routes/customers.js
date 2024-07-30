const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20
  },
  isGold: {
    type: Boolean,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    minlength: 5,
    maxlength: 20,
  }
})

const Customer = mongoose.model('Customer', customerSchema);

//                              Get all
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort('name')
    res.send(customers);
  } catch (e) {
    res.send(e.message)
  }
})

//                             Post
router.post('/', async (req, res) => {
  const customer = new Customer ({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  })

  try {
    const result = await customer.save()
    res.send(result)
  } catch (e) {
    res.send(e)
  }
})

module.exports = router;