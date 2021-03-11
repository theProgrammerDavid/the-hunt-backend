const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

const hashedPassword = async(passw) => {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(passw, salt);
    return hash
}

//show login page
router.get('/user/login', (_req, res) => {
    res.render('login.hbs');
});

//Login
router.post("/user/login", async(req, res) => {
    try {
        const { email } = req.body;
        const passw = req.body.pass;
        const { pass } = await User.findOne({ email });
        // console.log(passw);
        // console.log(pass);
        const login = await bcrypt.compare(passw, pass);
        // console.log(login);
        res.json({ login });
    } catch (e) {
        res.status(500).send();
    }
});

//show registration page
router.get('/user/register', (_req, res) => {
    res.render('register.hbs');
});

//add new user to the db with hashing
router.post('/user/register', async(req, res) => {
    const passw = req.body.pass;
    const { name, email, uname, regno } = req.body;
    User.create({
        name,
        email,
        uname,
        regno,
        pass: await hashedPassword(passw)
    }).then((user) => {
        res.status(200).send(user);
    });
});

//get list of users
router.get('/user', function(_req, res) {
    User.find({}).then(function(users) {
        res.send(users);
    });
});

module.exports = router;