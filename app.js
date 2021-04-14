const express = require('express');
const port = 3000;
const path = require('path');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')

//DB Model and setup
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { STATUS_CODES } = require('http');
const { error } = require('console');
const Joi = require('joi');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
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



//Home Page
app.get('/', (req, res) => {
    res.render('home')
})
//All campgrounds
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))
//Creating Campgrounds
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400)
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required()
        }).required()
    })
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    console.log(result)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

}))


//Campground detail page
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground })
}))

//Campground edit pages
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground })

}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
}))

//Campground delete route
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

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