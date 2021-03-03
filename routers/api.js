const router = require('express').Router();
const User = require('../models/users');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    res.status(200).json({
    	message: "You are accessing the api",
    });
});

router.get('/leaderboard', (req, res, next) => {
	const allUsers = User.find({}, (err, userList) => {
	    userList.sort((a, b)=> b.questions.length - a.questions.length);
    res.status(200).json(userList);
	});
});


router.get('/leaderboard/users', (req, res, next) => {
    const usrname = req.query.username;
    console.log('--------');
    console.log(usrname);
    console.log('--------');

    const allUsers = User.find({}, (err, userList) => {
	    userList.sort((a, b)=> b.questions.length - a.questions.length);

	    User.find({"uname": usrname}, (err, result) => {
	    	if (err) {
	    		res.status(200).json({
	    			message: err
	    		});
	    	} else {
	    		console.log(result[0]["name"])
	    		let rank = -1;
	    		for (var i = 0; i < userList.length; i++) {
	    			if (userList[i].uname == result[0].uname){
	    				rank = i + 1
	    			}
	    		}
	    		console.log(rank);
	    		res.status(200).json({
	    			name: result[0].name,
	    			email: result[0].email,
	    			questions: result[0].questions,
	    			rank: rank
	    		});
	    	}
	    });
    })

});


router.post('/leaderboard/users', (req, res, next) => {
	const ques = req.query.ques;
	const usrname = req.query.username;

	console.log('------');
	console.log(ques, usrname);
	console.log('------');

	User.find({"uname": usrname}).then(doc =>{
		
		console.log(doc[0].questions);
		let update = doc[0].questions.concat([parseInt(ques)]);
		console.log(update);
		console.log(doc);
		
		User.updateOne({"uname": usrname},  {'$set':  {'questions': update}}, (err, result) => {
			if (err){
				res.status(500).json({
					error: err
				})
			} else {
				res.status(200).json({
					message: "User updated"
				})
			}
		});
	}).catch(err => {
		res.status(500).json({
			message: err
		})
	});
});


router.get('/user',function(req,res,next){
    User.find({}).then(function(users){
        res.send(users);
    });
});


module.exports = router