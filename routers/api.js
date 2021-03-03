const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

const hashedPassword = async function hashPass(passw) {
    const salt = process.env.SALT;
    const hash = await bcrypt.hash(passw, salt);
    return hash
}

//get list of users
router.get('/user', function (req, res, next) {
    User.find({}).then(function (users) {
        res.send(users);
    });
});

//show login page
router.get('/user/login', (req, res) => {
    res.render('login.hbs');
});

//Login
router.post("/user/login", async (req, res) => {
    try {
        const email = req.body.email;
        let passw = req.body.pass;
        const result = await User.findOne({ email: email, pass: await hashedPassword(passw) });
        
        if (result) {
            res.json({ "login": true });
        }
        // if (result.pass === await hashedPassword(passw)) {
        //     res.json({ "login": true });
        // }
        res.json({ "login": false });
    }
    catch (e) {
        res.send();
        // send some error code here
    }
    // const pass = req.body.pass;
    // User.findOne({ email: email }, async (err, foundResults) => {
    //     console.log(foundResults.pass)

    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         if (foundResults.pass === await hashedPassword(passw)) {
    //             //if(foundResults.pass == pass){
    //             res.json({ "login": true });
    //         }
    //         else {
    //             res.json({ "login": false });
    //         }
    //     }
    // });
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

    User.create({
        name: req.body.name,
        email: req.body.email,
        uname: req.body.uname,
        regno: req.body.regno,
        pass: await hashedPassword(passw)
    }).then((user) => {
        res.send(user);
    });
});

module.exports = router;