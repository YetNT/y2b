const { Schema, model } = require('mongoose')

const blacklistSchema = new Schema({
   userId: {
      type: String,
      required: true
   },
   blacklisted: {
      type: Boolean,
      default: false
   },
   reason: {
      type: String,
      required: true
   }
})

module.exports = model('blacklist', blacklistSchema)