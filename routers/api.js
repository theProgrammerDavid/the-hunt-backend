const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
    	message: "You are accessing the api",
    });
});

router.get('/leaderboard', (req, res, next) => {
    res.status(200).json({
    	message: "You are accessing the leaderboard",
    });
});

router.get('/leaderboard/:username', (req, res, next) => {
    const uname = req.params.username;
    if (uname == "Addi"){	
	    res.status(200).json({
	    	message: "You are accessing user Addi",
	    	name: "Additya",
	    });
    } else {
    	res.status(200).json({
	    	message: "Specified user doesn't exist",
	    });
    }
});

router.patch('/leaderboard/:username', (req, res, next) => {
	res.status(200).json({
    	message: "Specified user doesn't exist",
    });
});

module.exports = router