const express = require('express')
const handlebars = require('handlebars')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort({ name: 'asc' })
    .then(restaurants => res.render('index', {
      restaurants, css: 'index.css'
    }))
    .catch(error => console.log(error))
})


module.exports = router