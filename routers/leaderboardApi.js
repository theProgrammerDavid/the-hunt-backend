const router = require('express').Router();
const User = require('../models/users');
const Question = require('../models/questions');
const mongoose = require('mongoose');


// API functionality check
router.get('/', (req, res, next) => {
    res.status(200).json({
    	message: "You are accessing the leaderboard api",
    });
});

//-----------------------------------------------------

// Route to get all question answers
router.get('/question/', (req, res, next) => {
	const allQuestions = Question.find({})
	.then(doc => {
		console.log(doc);
		res.status(200).json(doc);
	})
	.catch(err => {
		console.log(error);
		res.status(500).json({
			error: err
		});
	});
});

// Route to create question answers
router.post('/question/', (req, res, next) => {
	const question = new Question({
		number: req.query.qnumber,
		answer: req.query.answer
	});

	question
	.save()
	.then(result => console.log(result))
	.catch(err => console.log(err));

	res.status(200).json({
		message: "Question object created",
		question: question
	});
});

//-----------------------------------------------------


// Get sorted list of users by ranking
router.get('/all', (req, res, next) => {
	const allUsers = User.find({})
	.then(doc => {
		doc.sort((a, b)=> b.questions.length - a.questions.length);
		res.status(200).json(doc);
	})
	.catch(err => {
		console.log(err);
	    res.status(500).json({
	    	error: err
	    });
	});
});

// Get information on a specific user
router.get('/user', (req, res, next) => {
	res.status(200).json({
		message: "Get ranking of user; In progress"
	});
});

// Check if user has completed a question and update him
router.post('/user', (req, res, next) => {
	const qno = req.query.qnumber;
	const ans = req.query.answer;
	const uname = req.query.username;
	const pass = req.query.password;

	console.log(qno, ans, uname, pass);
	const userData = User.findOne({
		uname: uname,
		pass: pass
	})
	.then(doc => {
		if (doc){
			console.log(doc);
			const qa = Question.findOne({
				number: qno,
				answer: ans
			})
			.then(out => {
				if (out){
					console.log(out);
					quesList = doc.questions
					if (quesList.includes(qno)){
						throw "User has already solved this question"
					} else {
						quesList.push(qno)
						User.update(doc, {questions: quesList});
						res.status(200).json({
							answer: "correct"
						});
					}
				} else {
					throw "Either question not found or answer is wrong"
				}
			})
			.catch(err => {
				res.status(500).json({
					error: err
				});
			})
		} else {
			throw "User not found"
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});


module.exports = router