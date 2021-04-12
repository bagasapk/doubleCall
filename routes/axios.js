const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

router.get('/:title', controller.axios.getByTitle)

module.exports = router;