const axios = require('axios');
const controller = {};
const baseURL = 'https://www.omdbapi.com/';
const apiKey = 'apikey=f52f22c1';

controller.getByTitle = async function(req,res){
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
};

module.exports = controller;