// 引用express
const express = require('express')
// 引用 express 路由器
const router = express.Router()
// 載入model的餐廳資料
const Restaurant = require('../../models/restaurant')

// create new restaurant
router.get('/new', (req, res) => { //進入新增餐廳的頁面
  res.render('new', { css: 'edit.css' })
})

router.post('/', (req, res) => { //填入新餐廳的資料並存欓
  const item = req.body  // 將填入的資訊以item 取出
  return Restaurant.create({  // 依項目存入資料庫
    name: item.name,
    name_en: item.name_en,
    category: item.category,
    image: item.image,
    location: item.location,
    phone: item.phone,
    google_map: item.google_map,
    rating: item.rating,
    description: item.description
  })
    .then(() => res.redirect('/')) // 完成新增餐廳資料後導回首頁
    .catch(error => console.log(error))
})

// show each detail
router.get('/:id', (req, res) => {
  const id = req.params.id  // 拿到使用者想瀏覽的餐廳的id
  return Restaurant.findById(id)  //在資料庫中尋找相同的id項目
    .lean()  // 將資料庫中的物件轉為js陣列
    .then((restaurant) => res.render('show', { restaurant, css: 'show.css' }))  // 顯示該id餐廳的 show page
    .catch(error => console.log(error))
})

// edit each detail
router.get('/:id/edit', (req, res) => {
  const id = req.params.id  // 拿到使用者想修改的餐廳的id
  return Restaurant.findById(id)  //在資料庫中尋找相同的id項目
    .lean()  // 將資料庫中的物件轉為js陣列
    .then((restaurant) => res.render('edit', { restaurant, css: 'edit.css' }))  //顯示該id餐廳的 edit page
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const item = req.body   // 將修改好的資料以item取出
  return Restaurant.findById(id)  //在資料庫中尋找相同的餐廳id
    .then(restaurant => {  // 找到對應的id後儲存在資料庫
      restaurant = Object.assign(restaurant, req.body) // Object.assign(target, ...sources) target指向你想要接收資料的物件，sources則放入資料的來源 
      // restaurant.name = item.name,
      //   restaurant.name_en = item.name_en,
      //   restaurant.category = item.category,
      //   restaurant.image = item.image,
      //   restaurant.location = item.location,
      //   restaurant.phone = item.phone,
      //   restaurant.google_map = item.google_map,
      //   restaurant.rating = item.rating,
      //   restaurant.description = item.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))  // 此為網址顯現，導入該餐廳修改完後的show page
    .catch(error => console.log(error))
})



// delete item
router.delete('/:id', (req, res) => {
  const id = req.params.id  // 拿到使用者想刪除的餐廳的id
  return Restaurant.findById(id)  //在資料庫中尋找相同的餐廳id
    .then((restaurant) => restaurant.remove())  // 將該餐廳資料移除
    .then(() => res.redirect('/'))  // 重新導回首頁
    .catch(error => console.log(error))
})

// 匯出路由模組，index 會來接
module.exports = router
