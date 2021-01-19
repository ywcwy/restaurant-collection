const express = require('express')
const handlebars = require('handlebars')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

handlebars.registerHelper({
  isActive: function (sort, item, target, options) {
    if (item === target || sort === target) {
      return options.fn(this)
    }
  }
})

// handlebars.registerHelper({
//   isActive: function (sort, target, options) {
//     if (sort === target) {
//       return options.fn(this)
//     } else {
//       return options.inverse(this)
//     }
//   },
//   isSort: function (item, target, options) {
//     if (item === target) {
//       return options.fn(this)
//     } else {
//       return options.inverse(this)
//     }
//   }
// })

router.get('/', (req, res) => {
  const userId = req.user._id
  const item = req.query.item // 排序的項目
  let sort = req.query.sort // 排序的方式
  let sequence = ''
  Restaurant.find({ userId })
    .lean()
    .sort({ [item]: sort })
    .then(restaurants => {
      switch (item, sort) {
        case ('name', 'asc'):
          sequence = '餐廳依 A~Z 排序'
          break
        case ('name', 'desc'):
          sequence = '餐廳依 Z~A 排序'
          break
        case ('category', undefined):
          sequence = '類別依 A~Z 排序'
          break
        case ('location', undefined):
          sequence = '地區依 A~Z 排序'
          break
        default:
          sequence = '排序'
          break
      }
      res.render('index', { restaurants, css: 'index.css', item, sort, sequence })
    })
    .catch(error => console.log(error))
})

module.exports = router
