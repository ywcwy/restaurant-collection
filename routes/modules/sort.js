const express = require('express')
const handlebars = require('handlebars')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

handlebars.registerHelper({
  ifActive: function (sort, target, options) {
    if (sort === target) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  ifSort: function (item, target, options) {
    if (item === target) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  }
})

router.get('/', (req, res) => {
  const userId = req.user._id
  const item = req.query.item
  const sort = req.query.sort
  Restaurant.find({ userId })
    .lean()
    .sort({ [item]: sort })
    .then(restaurants => res.render('index', {
      restaurants, css: 'index.css', sort, item
    }))
    .catch(error => console.log(error))
})

module.exports = router
