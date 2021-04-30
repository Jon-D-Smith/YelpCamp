const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js')
const Campground = require('../models/campground');


//All campgrounds
router.get('/', catchAsync(campgrounds.index))

//Creating Campgrounds
router.get('/new', isLoggedIn, campgrounds.renderNewForm)
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

//Campground detail page
router.get('/:id', catchAsync(campgrounds.showCampground))

//Campground edit pages
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

//Campground delete route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;