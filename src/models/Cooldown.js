const { Schema, model } = require('mongoose')

const cdSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    rob: {
        type: Boolean,
        default: false
    },
    work: {
        type: Boolean,
        default: false
    }
})

// left this, you gon have to find a way to impliment this 
// - past self before 8 PM

// fuck you

module.exports = model('cooldown', cdSchema)