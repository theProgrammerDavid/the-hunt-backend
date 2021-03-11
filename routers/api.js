const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

const hashedPassword = async function hashPass(passw) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(passw, salt);
    return hash
}

//show login page
router.get('/user/login', (req, res) => {
    res.render('login.hbs');
});

//Login
router.post("/user/login", async (req, res) => {
    try {
        const email = req.body.email;
        let passw = req.body.pass;
        const result = await User.find({ email: email });
        console.log(passw);
        console.log(result[0].pass);
        bool = bcrypt.compare(passw,result[0].pass).then((res) => {return res});
        if (bool === true) {
            res.json({ "login": true });
        }
        else{
            res.json({ "login": false });
        }
        console.log(bool);

        
    }
    catch (e) {
        res.status(500).send();
    }
});

//show registration page
router.get('/user/register', (req, res) => {
    res.render('register.hbs');
});

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
        res.status(200).send(user);
    });
});

//get list of users
router.get('/user', function (req, res, next) {
    User.find({}).then(function (users) {
        res.send(users);
    });
});

module.exports = router;