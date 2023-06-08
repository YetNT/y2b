const { Schema, model } = require('mongoose')

const cdSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    rob: {
        type: Date,
        default: new Date(0)
    },
    work: {
        type: Date,
        default: new Date(0)
    },
    daily: {
        type: Date,
        default: new Date(0)
    },
    challenge : {
        buttons : {
            type: Date,
            default: new Date(0)
        }
    }
})
module.exports = model('cooldown', cdSchema)