// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const restaurantList = require('./restaurant.json')


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

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
    res.render('index', { restaurants: restaurantList.results })
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