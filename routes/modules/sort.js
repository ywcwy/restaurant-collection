// 引用express
const express = require('express')
const handlebars = require('handlebars')
// 引用 express 路由器
const router = express.Router()
// 載入model的餐廳資料
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
  const item = req.query.item  // 取得要排序的項目
  const sort = req.query.sort  // 排序方式
  Restaurant.find() // 取出 model內已放入的所有餐廳資料
    .lean() // 將 mongoose 的model 物件轉為js 資料陣列
    .sort({ [item]: sort }) // 餐廳名依拼音升冪排列
    .then(restaurants => res.render('index', {
      restaurants, css: 'index.css', sort, item
    })) // 將陣列內的所有餐廳資料傳入index樣板
    .catch(error => console.log(error))
})

// 如果依照以下的方式，一個路由代表一種排序方式，會讓路由的擴充性變低，因此使用以上 query 動態路由的方式


// router.get('/desc', (req, res) => {
//   const sort = req.path
//   Restaurant.find() // 取出 model內已放入的所有餐廳資料
//     .lean() // 將 mongoose 的model 物件轉為js 資料陣列
//     .sort({ name: 'desc' }) // 餐廳名依拼音降冪排列
//     .then(restaurants => res.render('index', {
//       restaurants, css: 'index.css'
//     })) // 將陣列內的所有餐廳資料傳入index樣板
//     .catch(error => console.log(error))
// })

// router.get('/location', (req, res) => {
//   const sort = req.path
//   Restaurant.find() // 取出 model內已放入的所有餐廳資料
//     .lean() // 將 mongoose 的model 物件轉為js 資料陣列
//     .sort({ location: 'asc' }) // 餐廳名依地區排列
//     .then(restaurants => res.render('index', {
//       restaurants, css: 'index.css'
//     })) // 將陣列內的所有餐廳資料傳入index樣板
//     .catch(error => console.log(error))
// })


// // router.get('/category', (req, res) => {
//   const sort = req.path
//   Restaurant.find() // 取出 model內已放入的所有餐廳資料
//     .lean() // 將 mongoose 的model 物件轉為js 資料陣列
//     .sort({ category: 'asc' }) // 餐廳名依類別排列
//     .then(restaurants => res.render('index', {
//       restaurants, css: 'index.css'
//     })) // 將陣列內的所有餐廳資料傳入index樣板
//     .catch(error => console.log(error))
// })



// 匯出路由模組，index 會來接
module.exports = router
