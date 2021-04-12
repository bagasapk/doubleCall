const express = require('express');
const router = express.Router();
const model = require('../models/index');
const verifyToken = require('../middleware/verify');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// GET users listing.
router.get('/', verifyToken, (req, res, next) => {
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
router.post('/', async function (req, res, next) {
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

module.exports = router;