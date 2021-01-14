const restaurantList = require('../restaurant.json')
// 連線資料庫
const Restaurant = require('../restaurant') //載入 restaurant model的資料結構
const User = require('../user')
const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: 'root'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(
        restaurantList.results.map((item) =>
          Restaurant.create({
            name: item.name,
            name_en: item.name_en,
            category: item.category,
            image: item.image,
            location: item.location,
            phone: item.phone,
            google_map: item.google_map,
            rating: item.rating,
            description: item.description,
            userId
          }))
      )
    })
    .then(() => {
      db.close()
      console.log('done')
      process.exit() //關閉這段Node執行程序
    })
})