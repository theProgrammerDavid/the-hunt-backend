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

//Login
router.post("/user/login", async (req,res)=>{
    const email = req.body.email;
    let passw = req.body.pass;
    const hashedPassword = async function hashPass(passw) {
        let password = pass;
        let saltRounds = 10;
        //Note: Never define a constant salt in the source file
        const salt = '$2b$10$GA94lFm2QPNNF80uz6UMFu';
        const hash = await bcrypt.hash(password, salt);
        return hash
    }
    const pass = req.body.pass;
    User.findOne({email: email},(err,foundResults) => {
        //console.log(req.body);
        //console.log(foundResults);
        //console.log(foundResults.pass);
        //console.log(hashedPassword);
        //console.log(pass)
        if(err){
            console.log(err);
        }
        else{
            if(foundResults.pass === hashedPassword(passw)){
            //if(foundResults.pass == pass){
                res.json({"login":true});
            }
            else{
                res.json({"login":false});
            }
        }
    });
});

//show registration page
router.get('/user/register', (req, res) => {
    res.render('register.hbs');
});

//add new user to the db without hashing
// router.post('/user/register',function(req,res,next){
//     User.create(req.body).then((user)=>{
//         res.send(user);
//     });
// });




//add new user to the db with hashing
router.post('/user/register', async (req, res) => {
    let passw = req.body.pass;
    const hashedPassword = async function hashPass(passw) {
        let password = pass;
        let saltRounds = 10;
        //Note: Never define a constant salt in the source file
        const salt = '$2b$10$GA94lFm2QPNNF80uz6UMFu';
        const hash = await bcrypt.hash(password, salt);
        return hash
    }
        User.create({
            name: req.body.name,
            email: req.body.email,
            uname: req.body.uname,
            regno: req.body.regno,
            pass: hashedPassword(passw)
        }).then((user)=>{
        res.send(user);
    });
    });

module.exports = router;