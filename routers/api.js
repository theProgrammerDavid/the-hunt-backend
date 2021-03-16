const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');

const hashedPassword = async(passw) => {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(passw, salt);
    return hash
}


//Login
// router.post("/user/login", async(req, res) => {
//     try {
//         const { email } = req.body;
//         const passw = req.body.pass;
//         const usr = await User.findOne({ email });
//         pass = usr.pass;
//         uname = usr.uname;
//         // console.log(passw);
//         // console.log(pass);
//         const login = await bcrypt.compare(passw, pass);
//         // console.log(login);
//         res.json({ login, uname });
//     } catch (e) {
//         res.status(500).send();
//     }
// });

//show registration page
router.get('/user/register', (_req, res) => {
    res.render('register.hbs');
});

//add new user to the db with hashing
router.post('/user/register', async(req, res) => {
    const passw = req.body.pass;
    const { name, email, uname, regno } = req.body;
    try{
        User.create({
            name,
            email,
            uname,
            regno,
            pass: await hashedPassword(passw)
        }).then((user) => {
            res.status(200).send(user);
        });
    }
    catch(e){
        console.log(e);
        res.status(500).send();
    }
});

//get list of users
// router.get('/user', function(_req, res) {
//     User.find({}).then(function(users) {
//         res.send(users);
//     });
// });

module.exports = router;