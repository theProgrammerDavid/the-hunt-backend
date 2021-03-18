const router = require('express').Router();
const User = require('../models/users');
const Question = require('../models/questions');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');


// API functionality check
router.get('/', (req, res, next) => {

	res.render('leaderboard');
});

//These functions are not needed by the actual game----

// Route to get all question answers
// router.get('/question/', (req, res, next) => {
// 	const allQuestions = Question.find({})
// 		.then(doc => {
// 			console.log(doc);
// 			res.status(200).json(doc);
// 		})
// 		.catch(err => {
// 			console.log(error);
// 			res.status(500).json({
// 				error: err
// 			});
// 		});
// });

// // Route to create question answers
// router.post('/question/', (req, res, next) => {
// 	const question = new Question({
// 		number: req.body.qno,
// 		answer: req.body.ans
// 	});

// 	question
// 		.save()
// 		.then(result => console.log(result))
// 		.catch(err => console.log(err));

// 	res.status(200).json({
// 		message: "Question object created",
// 		question: question
// 	});
// });

//-----------------------------------------------------


// Get sorted list of users by ranking
router.get('/all', async (req, res, next) => {

	try {
		const allUsers = await User.find({});
		allUsers.sort((a, b) => b.questions.length - a.questions.length);
		const responseJSON = allUsers.map(({uname, questions}) => ({uname, questions}));
		res.status(200).json(responseJSON);
	}
	catch (e) {
		console.log(e)
		res.status(500).json({
			error: e
		});
	}
});

// Get information on a specific user
router.get('/user', async (req, res, next) => {
	const uname = req.body.uname?.toString();
	if (!uname){
		res.status(500).json({
			error: "Invalid input given",
			code: 1
		});
		return;
	}

	const userData = await User.findOne({ uname });
	if (!userData) {
		return res.status(500).json({
			error: "User not found",
			code: 2
		});

	}


	let allUsers = await User.find({});
	allUsers.sort((a, b) => b.questions.length - a.questions.length);

	const rank = allUsers.findIndex(usr => usr.uname == userData.uname);


	res.status(200).json({
		message: "User data received",
		uname: userData.uname,
		rank: rank + 1,
		solved: userData.questions
	});
});

//Check if user has completed a question and update him
router.post('/user', async (req, res, next) => {
	const qno = req.body.qno?.toString();
	const ans = req.body.ans?.toString();
	const uname = req.body.uname?.toString();
	const pass = req.body.pass?.toString();
	if (!(qno && ans && uname && pass )){
		return res.status(500).json({
			error: "Invalid input given",
			code: 1
		});
	}

	if(pass.length>25 || qno.length>20 || uname.length>25 || ans.length>30){
		return res.status(500).json({
			error: "Input too large",
			code: 2,
			result: false
		});
	}

	console.log(qno, ans, uname, pass);

	const userData = await User.findOne({
		uname
	});

	if (!userData) {
		return res.status(500).json({
			error: "User doesn't exist",
			code: 3,
			result: false
		});
	}

	console.log(pass, userData.pass);
	const passCheck = await bcrypt.compare(pass, userData.pass);
	console.log(passCheck);

	if (!passCheck) {
		return res.status(500).json({
			error: "Password incorrect",
			code: 4,
			result: false
		});
	}

	const qa = await Question.findOne({
		qno,
		ans
	});

	if (!qa) {
		return res.status(500).json({
			error: "Question doesn't exist/Answer is wrong",
			code: 5,
			result: false
		});
	}

	if (userData.questions.includes(qno)) {
		return res.status(500).json({
			error: "User has already solved this question",
			code: 6,
			result: true
		});

	}

	userData.questions.push(parseInt(qno));
	userData.save()

	res.status(200).json({
		message: "User updated with question",
		code: 7,
		result: true
	});
});

module.exports = router