const axios = require('axios');
const controller = {};
const baseURL = 'https://www.omdbapi.com/';
const apiKey = 'apikey=f52f22c1';
const jwt = require('jsonwebtoken');
const model = require('../models/index');

controller.getByTitle = async function(req,res){
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        axios.get(baseURL + '?' + 't=' + req.params.title  + '&' + apiKey )
        .then(function(response){
            res.status(200).json({
                message:'Fetch from API',
                posterUrl: response.data.Poster
            });
        })
        .catch(function(err){
            res.status(404).json({
                message: err.message
            });
        });
        req.log.info('request completed')
    })
};

controller.getAll = async function(req,res){
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
}

module.exports = controller;