const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/new', (req, res) => {
  res.render('new', { css: 'edit.css' })
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({
    name, name_en, category, image, location, phone, google_map, rating, description, userId
  })
    .then(() => {
      res.redirect('/')
    })
})

router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ userId, _id })
    .lean()
    .then((restaurant) => res.render('show', { restaurant, css: 'show.css' }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ userId, _id })
    .lean()
    .then((restaurant) => {
      console.log(restaurant)
      res.render('edit', { restaurant, css: 'edit.css' })
    })
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ userId, _id })
    .then(restaurant => {
      restaurant = Object.assign(restaurant, req.body) // Object.assign(target, ...sources) target指向你想要接收資料的物件，sources則放入資料的來源 
      // 同等於 restaurant.name = req.body.name...及其餘項目
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ userId, _id })
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
