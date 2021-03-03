const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
require("dotenv").config();

const leaderboardRouter = require('./routers/leaderboardRouter');

const PORT = process.env.PORT || 3000

const app = express();
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = global.Promise;

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
// Setting template Engine
app.set('view engine', 'hbs');
app.use('/public', express.static(__dirname + '/public'))

// parse application/x-www-form-urlencoded aka your HTML <form> tag stuff
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json aka whatever you send as a json object
app.use(bodyParser.json())


app.use('/api', require('./routers/api'));
app.use('/leaderboard', leaderboardRouter);

app.get('/ping', (req, res) => {
    res.json({ msg: 'pong' });
})

app.get('/', (req, res) => {
    res.render('index');
})

app.use((req, res, next) => {
	const error = new Error("Request not found");
	error.status = 404;
	next(error);
})

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	})
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})