const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('leaderboard');
});

module.exports = router;