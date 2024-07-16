const express = require('express');
const router = express.Router();

// GET
router.get('/', (_, res) => {
  res.send('Hello world!')
})

module.exports = router;