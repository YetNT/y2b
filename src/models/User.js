const { Schema, model } = require('mongoose')

const userSchema = new Schema({
   userId: {
      type: String,
      required: true
   },
   balance: {
      type: Number,
      default: 0
   },
   bank: {
      type: Number,
      default: 0
   }
})

module.exports = model('user', userSchema)