// 引用express
const express = require('express')
// 引用 express 路由器
const router = express.Router()


// 封裝模組
// 引入 home 模組
const home = require('./modules/home')
// 將網址結構符合 / 字串的 request 導向 home.js
router.use('/', home)

// 引入 restaurants 模組程式碼
const restaurants = require('./modules/restaurants')
// 將網址結構符合 /restaurants 字串的 request 導向 restaurants.js
router.use('/restaurants', restaurants)

// 匯出路由器
module.exports = router