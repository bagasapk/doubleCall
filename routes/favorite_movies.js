const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const model = require('../models/index');
const verifyToken = require('../middleware/verify');
const axios = require('axios');
// const user = require('./users');

// GET movies
router.get('/',verifyToken,(req,res)=>{
  jwt.verify(req.token,'secretkey',(err,authData)=>{
      if(err){
          res.sendStatus(403);
      }
      else{
        try {
          model.favorite_movies.findAll({
            where: {
              user_id: authData.users.id
            },
            attributes: [
              'title'
            ]
          }).then((favorite_movies) => {
            if (favorite_movies.length !== 0) {
              var text = favorite_movies.map(function(title){
                return title.title;
              });
              var getString = text.join(',');
              var removeSpace = getString.replace(/\s/g,'+');
              var getArray = removeSpace.split(',');
              var i = getArray.length-1;
              var data = [];
              var dataFinal = [];
              for(i;i>=0;i--){
                data.push(
                  axios.get("https://www.omdbapi.com/?apikey=f52f22c1&" + "t=" + getArray[i])
                  .then(response => {
                    dataFinal.push(response.data.Poster)
                  }) 
                )
              }Promise.all(data).then(()=> res.json({
                posterUrl: dataFinal
              }))
            }
             else {
              res.json({
                'status': 'ERROR',
                'messages': 'EMPTY',
                'data': {},
                authData
              })
            }
          });
        } catch (err) {
          res.json({
            'status': 'ERROR',
            'messages': err.message,
            'data': {},
            authData
          })
        }
      }
      req.log.info('request completed')
  })
});

router.post('/',verifyToken,(req,res)=>{
  jwt.verify(req.token,'secretkey',(err,authData)=>{
      if(err){
          res.sendStatus(403);
      }
      else{
        try {
          const {
            title,
          } = req.body;
          const favorite_movies = model.favorite_movies.create({
            title,
            user_id: authData.users.id
          });
          console.log(favorite_movies)
        if (favorite_movies) {
          model.favorite_movies.findAll().then((response) => {
            res.status(201).json({
              'status': 'OK',
              'messages': 'Movies berhasil ditambahkan',
            });
          });
        }
       } catch (err) {
         res.status(400).json({
           'status': 'ERROR',
           'messages': err.message,
         })
       }
      }
      req.log.info('request completed')
    })
});

module.exports = router;