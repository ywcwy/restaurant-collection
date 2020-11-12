const express = require("express")
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant') // 載入model的餐廳資料

// 連線到資料庫
const mongoose = require('mongoose')
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
app.use(express.static('public'))

app.get('/', (req, res) => {
  Restaurant.find() // 取出 model內已放入的所有餐廳資料
    .lean() // 將 mongoose 的model 物件轉為js 資料陣列
    .then(restaurants => res.render('index', { restaurants })) // 將陣列內的所有餐廳資料傳入index樣板
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const showRestaurant = req.params.id
  const restaurants = restaurantList.results.find(item => item.id === Number(showRestaurant))
  res.render('show', { restaurant: restaurants })
})
app.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  const restaurants = restaurantList.results.filter(item => {
    return item.name.trim().toLowerCase().includes(keyword) || item.category.trim().toLowerCase().includes(keyword)
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})