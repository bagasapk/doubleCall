const express = require('express');
const router = express.Router();
const controller = require('../controller/index');
const verifyToken = require('../middleware/verify');

router.get('/:title',verifyToken,controller.axios.getByTitle)

module.exports = router;