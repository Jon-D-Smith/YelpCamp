const express = require('express');
const port = 3000;
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')

//DB Model and setup
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { STATUS_CODES } = require('http');
const { error } = require('console');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//Routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

//DB Checking for errors
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('database connected');
});

const app = express();
//setting View engine and template engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//App use
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


//Home Page
app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    if (!err.message) err.message = "Oh no, something went wrong!";
    res.status(statusCode).render('error', { err });
})


//Start server
app.listen(port, () => {
    console.log(`Connected on port ${port}`);
})