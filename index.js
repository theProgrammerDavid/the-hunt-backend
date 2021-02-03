const express = require('express');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');

const leaderboardRouter = require('./routers/leaderboardRouter');

const PORT = process.env.PORT || 3000

const app = express();

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
// Setting template Engine
app.set('view engine', 'hbs');
app.use('/static', express.static(__dirname + '/public'))

// parse application/x-www-form-urlencoded aka your HTML <form> tag stuff
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json aka whatever you send as a json object
app.use(bodyParser.json())

app.use('/leaderboard', leaderboardRouter);

app.get('/ping', (req, res) => {
    res.json({ msg: 'pong' });
})

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})