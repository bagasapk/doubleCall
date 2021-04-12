const express = require('express');
const router = express.Router();
const model = require('../models/index');
// GET users listing.
router.get('/', async function (req, res, next) {
    try {
      const users = await model.users.findAll({});
      if (users.length !== 0) {
        res.json({
          'status': 'OK',
          'messages': '',
          'data': users
        })
      } else {
        res.json({
          'status': 'ERROR',
          'messages': 'EMPTY',
          'data': {}
        })
      }
    } catch (err) {
      res.json({
        'status': 'ERROR',
        'messages': err.message,
        'data': {}
      })
    }
});
// POST users
router.post('/', async function (req, res, next) {
  try {
    const {
      name,
      password
    } = req.body;
    const users = await model.users.create({
      name,
      password
    });
  if (users) {
    res.status(201).json({
      'status': 'OK',
      'messages': 'User berhasil ditambahkan',
      'data': users,
    })
  }
 } catch (err) {
   res.status(400).json({
     'status': 'ERROR',
     'messages': err.message,
     'data': {},
   })
 }
});

module.exports = router;