const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const user = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login', { css: 'index.css' })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))


router.get('/register', (req, res) => {
  res.render('register', { css: 'index.css' })
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: '全部項目都是必填。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不符。' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, password, confirmPassword })
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: '此 email 已註冊過。' })
        return res.render('register', { errors, name, email, password, confirmPassword })
      }
      return User.create({ name, email, password })
    })
    .then(() => res.render('registerSuccess'))
    .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '您已成功登出。')
  res.redirect('/users/login')
})

module.exports = router