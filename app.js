const express = require("express")
const exphbs = require("express-handlebars")
const mongoose = require('mongoose')
const Restaurant = require("./models/Restaurant")

const app = express()
const port = 3000

//DB connect 
mongoose.connect('mongodb://localhost/restaurant-list')

const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(express.static("public"))

//首頁 瀏覽餐廳
app.get("/", (req, res) => {
  Restaurant.find({})
    .lean()
    .then(restaurantsData => res.render("index", { restaurantsData }))
    .catch(err => console.log(err))
})

//搜尋餐廳
app.get("/search", (req, res) => {
  if (!req.query.keywords) {
    res.redirect("/")
  }

  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  Restaurant.find({})
    .lean()
    .then(restaurantsData => {
      const filterRestaurantsData = restaurantsData.filter(
        data =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      )
      res.render("index", { restaurantsData: filterRestaurantsData, keywords })
    })
    .catch(err => console.log(err))
})

//瀏覽餐廳詳情
app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  Restaurant.findById(restaurantId)
    .lean()
    .then(restaurantData => res.render("show", { restaurantData }))
    .catch(err => console.log(err))
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})