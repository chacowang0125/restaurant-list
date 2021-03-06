const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')
const restaurantList = require('../../restaurant.json')

router.get('/', (req, res) => {
    const keyword = req.query.keyword
    const restaurants = restaurantList.results.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase().trim()) || item.category.toLowerCase().includes(keyword.toLowerCase()) || item.name_en.toLowerCase().includes(keyword.toLowerCase()))
    if (restaurants.length > 0) {
        res.render('index', { restaurants, keyword })
    } else {
        res.render('noresult', { keyword })
    }
})

module.exports = router