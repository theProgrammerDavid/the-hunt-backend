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

router.post("/user/login", async (req, res) => {
    try {
        const email = req.body.email?.toString();
        const passw = req.body.pass?.toString();
        const usr = await User.findOne({ email: email });
        pass = usr.pass;
        uname = usr.uname;
        const login = await bcrypt.compare(passw, pass);
        res.json({ login, uname });
    } catch (e) {
        res.status(500).send(e);
    }
});

//add new user to the db with hashing
router.post('/user/register', async (req, res) => {
    console.log("ROUTE: api/user/register, POST");
    const passw = req.body.pass?.toString();
    const email = req.body.email?.toString();
    const uname = req.body.uname?.toString();
    const regno = req.body.regno?.toString();
    if(req.body.pass.length<25 && req.body.email.length<100 && req.body.uname.length<25 && (req.body.regno.length==9 || req.body.regno.length==0)){
        console.log("Input length valid");
        try {
            const resp = await User.create({
                email,
                uname,
                regno,
                pass: await hashedqPassword(passw)
            })
<<<<<<< HEAD
            console.log("DATA:", email, uname, regno);
            res.redirect("/?alert=success")
=======
            res.redirect("/?mesgs=Success")
>>>>>>> 77de1d2c4f09d326f87a5aef7c5631502b567e92
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ msg: 'something went wrong' });
        }
    }else{
        console.log("Invalid input length");
        res.redirect("/?alert=Invalid Length")
    }
});

module.exports = router;