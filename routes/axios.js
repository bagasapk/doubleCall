const express = require('express');
const router = express.Router();
const controller = require('../controller/index');
const verifyToken = require('../middleware/verify');

router.get('/favorite',verifyToken,controller.axios.getAll)
router.get('/:title',verifyToken,controller.axios.getByTitle)


module.exports = router;