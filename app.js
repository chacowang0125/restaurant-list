// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant')
const bodyParser = require('body-parser')

// require express-handlebars
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
    console.log('mongodb error!')
})
db.once('open', () => {
    console.log('mongodb connected!')
})


// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
    Restaurant.find()
        .lean()
        .then(restaurants => res.render('index', { restaurants }))
        .catch(error => console.error(error))
})

app.get('/restaurants/new', (req, res) => {
    return res.render('new')
})

app.post('/restaurants', (req, res) => {
    const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
    return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

app.get('/restaurants/:number', (req, res) => {
    const restaurant = restaurantList.results.find(item => item.id.toString() === req.params.number)
    res.render('show', { restaurants: restaurant })
})

app.get('/search/', (req, res) => {
    const keyword = req.query.keyword
    const restaurants = restaurantList.results.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase().trim()))
    if (restaurants.length > 0) {
        res.render('index', { restaurants, keyword })
    } else {
        res.render('noresult', { keyword })
    }
})

// start and listen on the Express server
app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})