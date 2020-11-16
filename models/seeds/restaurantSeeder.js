const restaurantList = require('../restaurant.json')
// 連線資料庫
const Restaurant = require('../restaurant') //載入 restaurant model的資料結構

const db = require('../../config/mongoose')

db.once('open', () => {
  restaurantList.results.forEach((item) => {
    Restaurant.create({  //將model的資料結構依屬性放入value
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
  })
  console.log('done')
})