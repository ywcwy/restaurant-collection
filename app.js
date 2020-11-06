const express = require("express")
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
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
  console.log(restaurants)
  res.render('index', { restaurants: restaurants, keyword: keyword })
})


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})