const mongoose = require('mongoose')
const Restaurant = require('../restaurant') // 載入 restaurant model
const restaurantList = require('../../restaurant.json').results

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
  
  Restaurant.create(restaurantList)
    .then(() => {
      console.log("restaurantSeeder done!")
    })
    .catch(err => console.log(err))
})