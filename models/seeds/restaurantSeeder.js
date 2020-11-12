const restaurantList = require('../restaurant.json')
// 連線資料庫
const mongoose = require('mongoose')
const Restaurant = require('../restaurant') //載入 restaurant model
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  restaurantList.results.forEach((item) => {
    Restaurant.create({
      name: item.name,
      name_en: item.name_en,
      category: item.category,
      location: item.location,
      phone: item.phone,
      google_map: item.google_map,
      rating: item.rating,
      description: item.description
    })
  })


})