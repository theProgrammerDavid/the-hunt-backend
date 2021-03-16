const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');

const hashedPassword = async (passw) => {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(passw, salt);
    return hash
}

//show registration page
router.get('/user/register', (_req, res) => {
    res.render('register.hbs');
});

//add new user to the db with hashing
router.post('/user/register', async (req, res) => {
    console.log(req.body);
    const passw = req.body.pass;
    const { email, uname, regno } = req.body;
    try {
        const resp = await User.create({
            email,
            uname,
            regno,
            pass: await hashedPassword(passw)
        })

        res.redirect("/?alert=success")
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ msg: 'something went wrong' });
    }
});

module.exports = router;