var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
// const favoriteMovies = require('./routes/favorite_movies');
const { route } = require('./routes/index');
const jwt = require('jsonwebtoken');
// const { BADFLAGS } = require('dns');
// const users = require('./routes/users');
const verifyToken = require('./middleware/verify');
const model = require('./models/index');
// const { response } = require('express');
// const { sequelize } = require('./models/index');
// const { Model } = require('sequelize/types');
const axiosRoutes = require('./routes/axios');
const { default: axios } = require('axios');
// const { stringify } = require('querystring');
// const { RSA_NO_PADDING } = require('constants');
const bcrypt = require('bcrypt');



var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
// var pino = require('express-pino-logger');
var ExpressPinoLogger = require('express-pino-logger');
var pino = ExpressPinoLogger({
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      user: req.raw.user,
      cookie: req.cookies,
      session: req.session,
    }),
  },
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'key',
  saveUninitialized: true,
  resave: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(pino);

app.use('/a', indexRouter);
// app.use('/users',users);
app.get('/users',verifyToken,(req,res)=>{
  jwt.verify(req.token,'secretkey',(err,authData)=>{
      if(err)
          res.sendStatus(403);
      else{
          res.json({
              authData
          })
      }
  })

});
// POST users
// app.post('/users', (req,res)=>{
//   //Dummy User
//   const user ={
//     id: 1,
//     name:'bagas',
//     password:'bagaskara'
//   } 
//   jwt.sign({user},'secretkey',(err,token)=>{
//     res.json({
//       token
//     });
//   });
// });
app.post('/users', async function (req, res, next) {
  try {
    const {
      name,
      password
    } = req.body;
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds)
    const users = await model.users.create({
      name,
      password: encryptedPassword,
    });
  if (users) {
    jwt.sign({users},'secretkey',(err,token)=>{
      res.status(201).json({
      'status': 'OK',
      'messages': 'User berhasil ditambahkan',
      'data': users,
      token,
    });  
  });
}
 } catch (err) {
   res.status(400).json({
     'status': 'ERROR',
     'messages': err.message,
     'data': {},
   })
 }
 req.log.info('request completed')
});

// app.use('/movies/favorite',favoriteMovies);
app.get('/movies/favorite',verifyToken,(req,res)=>{
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

app.post('/movies/favorite',verifyToken,(req,res)=>{
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

app.use('/movies', axiosRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
