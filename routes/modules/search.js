
// 引用express
const express = require('express')
// 引用 express 路由器
const router = express.Router()
// 載入model的餐廳資料
const Restaurant = require('../../models/restaurant')


// search
router.get('/', (req, res) => {
  let keyword = req.query.keyword.trim()  // 將使用者輸入的關鍵字存入keyword
  return Restaurant.find({ $or: [{ name: new RegExp(keyword, 'i') }, { category: new RegExp(keyword, 'i') }] })  // 以建構子函式建立正規表達式物件，使用'i'讓文字不區分大小寫
    .lean()
    .then(restaurants => {  //如查詢到的restaurants陣列為空
      if (restaurants.length === 0) {
        keyword = `無與${keyword}相關的餐廳`
      }
      res.render('index', { restaurants, keyword, css: 'index.css' })  // 將搜尋完的結果導回index頁面
    })
    .catch(error => console.log(error))
})

// 匯出路由模組，index 會來接
module.exports = router