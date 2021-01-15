const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')


router.get('/', (req, res) => {
  const userId = req.user._id
  let keyword = req.query.keyword.trim()
  Restaurant.find({ userId, $or: [{ name: new RegExp(keyword, 'i') }, { category: new RegExp(keyword, 'i') }] })  // 以建構子函式建立正規表達式物件，使用'i'讓文字不區分大小寫
    .lean()
    .then(restaurants => {
      if (!restaurants.length) {
        const search_msg = `無與${keyword}有關的關鍵字。`
        return res.render('index', { restaurants, css: 'index.css', search_msg })
      }
      return res.render('index', { restaurants, css: 'index.css' })
    })
    .catch(error => console.log(error))
})


module.exports = router