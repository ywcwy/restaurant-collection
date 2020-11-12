//定義資料結構
const mongoose = require('mongoose')
const Schema = mongoose.Schema //依Mongoose 規定好的資料格式建立資料
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  google_map: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('Restaurant', restaurantSchema)