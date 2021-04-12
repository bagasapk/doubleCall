const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const model = require('../models/index');
const verifyToken = require('../middleware/verify');
// const user = require('./users');

// GET movies
router.get('/', verifyToken,(req, res, next)=>{
    jwt.verify(req.token,'secretKey',(err,authData)=>{
    if(err){
      res.sendStatus(403);
    }else{
      try {
        const favorite_movies = model.favorite_movies.findAll();
        if (favorite_movies.length !== 0) {
          res.json({
            'status': 'OK',
            'messages': '',
            'data': favorite_movies
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
    }
  })
});

router.post('/', verifyToken, (req, res, next)=>{s
  jwt.verify(req.token,'secretKey',(err,authData)=>{
    if(err){
      res.sendStatus(403);
    }else{
      try {
        const {
          title,
          user_id
        } = req.body;
        const favorite_movies = model.favorite_movies.create({
          title,
          user_id
        });
      if (favorite_movies) {
        res.status(201).json({
          'status': 'OK',
          'messages': 'User berhasil ditambahkan',
          'data': favorite_movies,
          authData
        })
      }
     } catch (err) {
       res.status(400).json({
         'status': 'ERROR',
         'messages': err.message,
         'data': {},
         authData
       })
     }
    }
  })
});

module.exports = router;