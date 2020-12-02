//定義資料結構
const mongoose = require('mongoose')
const Schema = mongoose.Schema //依Mongoose 規定好的資料格式建立資料
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: [true, 'please fill in!']
  },
  name_en: {
    type: String,
  },
  category: {
    type: String,
    required: [true, 'please fill in!']
  },
  image: {
    type: String,
  },
  location: {
    type: String,
    required: [true, 'please fill in!']
  },
  phone: {
    type: String,
  },
  google_map: {
    type: String,
  },
  rating: {
    type: Number,
    // validate: {
    //   validator: function (v) {
    //     return /[0-5]/.test(v)  // 只能是數字0-5
    //   },
    //   message: `{VALUE} is not a number`
    // },
    min: 0,
    max: 5,
    required: [true, 'please fill in!']
  },
  description: {
    type: String,
    required: [true, 'please fill in!']
  }
})
module.exports = mongoose.model('Restaurant', restaurantSchema)