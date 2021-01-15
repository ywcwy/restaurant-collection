const restaurantList = require('../restaurant.json')
const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')
const SEED_USER = [{
  email: 'user1@example.com',
  password: '12345678'
}, {
  email: 'user2@example.com',
  password: '12345678'
}]

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER[0].password, salt))
    .then(hash => userCreate(SEED_USER[0], hash))
    .then(user => {
      const userId = user._id
      return Promise.all(
        restaurantList.results.slice(0, 3).map(item => randomRestaurant(item, userId)))
    })
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER[1].password, salt))
    .then(hash => userCreate(SEED_USER[1], hash))
    .then(user => {
      const userId = user._id
      return Promise.all(
        restaurantList.results.slice(3, 6).map(item => randomRestaurant(item, userId)))
    })
    .then(() => {
      db.close()
      console.log('done')
      process.exit() //關閉這段Node執行程序
    })
})


function randomRestaurant(item, userId) {
  return Restaurant.create({
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
  })
}

function userCreate(user, hash) {
  return User.create({
    name: user.name,
    email: user.email,
    password: hash
  })
}