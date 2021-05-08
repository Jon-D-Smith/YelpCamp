const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const mongoose = require('mongoose');
const Campground = require('../models/campground')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20 + 10)
        const camp = new Campground({
            author: '6088b66ea42e3c00582b41a7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {

                    url: 'https://res.cloudinary.com/dzxzufbpu/image/upload/v1619906449/YelpCamp/tq4xuioeko1nt3rfszht.jpg',
                    filename: 'YelpCamp/tq4xuioeko1nt3rfszht'
                },
                {

                    url: 'https://res.cloudinary.com/dzxzufbpu/image/upload/v1619906451/YelpCamp/mkjtrwyt9s7yekarw9h1.jpg',
                    filename: 'YelpCamp/mkjtrwyt9s7yekarw9h1'
                }

            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                
            ]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})