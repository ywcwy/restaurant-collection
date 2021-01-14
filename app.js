const express = require('express')
const session = require('express-session')
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const usePassport = require('./config/passport')
const flash = require('connect-flash')

// 引用路由器，路徑設定為/routes，就會自動去尋找目錄下叫做index的檔案
const routes = require('./routes')

require('./config/mongoose')

const app = express()
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(express.static('public'), bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.passportError = req.flash('error')
  res.locals.search_msg = req.flash('search_msg')
  next()
})
app.use(routes)



app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})