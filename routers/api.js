const express = require ('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

//get list of users
router.get('/user',function(req,res,next){
    User.find({}).then(function(users){
        res.send(users);
    });
});

//show login page
router.get('/user/login', (req, res) => {
  res.render('login.hbs');
});

//show registration page
router.get('/user/register', (req, res) => {
    res.render('register.hbs');
});

//add new user to the db
router.post('/user/register',function(req,res,next){
    User.create(req.body).then((user)=>{
        res.send(user);
    });
});

//tried hashing didn't work out
// router.post('/user/register', async (req, res) => {
//       const hashedPassword = bcrypt.hash(req.body.pass, 10);
//       User.create({
//         name: req.body.name,
//         email: req.body.email,
//         uname: req.body.uname,
//         regno: req.body.regno,
//         pass: hashedPassword
//       }).then((user)=>{
//           res.send(user);
//       });
//   });

module.exports = router;