const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')


module.exports = app => {
  // 初始化: middleware
  app.use(passport.initialize())
  app.use(passport.session())
  // 認證策略： LocalStrategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: "This user hasn't registered yet." })
        }

        // return done(null, false, req.flash('error', "This user hasn't registered yet."))
        return bcrypt
          .compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, req.flash('error', "The email or password is wrong."))
            }
            return done(null, user)
          })
      })
      .catch(err => done(err, null))
  }))
  // 認證策略： Facebook
  passport.use(new FacebookStrategy({  // 會詢問使用者是否同意授權
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK, // 如user同意授權，會連到此條路由
    profileFields: ['email', 'displayName'] // 設定要求fb公開的使用者資料， email為必要，要拿來當帳號
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json  // user同意授權 email 及 name
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name, email, password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))
  // 序列化與反序列化 (session)
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}


