// 引用express
const express = require('express')
// 引用 express 路由器
const router = express.Router()
// 載入model的餐廳資料
const Restaurant = require('../../models/restaurant')

// 定義路由首頁
router.get('/', (req, res) => {
  Restaurant.find() // 取出 model內已放入的所有餐廳資料
    .lean() // 將 mongoose 的model 物件轉為js 資料陣列
    .sort({ name: 'asc' }) // 餐廳名依拼音升冪排列
    .then(restaurants => res.render('index', {
      restaurants, css: 'index.css'
    })) // 將陣列內的所有餐廳資料傳入index樣板
    .catch(error => console.log(error))
})

router.get('/asc', (req, res) => {
  Restaurant.find() // 取出 model內已放入的所有餐廳資料
    .lean() // 將 mongoose 的model 物件轉為js 資料陣列
    .sort({ name: 'asc' }) // 餐廳名依拼音升冪排列
    .then(restaurants => res.render('index', {
      restaurants, css: 'index.css'
    })) // 將陣列內的所有餐廳資料傳入index樣板
    .catch(error => console.log(error))
})

router.get('/desc', (req, res) => {
  Restaurant.find() // 取出 model內已放入的所有餐廳資料
    .lean() // 將 mongoose 的model 物件轉為js 資料陣列
    .sort({ name: 'desc' }) // 餐廳名依拼音升冪排列
    .then(restaurants => res.render('index', {
      restaurants, css: 'index.css'
    })) // 將陣列內的所有餐廳資料傳入index樣板
    .catch(error => console.log(error))
})



// 匯出路由模組，index 會來接
module.exports = router