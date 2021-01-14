const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // 初始化: middleware
  app.use(passport.initialize())
  app.use(passport.session())
  // 認證策略： strategy
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error', "This user hasn't registered yet."))
        }
        if (password !== user.password) {
          return done(null, false, req.flash('error', "The email or password is wrong."))
        }
        return done(null, user)
      })
      .catch(err => done(err, null))
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


