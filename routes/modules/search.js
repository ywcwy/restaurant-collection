const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')


router.get('/', (req, res) => {
  const userId = req.user._id
  let keyword = req.query.keyword.trim()
  return Restaurant.find({ userId, $or: [{ name: new RegExp(keyword, 'i') }, { category: new RegExp(keyword, 'i') }] })  // 以建構子函式建立正規表達式物件，使用'i'讓文字不區分大小寫
    .lean()
    .then(restaurants => {
      if (restaurants.length === 0) {
        keyword = `無與${keyword}相關的餐廳`
      }
      return res.render('index', { restaurants, keyword, css: 'index.css' })
    })
    .catch(error => console.log(error))
})


module.exports = router