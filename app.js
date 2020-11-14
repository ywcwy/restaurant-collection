const express = require("express")
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant') // 載入model的餐廳資料

// 連線到資料庫
const mongoose = require('mongoose')
const restaurant = require("./models/restaurant")
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫連線狀態
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'), bodyParser.urlencoded({ extended: true }))

// create routing
// 1. render index
app.get('/', (req, res) => {
  Restaurant.find() // 取出 model內已放入的所有餐廳資料
    .lean() // 將 mongoose 的model 物件轉為js 資料陣列
    .then(restaurants => res.render('index', {
      restaurants, css: 'index.css'
    })) // 將陣列內的所有餐廳資料傳入index樣板
    .catch(error => console.log(error))
})


// 2. create new restaurant
app.get('/restaurants/new', (req, res) => { //進入新增餐廳的頁面
  res.render('new', { css: 'edit.css' })
})

app.post('/restaurants', (req, res) => { //填入新餐廳的資料並存欓
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

// 3. show each detail
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id  // 拿到使用者想瀏覽的餐廳的id
  return Restaurant.findById(id)  //在資料庫中尋找相同的id項目
    .lean()  // 將資料庫中的物件轉為js陣列
    .then((restaurant) => res.render('show', { restaurant, css: 'show.css' }))  // 顯示該id餐廳的 show page
    .catch(error => console.log(error))
})

// 4. edit each detail
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id  // 拿到使用者想修改的餐廳的id
  return Restaurant.findById(id)  //在資料庫中尋找相同的id項目
    .lean()  // 將資料庫中的物件轉為js陣列
    .then((restaurant) => res.render('edit', { restaurant, css: 'edit.css' }))  //顯示該id餐廳的 edit page
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
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
    .then(() => res.redirect(`/restaurants/${id}`))  // 導入該餐廳修改完後的show page
    .catch(error => console.log(error))
})

// 5. search
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()  // 將使用者輸入的關鍵字存入keyword
  return Restaurant.find({ $or: [{ name: new RegExp(keyword, 'i') }, { category: new RegExp(keyword, 'i') }] })  // 以建構子函式建立正規表達式物件，使用'i'讓文字不區分大小寫
    .lean()
    .then(restaurants => {  //如查詢到的restaurants陣列為空
      if (restaurants.length === 0) {
        return alert(`無與${keyword}相關的餐廳`);
      }
      res.render('index', { restaurants, keyword, css: 'index.css' })  // 將搜尋完的結果導回index頁面
    })
    .catch(error => console.log(error))
})

// 6. delete item
app.get('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id  // 拿到使用者想刪除的餐廳的id
  return Restaurant.findById(id)  //在資料庫中尋找相同的餐廳id
    .then((restaurant) => restaurant.remove())  // 將該餐廳資料移除
    .then(() => res.redirect('/'))  // 重新導回首頁
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})