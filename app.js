const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:number', (req, res) => {
    const restaurant = restaurantList.results.find(item => item.id.toString() === req.params.number)
    res.render('show', { restaurants: restaurant })
})

app.get('/search/', (req, res) => {
    const keyword = req.query.keyword
    const restaurants = restaurantList.results.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase()))
    if (restaurants.length > 0) {
        res.render('index', { restaurants, keyword })
    } else {
        res.render('noresult', { keyword })
    }
})

app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})