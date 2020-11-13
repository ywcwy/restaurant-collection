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


// 1. create new restaurant
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})


app.post('/restaurants', (req, res) => {
  const item = req.body
  return Restaurant.create({ // 將新增的餐廳資料存入資料庫
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
    .then(() => res.redirect('/')) // 新增餐廳資料後導入首頁
    .catch(error => console.log(error))
})

// 2. show each detail
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant, css: 'show.css' }))
    .catch(error => console.log(error))
})

//3. edit each detail
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant, css: 'show.css' }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  const item = req.body
  return Restaurant.findById(id)
    .then(restaurant => {
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
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim()
  return Restaurant.find({ $or: [{ name: new RegExp(keyword, 'i') }, { category: new RegExp(keyword, 'i') }] })
    .lean()
    .then(restaurants => {
      if (restaurants.length === 0) {
        return alert(`無與${keyword}相關的餐廳`);
      }
      res.render('index', { restaurants, keyword, css: 'index.css' })
    })
    .catch(error => console.log(error))
})


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})